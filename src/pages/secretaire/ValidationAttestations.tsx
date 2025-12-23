import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Eye, Loader2 } from 'lucide-react';

interface Attestation { 
    id_utilisateur: number; 
    nom: string; 
    prenom: string; 
    filiere: string; 
    attestation_fichier: string; 
}

export default function ValidationAttestations() {
    const [attestations, setAttestations] = useState<Attestation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/secretaire/attestations-pendantes');
            const data = await res.json();
            if (Array.isArray(data)) {
                setAttestations(data);
            }
        } catch (err) {
            console.error("[ERREUR] Impossible de charger les attestations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);
const handleDecision = async (id: number, decisionLabel: 'Validé' | 'Refusé') => {
    const id_secretaire = localStorage.getItem('userId');
    

    const decisionEnum = decisionLabel === 'Validé' ? 'validée' : 'refusée';

    try {
        const res = await fetch('http://localhost:5000/api/secretaire/valider-attestation', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_utilisateur: id, 
                decision: decisionEnum, 
                id_secretaire: id_secretaire 
            })
        });

        if (res.ok) {
            fetchPending();
        } else {
            const error = await res.json();
            alert("Erreur : " + error.details);
        }
    } catch (err) {
        console.error("Erreur réseau:", err);
    }
};

    const viewDocument = (fileContent: string) => {
        if (!fileContent) return alert("Fichier manquant.");
        
        const win = window.open();
        if (win) {
            win.document.write(`
                <html>
                    <head><title>Aperçu Attestation</title></head>
                    <body style="margin:0; background: #1a1a1a; display: flex; justify-content: center; align-items: center; height: 100vh;">
                        <embed width="100%" height="100%" src="${fileContent}" type="application/pdf">
                    </body>
                </html>
            `);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-medium">Chargement des dossiers...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Validation des Assurances RC</h2>
            
            {attestations.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
                    <p className="text-white/40 italic text-lg">Aucune attestation en attente de validation.</p>
                </div>
            ) : (
                attestations.map((att) => (
                    <Card key={att.id_utilisateur} className="bg-neutral-900/50 border-white/5 hover:border-white/10 transition-all shadow-xl rounded-2xl">
                        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                            <div className="flex items-center gap-5 text-white w-full">
                                <div className="p-4 bg-amber-500/10 rounded-2xl">
                                    <Clock className="text-amber-500" size={28} />
                                </div>
                                <div>
                                    <p className="font-black text-xl tracking-tight uppercase">
                                        {att.nom} {att.prenom}
                                    </p>
                                    <p className="text-sm text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded w-fit">
                                        {att.filiere}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <Button 
                                    onClick={() => viewDocument(att.attestation_fichier)}
                                    variant="outline" 
                                    className="border-white/10 text-white hover:bg-white/10 gap-2 h-11"
                                >
                                    <Eye size={18} /> Voir
                                </Button>
                                
                                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

                                <Button 
                                    onClick={() => handleDecision(att.id_utilisateur, 'Validé')} 
                                    className="bg-green-600 hover:bg-green-700 font-bold px-6 h-11 gap-2"
                                >
                                    <CheckCircle size={18} /> Valider
                                </Button>
                                <Button 
                                    onClick={() => handleDecision(att.id_utilisateur, 'Refusé')} 
                                    variant="destructive" 
                                    className="font-bold h-11 gap-2"
                                >
                                    <XCircle size={18} /> Refuser
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}