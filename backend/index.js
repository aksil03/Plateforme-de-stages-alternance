const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000; 


app.use(cors({
    origin: 'http://localhost:3000' 
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
    .then(() => console.log('Connexion réussie à PostgreSQL (CSI_BAAASELA)!'))
    .catch(err => console.error('Erreur de connexion à PostgreSQL. Êtes-vous sur eduroam/VPN ?\nDétails:', err.stack));


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    try {
        const queryText = `SELECT id_utilisateur, mot_de_passe, role FROM Utilisateur WHERE email = $1`;
        const result = await pool.query(queryText, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const user = result.rows[0];
        
        if (user.mot_de_passe === password) { 
            
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

app.listen(PORT, () => {
    console.log(`Serveur API backend démarré sur http://localhost:${PORT}`);
});