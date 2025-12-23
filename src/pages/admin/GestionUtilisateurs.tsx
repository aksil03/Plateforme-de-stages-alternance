import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react'; 

type EntityType = 'etudiants' | 'enseignants' | 'secretaires' | 'entreprises';

const COLUMN_MAPS: Record<EntityType, { keys: string[]; titles: string[] }> = {
    'etudiants': { 
        keys: ['id_utilisateur', 'nom', 'prenom', 'email', 'filiere', 'statut_recherche'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email', 'Filière', 'Recherche'] 
    },
    'secretaires': { 
        keys: ['id_utilisateur', 'nom', 'prenom', 'email', 'login'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email', 'Login'] 
    },
    'enseignants': { 
        keys: ['id_utilisateur', 'nom', 'prenom', 'email', 'remplacement_secretaire'], 
        titles: ['ID', 'Nom', 'Prénom', 'Email', 'Remplaçant Secr.'] 
    },
    'entreprises': { 
        keys: ['id_utilisateur', 'nom', 'siret', 'email', 'adresse'], 
        titles: ['ID', 'Raison Sociale', 'SIRET', 'Email', 'Adresse'] 
    },
};

export default function GestionUtilisateurs() {
    const [selectedEntity, setSelectedEntity] = useState<EntityType>('etudiants');
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    
   
    const [searchQuery, setSearchQuery] = useState("");

    const { keys, titles } = COLUMN_MAPS[selectedEntity];

    const fetchData = async (entity: EntityType) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${entity}`);
            const result = await response.json();
            if (response.ok) setData(result);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { 
        fetchData(selectedEntity); 
        setEditingId(null); 
        setSearchQuery(""); 
    }, [selectedEntity]);


    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase();
       
        return (
            (item.nom?.toLowerCase().includes(query)) ||
            (item.prenom?.toLowerCase().includes(query)) ||
            (item.email?.toLowerCase().includes(query))
        );
    });

    const handleEditClick = (item: any) => {
        setEditingId(item.id_utilisateur);
        setEditForm(item);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editForm, type: selectedEntity }),
            });
            if (response.ok) {
                setEditingId(null);
                fetchData(selectedEntity);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Gestion des Utilisateurs</h2>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
       
                <div className="flex items-center space-x-3">
                    <p className="text-white/60 text-sm whitespace-nowrap">Afficher :</p>
                    <Select onValueChange={(value: EntityType) => setSelectedEntity(value)} defaultValue={selectedEntity}>
                        <SelectTrigger className="w-[200px] bg-neutral-700 border-neutral-600 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-neutral-700 text-white">
                            <SelectItem value="etudiants">Étudiants</SelectItem>
                            <SelectItem value="enseignants">Enseignants</SelectItem>
                            <SelectItem value="secretaires">Secrétaires</SelectItem>
                            <SelectItem value="entreprises">Entreprises</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input 
                        placeholder="Rechercher par nom, prénom ou email..." 
                        className="pl-10 bg-neutral-900 border-neutral-700 text-white w-full focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Button onClick={() => fetchData(selectedEntity)} variant="outline" className="text-black border-neutral-600">
                    Rafraîchir
                </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-700">
                <table className="min-w-full divide-y divide-neutral-700">
                    <thead className="bg-neutral-900/50">
                        <tr>
                            {titles.map((t, i) => <th key={i} className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">{t}</th>)}
                            {(selectedEntity === 'secretaires' || selectedEntity === 'enseignants') && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                                    {keys.map((key, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-white/90">
                                            {editingId === item.id_utilisateur && key !== 'id_utilisateur' && key !== 'login' ? (
                                                typeof item[key] === 'boolean' ? (
                                                    <input 
                                                        type="checkbox" 
                                                        className="h-4 w-4 accent-blue-600"
                                                        checked={editForm[key]} 
                                                        onChange={(e) => setEditForm({...editForm, [key]: e.target.checked})}
                                                    />
                                                ) : (
                                                    <Input 
                                                        className="h-8 bg-neutral-900 border-neutral-600 text-white text-xs"
                                                        value={editForm[key] || ''} 
                                                        onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                                                    />
                                                )
                                            ) : (
                                                typeof item[key] === 'boolean' ? (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item[key] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {item[key] ? 'OUI' : 'NON'}
                                                    </span>
                                                ) : item[key] || <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                    ))}
                                    {(selectedEntity === 'secretaires' || selectedEntity === 'enseignants') && (
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {editingId === item.id_utilisateur ? (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Sauver</Button>
                                                    <Button size="sm" variant="ghost" className="text-white" onClick={() => setEditingId(null)}>Annuler</Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40" onClick={() => handleEditClick(item)}>Modifier</Button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={titles.length + 1} className="px-6 py-10 text-center text-white/40 italic">
                                    Aucun résultat trouvé pour "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}