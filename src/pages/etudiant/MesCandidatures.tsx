import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, FileSearch } from 'lucide-react';

export default function MesCandidatures() {
    const [candidatures, setCandidatures] = useState([]);
    const id_etudiant = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCandidatures = async () => {
            try {
                
                const res = await fetch(`http://localhost:5000/api/etudiants/${id_etudiant}/candidatures`);
                const data = await res.json();
                setCandidatures(data);
            } catch (err) { console.error(err); }
        };
        fetchCandidatures();
    }, [id_etudiant]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'acceptée': return 'border-green-500 text-green-500 bg-green-500/10';
            case 'refusée': return 'border-red-500 text-red-500 bg-red-500/10';
            default: return 'border-amber-500 text-amber-500 bg-amber-500/10';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Suivi de mes candidatures</h2>
            <div className="space-y-3">
                {candidatures.length === 0 ? (
                    <p className="text-white/30 italic">Vous n'avez pas encore postulé à des offres.</p>
                ) : (
                    candidatures.map((c: any) => (
                        <Card key={c.id_candidature} className="bg-neutral-800/50 border-white/5">
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{c.offre_titre}</h3>
                                    <p className="text-sm text-white/40">{c.entreprise_nom} • Postulé le {new Date(c.date_candidature).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase ${getStatusStyle(c.statut_candidature)}`}>
                                        {c.statut_candidature}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}