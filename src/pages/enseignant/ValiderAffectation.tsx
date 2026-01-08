import React, { useEffect, useState } from 'react';
import { CheckCircle, User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Candidature {
    id_candidature: number;
    id_offre: number;
    id_etudiant: number;
    etudiant_nom: string;
    etudiant_prenom: string;
    offre_titre: string;
    entreprise_nom: string;
}

export default function ValiderAffectation() {
    const [candidatures, setCandidatures] = useState<Candidature[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // 1. Charger les candidatures acceptées par l'entreprise
    const fetchCandidatures = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/candidatures/acceptees');


            if (!response.ok) {
            const errorText = await response.text(); // Récupère le texte de l'erreur (HTML ou JSON)
            throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }
            const data = await response.json();
            setCandidatures(data);
        } catch (error) {
            console.error("Erreur chargement candidatures:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidatures();
    }, []);

    const handleFinaliser = async (cand: Candidature) => {
        const confirmation = window.confirm(
            `Confirmer l'affectation de ${cand.etudiant_prenom} ${cand.etudiant_nom} ?\n\n` +
            `Ceci va :\n` +
            `- Annuler ses autres candidatures (renoncée)\n` +
            `- Refuser les autres étudiants sur cette offre.`
        );

        if (!confirmation) return;

        setProcessingId(cand.id_candidature);
        try {
            const response = await fetch('http://localhost:5000/api/candidatures/affectation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_candidature: cand.id_candidature,
                    id_offre: cand.id_offre,
                    id_etudiant: cand.id_etudiant
                }),
            });

            if (response.ok) {
                alert("Affectation finalisée avec succès !");
                setCandidatures(prev => prev.filter(c => c.id_candidature !== cand.id_candidature));
                fetchCandidatures(); 
            } else {
                const errorData = await response.json();
                alert(`Erreur: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("Impossible de joindre le serveur.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Validation des Affectations</h1>
                <p className="text-white/40 mt-1 text-sm uppercase tracking-widest font-bold">
                    Dossiers acceptés par l'entreprise
                </p>
            </div>

            {candidatures.length === 0 ? (
                <div className="bg-neutral-800/50 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <AlertCircle className="mx-auto text-white/20 mb-4" size={48} />
                    <p className="text-white/40 font-medium text-lg">Aucune affectation en attente de validation finale.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {candidatures.map((cand) => (
                        <div 
                            key={cand.id_candidature} 
                            className="bg-neutral-800 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {cand.etudiant_prenom} {cand.etudiant_nom}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-white/40 text-sm italic">
                                        <Briefcase size={14} />
                                        <span>{cand.offre_titre} — {cand.entreprise_nom}</span>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={() => handleFinaliser(cand)}
                                disabled={processingId === cand.id_candidature}
                                className="bg-white text-black hover:bg-neutral-200 font-bold px-8 h-12 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-white/5"
                            >
                                {processingId === cand.id_candidature ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <CheckCircle size={20} />
                                )}
                                Valider l'affectation
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}