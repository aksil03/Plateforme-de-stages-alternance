const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const fs = require('fs');
const path = require('path');

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
    .then(() => console.log('✅ Connexion réussie à PostgreSQL !'))
    .catch(err => console.error('❌ Erreur de connexion. VPN actif ?\n', err.message));

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Login et mot de passe requis.' });
    }

    try {
        const queryText = `
            SELECT 
                u.id_utilisateur, 
                u.login, 
                u.mdp, 
                u.nom, 
                u.prenom,
                u.email,
                er.remplacement_secretaire,
                et.filiere,
                et.statut_recherche,
                et.attestation_responsabilite, -- AJOUTÉ
                et.validation_attestation,    -- AJOUTÉ
                et.visibilite_infos,           -- AJOUTÉ
                CASE 
                    WHEN a.id_utilisateur IS NOT NULL THEN 'role_admin_fonc_BAAASELA'
                    WHEN s.id_utilisateur IS NOT NULL THEN 'role_secretaire_BAAASELA'
                    WHEN er.id_utilisateur IS NOT NULL THEN 'role_enseignant_BAAASELA'
                    WHEN ent.id_utilisateur IS NOT NULL THEN 'role_entreprise_BAAASELA'
                    ELSE 'role_etudiant_BAAASELA' 
                END AS role_sql
            FROM utilisateur u
            LEFT JOIN administrateur a ON u.id_utilisateur = a.id_utilisateur
            LEFT JOIN secretaire s ON u.id_utilisateur = s.id_utilisateur
            LEFT JOIN enseignant_responsable er ON u.id_utilisateur = er.id_utilisateur
            LEFT JOIN entreprise ent ON u.id_utilisateur = ent.id_utilisateur
            LEFT JOIN etudiant et ON u.id_utilisateur = et.id_utilisateur
            WHERE u.login = $1
        `;

        const result = await pool.query(queryText, [login]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        const user = result.rows[0];

        if (user.mdp !== password) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        console.log(`[LOGIN] ${login} connecté avec succès.`);

        res.json({
            message: 'Connexion réussie',
            role: user.role_sql,
            userId: user.id_utilisateur,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            login: user.login,
    
            filiere: user.filiere,
            statut_recherche: user.statut_recherche,
            attestation_responsabilite: user.attestation_responsabilite,
            validation_attestation: user.validation_attestation,
            visibilite_infos: user.visibilite_infos,
        
            isReplacement: user.remplacement_secretaire || false
        });

    } catch (err) {
        console.error('Erreur Login:', err.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});




app.post('/api/creationCompte', async(req, res) =>{

    const {role,login, password, nom, prenom, email}=req.body;

    try{

         await pool.query(`BEGIN`);

        const user = await pool.query(`
            INSERT INTO utilisateur (login, mdp, nom,prenom, email) VALUES ($1,$2,$3,$4,$5) RETURNING id_utilisateur
            `,[login, password, nom, prenom,email]);

        const userId = user.rows[0].id_utilisateur;


        if(role === 'Enseignant'){
            await pool.query(` 
               INSERT INTO enseignant_responsable (id_utilisateur, remplacement_secretaire) VALUES ($1, false) 
                `,[userId]);

        }else if(role === 'Secretaire'){

            await pool.query(` 
               INSERT INTO secretaire (id_utilisateur) VALUES ($1) 
                `,[userId]);

        }


        await pool.query(`COMMIT`);
        res.status(201).json({ message: 'Compte créé avec succès !' });

    }catch(error){
        await pool.query('ROLLBACK');
        console.error("erreur lors de la creation du comptes :", error.message);
        res.status(500).json({message: 'Erreur technique lors de la creation du compte '})

    }

});

app.get('/api/users/etudiants', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, 
                   et.filiere, et.statut_recherche, et.validation_attestation
            FROM utilisateur u
            JOIN etudiant et ON u.id_utilisateur = et.id_utilisateur
            ORDER BY u.nom ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.get('/api/entreprises/etudiants_disponible', async(req, res) =>{
    try{
const result =await pool.query(`
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, et.filiere, et.statut_recherche FROM utilisateur u
    JOIN etudiant et ON u.id_utilisateur = et.id_utilisateur 
    WHERE et.statut_recherche = true AND et.visibilite_infos =true
    ORDER BY u.nom ASC 
    `);
res.json(result.rows);
    }catch(error){
console.error("Erreru lors d ela récuperatio des etudiants disponibles :", error.message);
res.status(500).json({message : "Erreur technique lors de la récupération des étudiants disponibles"});
    }
});

app.get('/api/users/enseignants', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, er.remplacement_secretaire
            FROM utilisateur u
            JOIN enseignant_responsable er ON u.id_utilisateur = er.id_utilisateur
            ORDER BY u.nom ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/users/secretaires', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.login
            FROM utilisateur u
            JOIN secretaire s ON u.id_utilisateur = s.id_utilisateur
            ORDER BY u.nom ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/users/entreprises', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id_utilisateur, 
                ent.raison_sociale AS nom, 
                ent.siret,
                ent.email, 
                ent.adresse,      -- On utilise adresse à la place de ville
                ent.telephone,
                ent.date_derniere_offre
            FROM utilisateur u
            JOIN entreprise ent ON u.id_utilisateur = ent.id_utilisateur
            ORDER BY ent.raison_sociale ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur SQL Entreprises:", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des entreprises." });
    }
});

app.put('/api/users/update', async (req, res) => {
    const { id_utilisateur, nom, prenom, email, remplacement_secretaire, type } = req.body;

    try {
        await pool.query('BEGIN'); 

        await pool.query(
            'UPDATE utilisateur SET nom = $1, prenom = $2, email = $3 WHERE id_utilisateur = $4',
            [nom, prenom, email, id_utilisateur]
        );

        if (type === 'enseignants') {
            await pool.query(
                'UPDATE enseignant_responsable SET remplacement_secretaire = $1 WHERE id_utilisateur = $2',
                [remplacement_secretaire, id_utilisateur]
            );
        }

        await pool.query('COMMIT');
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
});







app.post('/api/secretaire/inscrire-etudiant', async (req, res) => {
    const { login, mdp, nom, prenom, email, filiere } = req.body;
    try {
        await pool.query('BEGIN');
        const userRes = await pool.query(
            'INSERT INTO utilisateur (login, mdp, nom, prenom, email) VALUES ($1, $2, $3, $4, $5) RETURNING id_utilisateur',
            [login, mdp, nom, prenom, email]
        );
        const id_u = userRes.rows[0].id_utilisateur;
     
       
      await pool.query(
    "INSERT INTO etudiant (id_utilisateur, filiere, statut_recherche, attestation_responsabilite, validation_attestation, visibilite_infos) VALUES ($1, $2, false, false, 'en attente', false)",
    [id_u, filiere]
);


        await pool.query('COMMIT');
        res.json({ message: 'Étudiant inscrit avec succès !' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Erreur lors de l'inscription :", err); // on va voir toutes les erreurs
        res.status(500).json({ message: err.message });
    }
});










app.post('/api/register-entreprise', async (req, res) => {
    const { login, mdp, email, raison_sociale, siret, adresse, telephone } = req.body;

    try {
        await pool.query('BEGIN'); 

        const userRes = await pool.query(
            `INSERT INTO utilisateur (login, mdp, nom, prenom, email) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id_utilisateur`,
            [login, mdp, raison_sociale, 'Entreprise', email]
        );

        const newUserId = userRes.rows[0].id_utilisateur;

        await pool.query(
            `INSERT INTO entreprise (id_utilisateur, raison_sociale, siret, adresse, telephone, email) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [newUserId, raison_sociale, siret, adresse, telephone, email]
        );

        await pool.query('COMMIT'); 
        res.json({ message: 'Compte entreprise créé avec succès' });

    } catch (err) {
        await pool.query('ROLLBACK'); 
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

app.post('/api/entreprises/offres', async (req, res) => {
    const { 
        id_entreprise: id_user_frontend, 
        titre, type, pays, adresse, 
        description, remuneration, date_validite, 
        date_debut, date_fin 
    } = req.body;

    try {

let typeEnum = type;
if (type.toLowerCase() === "cdd") typeEnum = "CDD";


        const entrepriseData = await pool.query("SELECT id_entreprise FROM entreprise WHERE id_utilisateur = $1", [id_user_frontend]);
        if (entrepriseData.rows.length === 0) return res.status(400).json({ message: "Profil entreprise inexistant." });
        const vrai_id_entreprise = entrepriseData.rows[0].id_entreprise;

        const dDebut = new Date(date_debut);
        const dFin = new Date(date_fin);
        let dureePourTest = (dFin.getFullYear() - dDebut.getFullYear()) * 12 + (dFin.getMonth() - dDebut.getMonth());
        if (dFin.getDate() < dDebut.getDate()) dureePourTest--;

        const reglesRes = await pool.query(
            "SELECT * FROM informations_legales WHERE LOWER(type::text) = LOWER($1) AND LOWER(pays) = LOWER($2)",
            [type, pays]
        );
        
        let erreursLegales = [];
        const remunSaisie = parseFloat(remuneration) || 0;

        for (let regle of reglesRes.rows) {
            let valeurATester;
            let appliquerRegle = true;
            
            const attrNettoye = regle.attribut.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (attrNettoye.includes('remun')) {
                valeurATester = remunSaisie;
     
                if (type.toLowerCase() === 'stage' && pays.toLowerCase() === 'france' && dureePourTest <= 2) {
                    appliquerRegle = false;
                }
            } else if (attrNettoye.includes('dure')) {
                valeurATester = dureePourTest;
            }

            if (appliquerRegle && valeurATester !== undefined) {
                const seuil = parseFloat(regle.valeur);
                let estValide = true;
                
                if (regle.operation === '>=') estValide = (valeurATester >= seuil);
                else if (regle.operation === '<=') estValide = (valeurATester <= seuil);
                else if (regle.operation === '>') estValide = (valeurATester > seuil);
                else if (regle.operation === '<') estValide = (valeurATester < seuil);
                else if (regle.operation === '=') estValide = (valeurATester === seuil);

                if (!estValide) {
                    erreursLegales.push(regle.description);
                }
            }
        }

        if (erreursLegales.length > 0) {
            return res.status(400).json({ 
                isLegalError: true, 
                errors: erreursLegales 
            });
        }

        const enseignantRes = await pool.query(`
            SELECT id_utilisateur FROM enseignant_responsable 
            ORDER BY (SELECT COUNT(*) FROM offre WHERE offre.id_enseignant = enseignant_responsable.id_utilisateur) ASC LIMIT 1
        `);
        const id_enseignant_attribue = enseignantRes.rows[0].id_utilisateur;

        await pool.query(
            `INSERT INTO offre (id_entreprise, id_enseignant, titre, type, pays, adresse, description, remuneration, statut, date_validite, date_debut, date_fin, modification) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en attente', $9, $10, $11, 0)`,
            [vrai_id_entreprise, id_enseignant_attribue, titre, typeEnum, pays, adresse, description, remunSaisie, date_validite, date_debut, date_fin]
        );

        res.json({ message: "Offre enregistrée avec succès !" });

    } catch (err) {
        console.error("ERREUR :", err.message);
        res.status(500).json({ message: "Erreur technique." });
    }
});

app.get('/api/entreprises/:id_utilisateur/offres', async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                o.id_offre, 
                o.titre, 
                o.type, 
                o.statut, 
                o.remuneration, 
                o.modification,
                o.motif_refus
            FROM offre o
            JOIN entreprise e ON o.id_entreprise = e.id_entreprise
            WHERE e.id_utilisateur = $1
            ORDER BY o.id_offre DESC
        `, [id_utilisateur]);

        res.json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
});

app.get('/api/offres/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM offre WHERE id_offre = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Offre non trouvée." });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Erreur lors de la récupération de l'offre" });
    }
});

app.put('/api/offres/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        titre, description, remuneration, type, pays, 
        adresse, date_debut, date_fin, date_validite 
    } = req.body;

    try {


        let typeEnum = type;
        if (type.toLowerCase() === "cdd") typeEnum = "CDD";


        const dDebut = new Date(date_debut);
        const dFin = new Date(date_fin);
        const diffTemps = Math.abs(dFin.getTime() - dDebut.getTime());
   
        const dureeEnMois = Math.floor(diffTemps / (1000 * 60 * 60 * 24 * 30.44));

        const reglesRes = await pool.query(
            "SELECT * FROM informations_legales WHERE LOWER(type::text) = LOWER($1) AND LOWER(pays) = LOWER($2)",
            [type, pays]
        );
        
        let erreursLegales = [];
        const remunSaisie = parseFloat(remuneration) || 0;

        for (let regle of reglesRes.rows) {
            let valeurATester = null;
            let appliquerRegle = true;
            
            const attr = regle.attribut.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (attr.includes('remun')) {
                valeurATester = remunSaisie;
                if (type.toLowerCase() === 'stage' && pays.toLowerCase() === 'france' && dureeEnMois <= 2) {
                    appliquerRegle = false;
                }
            } else if (attr.includes('dure')) {
                valeurATester = dureeEnMois;
            }

            if (appliquerRegle && valeurATester !== null) {
                const seuil = parseFloat(regle.valeur);
                let estValide = true;
                if (regle.operation === '>=') estValide = (valeurATester >= seuil);
                else if (regle.operation === '<=') estValide = (valeurATester <= seuil);
                else if (regle.operation === '>') estValide = (valeurATester > seuil);
                else if (regle.operation === '<') estValide = (valeurATester < seuil);
                else if (regle.operation === '=') estValide = (valeurATester === seuil);

                if (!estValide) {
                    erreursLegales.push(regle.description);
                }
            }
        }

        if (erreursLegales.length > 0) {
            return res.status(400).json({ 
                isLegalError: true, 
                errors: erreursLegales 
            });
        }

        await pool.query(
            `UPDATE offre 
             SET titre = $1, description = $2, remuneration = $3, type = $4, pays = $5, 
                 adresse = $6, date_debut = $7, date_fin = $8, date_validite = $9,
                 modification = modification + 1,
                 statut = 'en attente' 
             WHERE id_offre = $10`,
            [titre, description, remunSaisie, typeEnum, pays, adresse, date_debut, date_fin, date_validite, id]
        );

        res.json({ message: "Offre mise à jour avec succès. Elle doit être de nouveau validée." });

    } catch (err) {
        console.error("ERREUR PUT :", err.message);
        res.status(500).json({ message: "Erreur technique lors de la modification" });
    }
});

app.get('/api/etudiants/offres', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.id_offre, 
                o.titre, 
                o.type, 
                o.pays, 
                o.adresse, 
                o.description, 
                o.remuneration, 
                o.date_debut, 
                o.date_fin,
                o.date_validite,
                e.raison_sociale AS entreprise_nom -- Correction ici : raison_sociale au lieu de nom
            FROM offre o 
            JOIN entreprise e ON o.id_entreprise = e.id_entreprise
            WHERE o.statut = 'validée' 
            ORDER BY o.id_offre DESC
        `);
        
        console.log("Nombre d'offres validées trouvées :", result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur SQL :", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
});

app.post('/api/etudiants/candidater', async (req, res) => {
    const { id_etudiant, id_offre, cv, lettre_motivation } = req.body;

    try {
        const repetitionOffre = await pool.query(
            "SELECT 1 FROM candidature WHERE id_etudiant = $1 AND id_offre = $2",
            [id_etudiant, id_offre]
        );
       
        if(repetitionOffre.rows.length > 0){
            return res.status(400).json({message : "Vous avez déja postulé à cette offre"});
        }
        const offreRes = await pool.query("SELECT id_enseignant FROM offre WHERE id_offre = $1", [id_offre]);
        const id_enseignant = offreRes.rows[0].id_enseignant;

        await pool.query(
            `INSERT INTO candidature (
                id_etudiant, id_offre, id_enseignant_responsable, 
                statut_candidature, date_candidature, cv, lettre_motivation, modification
            ) VALUES ($1, $2, $3, 'en attente', CURRENT_TIMESTAMP, $4, $5, 0)`,
            [id_etudiant, id_offre, id_enseignant, cv, lettre_motivation]
        );

        res.json({ message: "Candidature envoyée avec succès !" });

    } catch (err) {
        console.error("Erreur de Candidature :", err.message);
        res.status(500).json({ message: "Erreur lors de la candidature : " + err.message });
    }
});




app.get('/api/etudiants/:id/candidatures', async (req, res) => {
    try {


        const result = await pool.query(`
            SELECT c.*, o.titre as offre_titre
            FROM candidature c
            JOIN offre o ON c.id_offre = o.id_offre
            JOIN entreprise e ON o.id_entreprise = e.id_entreprise
            WHERE c.id_etudiant = $1
            ORDER BY c.date_candidature DESC
        `, [req.params.id]);
        res.json(result.rows);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/enseignant/:id/offres-a-valider', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, e.raison_sociale AS entreprise_nom 
            FROM offre o 
            JOIN entreprise e ON o.id_entreprise = e.id_entreprise
            WHERE o.id_enseignant = $1 AND o.statut = 'en attente'
            ORDER BY o.id_offre ASC
        `, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur validation" });
    }
});

app.patch('/api/offres/:id/statut', async (req, res) => {
    const { id } = req.params;
    const { statut, motif_refus } = req.body; 

    try {
        await pool.query(
            `UPDATE offre 
             SET statut = $1, 
                 motif_refus = $2 
             WHERE id_offre = $3`, 
            [statut, motif_refus, id]
        );
        
        res.json({ message: `L'offre est maintenant ${statut}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
    }
});


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.patch('/api/etudiants/:id/documents', async (req, res) => {
    const { id } = req.params;
    const { attestation_data } = req.body; 

    try {
        await pool.query(
            `UPDATE etudiant 
             SET attestation_fichier = $1, 
                 attestation_responsabilite = TRUE,
                 validation_attestation = 'en attente' -- INITIALISATION CRITIQUE POUR L'ENUM
             WHERE id_utilisateur = $2`,
            [attestation_data, id]
        );
        res.json({ message: "Attestation enregistrée, statut : en attente." });
    } catch (err) {
        console.error("Erreur Upload:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/etudiants/:id/profil-complet', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                statut_recherche, 
                attestation_responsabilite, 
                CAST(validation_attestation AS TEXT) as validation_attestation, -- Cast pour éviter erreurs JSON
                visibilite_infos, 
                filiere 
             FROM etudiant 
             WHERE id_utilisateur = $1`,
            [id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Étudiant non trouvé" });
        }
    } catch (err) {
        console.error("Erreur Profil:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/etudiants/:id/attestation', async(req, res) =>{
try{
    const {id} = req.params;
    await pool.query(
        'UPDATE etudiant SET attestation_fichier = NULL,attestation_responsabilite = FALSE WHERE id_utilisateur = $1',
        [id]
    );
    res.status(200).json({message : "Attestaion supprimée avec succés"});


}catch(error){
console.log("Erreur lors de la suppression de l'attestation :", error.message);
res.status(500).json({message : "Erreur lors de la suppression de l'attestation"});
}
});

app.delete('/api/entreprises/:id/offres/:id_offre', async(req, res)=> {
    const { id_offre } =req.params;

    try{
        await pool.query(
            'DELETE FROM offre WHERE id_offre = $1',
            [id_offre]
        );
        res.status(200).json({message : "offre supprimée avec succés"});

    }catch(error){
        console.log("Erreur lors de la suppression de l'offre :", error.message);
        res.status(500).json({message : "Erreur lors de la suppression de l'offre"});
    }

});


app.get('/api/etudiants/:id/attestation', async (req, res) => {

  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT attestation_fichier, attestation_responsabilite, validation_attestation
       FROM etudiant
       WHERE id_utilisateur = $1`,
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Étudiant non trouvé" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});










app.get('/api/secretaire/attestations-pendantes', async (req, res) => {
            console.log(" attestations pendantes affichées");

    try {
        const result = await pool.query(`
            SELECT 
                u.id_utilisateur, 
                u.nom, 
                u.prenom, 
                et.filiere, 
                et.attestation_fichier,
                et.validation_attestation::TEXT as validation_attestation
            FROM utilisateur u
            JOIN etudiant et ON u.id_utilisateur = et.id_utilisateur
            WHERE et.attestation_responsabilite = true 
            AND et.validation_attestation::TEXT = 'en attente' 
            ORDER BY u.nom ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur lors du chargement :", err.message);
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/secretaire/valider-attestation', async (req, res) => {
    const { id_utilisateur, decision, id_secretaire } = req.body;
    try {
        await pool.query(
            `UPDATE etudiant 
             SET validation_attestation = $1::validation_attestation_enum,
                 id_utilisateur_validation_rc = $2,
                 modification = modification + 1
             WHERE id_utilisateur = $3`,
            [decision, id_secretaire || null, id_utilisateur]
        );
        res.json({ message: "Statut mis à jour" });
    } catch (err) {
        console.error("Erreur Validation:", err.message);
        res.status(500).json({ details: err.message });
    }
});
















const filePath = path.join(__dirname, 'offres_signalees.json');


app.post('/api/entreprises/signal-offre', async (req, res) => {
    const { id_etudiant, id_offre, titre_offre, entreprise_nom } = req.body;

    try {
        const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : '[]';
        const offres = JSON.parse(data);

        offres.push({
            id_etudiant,
            id_offre,
            titre_offre,
            entreprise_nom, 
            date_signal: new Date().toISOString()
        });

        fs.writeFileSync(filePath, JSON.stringify(offres, null, 2));

        res.json({ message: "Offre signalée avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors du signalement de l'offre" });
    }
});





app.get('/api/etudiants/:id/offres-signalees', async (req, res) => {
    const { id } = req.params;

    try {
        const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : '[]';
        const offres = JSON.parse(data);

        const etudiantOffres = offres.filter(o => o.id_etudiant == id);

        res.json(etudiantOffres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récupération des offres signalées." });
    }
});





app.get('/api/entreprises/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "ID invalide" });

  try {
    const result = await pool.query(
      "SELECT id_entreprise, raison_sociale AS nom FROM entreprise WHERE id_utilisateur = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Entreprise non trouvée" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});






app.get('/api/entreprises/:id/candidatures', async(req, res) =>{
    const {id} = req.params;

    try{
        const result = await pool.query(`
            SELECT e.raison_sociale,o.titre,c.id_candidature, c.id_etudiant, c.id_offre, c.statut_candidature,c.justificatif_renoncement, c.date_candidature, u.nom, u.prenom, u.email
            FROM candidature c
            JOIN etudiant et ON c.id_etudiant = et.id_utilisateur
            JOIN offre o ON c.id_offre = o.id_offre
            JOIN utilisateur u ON et.id_utilisateur = u.id_utilisateur
			JOIN entreprise e ON o.id_entreprise = e.id_entreprise
            WHERE e.id_utilisateur =$1 AND (c.statut_candidature = 'en attente' OR c.statut_candidature = 'renoncée')
            ORDER BY c.date_candidature DESC;
        `, [id]
            );

            res.json(result.rows);

    }catch(error){
        console.error("Erreur lors de du chargement des candidatures :", error.message);
        res.status(500).json({message : "Erreur technique lors du chargement des candidatures"});

    }


});


app.patch('/api/candidatures/:id/accepter', async (req, res)=>{
    const {id} =req.params;
    try{
         await pool.query (`
            
            UPDATE candidature
            SET statut_candidature = 'acceptée' 
            WHERE id_candidature =$1
            `
            , [id])

            res.json({message : "Candidature acceptée"});

    }catch(error){
        console.error("Erreur lors de l'acceptation de la candidature :", error.message);
        res.status(500).json({ message: error.message });
    }
});

app.patch('/api/candidatures/:id/refuser', async (req,res) => {
    const {id} =req.params;

    try{
        await pool.query(`
            
            UPDATE candidature 
            SET statut_candidature = 'refuséé'
            WHERE id_candidature= $1
            `
        ,[id]);
        res.json({message: "candidature refusée"});

    }catch(error){
        console.error("Erreur lors du refus de la candidature :", error.message);
        res.status(500).json({message : "Erreur technique lors du refus de la candidature"});

    }
});




app.patch('/api/candidatures/:id/renoncer', async (req, res)=>{
    const {id} =req.params;
    const {justificatif_renoncement} =req.body;

    try{
        await pool.query (`
            UPDATE candidature
            SET statut_candidature = 'renoncée',
            justificatif_renoncement = $1
            WHERE id_candidature = $2
            `
        , [justificatif_renoncement, id]);

        res.json({message : "Candidature renoncée"});


    }catch(error){
        console.error("Erreur lors du renoncement de la candiature :", error.message);
        res.status(500).json({message : "Erreur technique lors du renoncement"});

    }

});



app.get('/api/enseignant/:id/renoncement', async(req, res)=>{
    try {
        const result = await pool.query(`
            SELECT 
                c.id_candidature, c.id_etudiant,c.id_offre,  c.justificatif_renoncement, c.date_candidature,u.nom, 
                u.prenom, u.email, o.titre, e.raison_sociale AS entreprise_nom
            FROM candidature c
            JOIN utilisateur u ON c.id_etudiant = u.id_utilisateur
            JOIN offre o ON c.id_offre = o.id_offre
            JOIN entreprise e ON o.id_entreprise = e.id_entreprise 
            WHERE c.statut_candidature = 'renoncée'
            ORDER BY c.date_candidature DESC;
        `);

        res.json(result.rows);

    } catch(error) {
        console.error("Erreur technique lors du chargement des renoncements :", error.message);
        res.status(500).json({message : "Erreur technique"});
    }
});









app.get('/', (req, res) => {
    res.send('Serveur API du Portail des Stages en ligne !');
});





app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});