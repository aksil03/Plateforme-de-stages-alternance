import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Définition des types d'entités que le sélecteur peut choisir
type EntityType = 'etudiants' | 'enseignants' | 'secretaires' | 'entreprises';

interface EntityData {
    id: number;
    [key: string]: any; // Permet d'avoir des colonnes dynamiques (nom, email, filiere, etc.)
}

// Dictionnaire pour les colonnes et les titres d'affichage
const COLUMN_MAPS: Record<EntityType, { keys: string[]; titles: string[] }> = {
    'etudiants': { 
        keys: ['id', 'nom', 'prenom', 'email', 'filiere'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email', 'Filière'] 
    },
    'secretaires': { 
        keys: ['id', 'nom', 'prenom', 'email', 'login'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email', 'Login'] 
    },
    'enseignants': { 
        // Le rôle est 'Enseignant_Responsable' dans la BDD, mais nous l'appelons 'Enseignants' ici.
        keys: ['id', 'nom', 'prenom', 'email'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email'] 
    },
    'entreprises': { 
        keys: ['id', 'nom', 'email', 'ville'], 
        titles: ['ID', 'Nom Entreprise', 'Email Contact', 'Ville'] 
    },
};

export default function GestionUtilisateurs() {
    // État pour l'entité actuellement sélectionnée
    const [selectedEntity, setSelectedEntity] = useState<EntityType>('etudiants');
    const [data, setData] = useState<EntityData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { keys, titles } = COLUMN_MAPS[selectedEntity];

    // Fonction pour récupérer les données de l'API
    const fetchData = async (entity: EntityType) => {
        setIsLoading(true);
        setError(null);
        setData([]);

        try {
            // Appel à la route backend : /api/users/etudiants, /api/users/secretaires, etc.
            const response = await fetch(`http://localhost:5000/api/users/${entity}`);
            const result = await response.json();

            if (response.ok) {
                // S'assurer que le résultat est un tableau
                if (Array.isArray(result)) {
                    setData(result);
                } else {
                    setError("Le format de données reçu est incorrect.");
                }
            } else {
                // Afficher le message d'erreur envoyé par le backend
                setError(result.message || `Erreur lors du chargement des ${entity}. Vérifiez les noms de tables dans le backend.`);
            }
        } catch (err) {
            console.error("Erreur réseau/serveur:", err);
            setError("Impossible de joindre le serveur API. Le backend est-il lancé sur le port 5000?");
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les données dès que l'entité sélectionnée change ou au premier rendu
    useEffect(() => {
        fetchData(selectedEntity);
    }, [selectedEntity]);


    return (
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Gestion des Utilisateurs & Partenaires</h2>
            
            <div className="flex items-center space-x-4 mb-8">
                <p className="text-white/80">Afficher :</p>
                <Select 
                    onValueChange={(value: EntityType) => setSelectedEntity(value)} 
                    defaultValue={selectedEntity}
                >
                    <SelectTrigger className="w-[250px] bg-neutral-700 border-neutral-600 text-white/90">
                        <SelectValue placeholder="Sélectionner l'entité..." />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-700 text-white border-neutral-600">
                        <SelectItem value="etudiants">Étudiants</SelectItem>
                        <SelectItem value="enseignants">Enseignants Responsables</SelectItem>
                        <SelectItem value="secretaires">Secrétaires</SelectItem>
                        <SelectItem value="entreprises">Entreprises Partenaires</SelectItem>
                    </SelectContent>
                </Select>
                {/* Bouton de rafraîchissement */}
                 <Button 
                    onClick={() => fetchData(selectedEntity)} 
                    variant="ghost" 
                    className="text-white/80 hover:bg-neutral-700"
                    disabled={isLoading}
                >
                    {isLoading ? 'Rafraîchissement...' : 'Rafraîchir'}
                </Button>
            </div>

            {error && <div className="text-sm text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700 mb-4">{error}</div>}

            {isLoading ? (
                <p className="text-white/60 py-10 text-center">Chargement des données...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-neutral-700">
                    <table className="min-w-full divide-y divide-neutral-700">
                        <thead className="bg-neutral-700">
                            <tr>
                                {/* Affichage des titres des colonnes */}
                                {titles.map((title, index) => (
                                    <th 
                                        key={index}
                                        className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                            {data.length > 0 ? (
                                data.map((item, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-neutral-700/50 transition duration-150">
                                        {/* Affichage des valeurs en utilisant les clés définies dans COLUMN_MAPS */}
                                        {keys.map((key, colIndex) => (
                                            <td 
                                                key={colIndex}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-white/90"
                                            >
                                                {item[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={titles.length} className="px-6 py-4 text-center text-white/60">
                                        Aucune donnée trouvée pour cette catégorie.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}