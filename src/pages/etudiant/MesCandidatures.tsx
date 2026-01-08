import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2,X, XCircle, FileSearch } from 'lucide-react';


interface Candidature {
  id_candidature: number;
  id_etudiant: number;
  id_offre: number;
  statut_candidature: string;
  date_candidature: string;
  nom: string;
  prenom: string;
  email: string;
  titre: string;
  justificatif_renoncement?: string;
}

export default function MesCandidatures() {
    const [candidatures, setCandidatures] = useState([]);
    const id_etudiant = localStorage.getItem('userId');


    const handleRenoncer = async (candidature: Candidature) => {
    let justification = "";

    if (candidature.statut_candidature === 'acceptée') {
        const message = window.prompt("Cette candidature a été acceptée. Pour renoncer, vous devez fournir une justification :");
        
        if (!message || message.trim() === "") {
            alert("Le renoncement a été annulé");
            return;
        }
        justification = message;
    } else {
        if (!window.confirm("Voulez-vous vraiment retirer votre candidature ?")) return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/candidatures/${candidature.id_candidature}/renoncer`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ justificatif_renoncement: justification })
        });

        if (res.ok) {
            alert(" renoncement avec succés");
            window.location.reload(); 
        }
    } catch (err) {
        console.error("Erreur :", err);
    }
};

    useEffect(() => {
    const fetchCandidatures = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/etudiants/${id_etudiant}/candidatures`);
            if (!res.ok) {
                throw new Error(`Erreur serveur: ${res.status}`);
            }
            const data = await res.json();
            setCandidatures(data);
        } catch (err) {
            console.error("Erreur lors du fetch des candidatures:", err);
            setCandidatures([]); // pour evite d'avoir directement un écran blanc
        }
    };
    fetchCandidatures();
}, [id_etudiant]);


    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'acceptée': return 'border-green-500 text-green-500 bg-green-500/10';
            case 'refusée': return 'border-red-500 text-red-500 bg-red-500/10';
            case 'renoncée': return 'border-purple-500 text-purple-500 bg-blue-500/10';
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
                                    <h3 className="font-bold text-lg text-white">{c.offre_titre}</h3>
                                    <p className="text-sm text-white/40">{c.entreprise_nom} • Postulé le {new Date(c.date_candidature).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase ${getStatusStyle(c.statut_candidature)}`}>
                                        {c.statut_candidature}
                                    </span>
                                    {c.statut_candidature !== 'renoncée' && c.statut_candidature !== 'refusée' && c.statut_candidature !== "acceptée entreprise" &&(
                                        <button onClick={()=> handleRenoncer(c)} className=' flex items-center  text-white  p-[6px] pr-[11px] rounded-[15px] bg-red-600 hover:bg-red-800 text-[12px] font-bold uppercase transition-all'>
                                        <X size={20} className='pr-1'></X>
                                        renoncer
                                        </button>
                                    )}
                                    
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}