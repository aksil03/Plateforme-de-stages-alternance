const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000; 


app.use(cors({
    origin: 'http://localhost:5173' 
}));


app.use(express.json());

const pool = new Pool({
    user: 'm1user1_13', 
    password: 'm1user1_13', 
    database: 'CSI_BAAASELA',
    host: 'postgresql-std-ac8e41f000ef.apps.kappsul.su.univ-lorraine.fr',
    port: 5432, 
});

pool.connect()
    .then(() => console.log('✅ Connexion réussie à PostgreSQL (CSI_BAAASELA)!'))
    .catch(err => console.error('❌ Erreur de connexion à PostgreSQL. Êtes-vous sur eduroam/VPN ?\nDétails:', err.stack));


app.get('/', (req, res) => {
    res.send('Serveur API du Portail des Stages en ligne !');
});


// ROUTE 1 : RÉCUPÉRATION DES UTILISATEURS (Corrigé: table en minuscule)
app.get('/api/utilisateurs', async (req, res) => {
    try {
        const queryText = `
            SELECT id_utilisateur, login, nom, prenom, email
            FROM utilisateur 
            ORDER BY id_utilisateur;
        `;
        
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err.stack);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des données utilisateur.' });
    }
});


// ROUTE 2 : AUTHENTIFICATION (Login) - OK
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; 
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Login et mot de passe sont requis.' });
    }

    try {
        const queryText = `
            SELECT 
                u.id_utilisateur, 
                u.mdp,                 
                CASE 
                    WHEN a.id_utilisateur IS NOT NULL THEN 'Admin'
                    WHEN s.id_utilisateur IS NOT NULL THEN 'Secretaire'
                    WHEN er.id_utilisateur IS NOT NULL THEN 'Enseignant_Responsable'
                    ELSE 'Etudiant' 
                END AS role
            FROM 
                utilisateur u           
            LEFT JOIN administrateur a ON u.id_utilisateur = a.id_utilisateur 
            LEFT JOIN secretaire s ON u.id_utilisateur = s.id_utilisateur   
            LEFT JOIN enseignant_responsable er ON u.id_utilisateur = er.id_utilisateur   
            WHERE u.login = $1
        `;
        
        const result = await pool.query(queryText, [email]); 

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const user = result.rows[0];
        console.log(`[LOGIN ROLE CHECK] Rôle déterminé pour ${email}: ${user.role}`); 

        if (user.mdp === password) { 
            
            res.json({ 
                message: 'Connexion réussie', 
                role: user.role, 
                userId: user.id_utilisateur 
            });
        } else {
            res.status(401).json({ message: 'Identifiants invalides.' });
        }

    } catch (err) {
        console.error('Erreur BDD lors de la tentative de login:', err.stack);
        res.status(500).json({ message: 'Erreur serveur interne lors du login.' });
    }
});

// ROUTE 3 : CRÉATION DE COMPTE (Corrigé: tables en minuscule)
app.post('/api/creationCompte', async (req, res) => {
    const { role, login, password, nom, prenom, email } = req.body;

    if (!role || !login || !password || !nom || !prenom || !email) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN'); 
        
        // CORRECTION DE CASSE : Colonnes et table en minuscule (mdp)
        const userQuery = `
            INSERT INTO utilisateur (login, mdp, nom, prenom, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_utilisateur;
        `;
        const userResult = await client.query(userQuery, [login, password, nom, prenom, email]);
        const newUserId = userResult.rows[0].id_utilisateur;

        let roleTable;
        if (role === 'Secretaire') {
            roleTable = 'secretaire'; // <-- TOUT EN MINUSCULES
        } else if (role === 'Enseignant') {
            roleTable = 'enseignant_responsable'; // <-- TOUT EN MINUSCULES
        } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Rôle spécifié invalide.' });
        }

        const roleQuery = `
            INSERT INTO ${roleTable} (id_utilisateur)
            VALUES ($1);
        `;
        await client.query(roleQuery, [newUserId]);

        await client.query('COMMIT'); 
        res.status(201).json({ 
            message: `Compte ${role} créé avec succès.`, 
            userId: newUserId 
        });

    } catch (err) {
        if (client) await client.query('ROLLBACK'); 
        console.error('Erreur lors de la création de compte:', err.stack);
        
        if (err.code === '23505') { 
             res.status(409).json({ message: 'Ce login ou email est déjà utilisé.' });
        } else {
            res.status(500).json({ message: 'Erreur serveur lors de la création de compte.' });
        }
    } finally {
        if (client) client.release();
    }
});


// ROUTE 4 : RÉCUPÉRATION DES UTILISATEURS ET PARTENAIRES PAR TYPE (GET /api/users/:entityType)
app.get('/api/users/:entityType', async (req, res) => {
    const { entityType } = req.params;
    let queryText = '';

    // Définition des requêtes par type d'entité (en utilisant la casse minuscule standard de PostgreSQL)
    switch (entityType) {
case 'etudiants':
            queryText = `
                SELECT 
                    u.id_utilisateur AS id, 
                    u.nom, 
                    u.prenom, 
                    u.email, 
                    e.statut_recherche AS statut,       -- Statut de recherche
                    e.id_utilisateur_inscription,       -- Qui a inscrit l'étudiant
                    e.id_utilisateur_validation_rc      -- Qui a validé la RC
                FROM utilisateur u
                JOIN etudiant e ON u.id_utilisateur = e.id_utilisateur
                ORDER BY u.nom;
            `;
            break;
        case 'secretaires':
            queryText = `
                SELECT 
                    u.id_utilisateur AS id, u.nom, u.prenom, u.email, u.login
                FROM utilisateur u
                JOIN secretaire s ON u.id_utilisateur = s.id_utilisateur
                ORDER BY u.nom;
            `;
            break;
        case 'enseignants':
            queryText = `
                SELECT 
                    u.id_utilisateur AS id, u.nom, u.prenom, u.email
                FROM utilisateur u
                JOIN enseignant_responsable er ON u.id_utilisateur = er.id_utilisateur
                ORDER BY u.nom;
            `;
            break;
        case 'entreprises':
            // Hypothèse que votre table s'appelle 'entreprise'
            queryText = `
                SELECT 
                    id_entreprise AS id, nom_entreprise AS nom, contact_email AS email, ville
                FROM entreprise
                ORDER BY nom_entreprise;
            `;
            break;
        default:
            return res.status(400).json({ message: 'Type d\'entité invalide.' });
    }

    try {
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error(`Erreur lors de la récupération des entités (${entityType}):`, err.stack);
        res.status(500).json({ message: `Erreur serveur lors de la récupération des données : ${err.message}` });
    }
});


app.listen(PORT, () => {
    console.log(`Serveur API backend démarré sur http://localhost:${PORT}`);
});