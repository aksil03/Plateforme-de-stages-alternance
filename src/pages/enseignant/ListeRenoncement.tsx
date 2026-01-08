import React, { useState, useEffect } from "react";
import {
  Loader2,Briefcase,User,Building2,MessageSquare} from "lucide-react";

interface Renoncement {
  id_candidature: number;
  id_etudiant: number;
  id_offre: number;
  justificatif_renoncement: string;
  nom: string;
  prenom: string;
  email: string;
  titre: string;
  entreprise_nom: string;
}

export default function ListeRenoncement() {
  const [renoncements, setRenoncements] = useState<Renoncement[]>([]);
  const [charger, setCharger] = useState(true);

  const id_enseignant = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRenoncements = async () => {
      if (!id_enseignant) return;
      try {
        setCharger(true);
        const res = await fetch(
          `http://localhost:5000/api/enseignant/${id_enseignant}/renoncement`
        );
        if (res.ok) {
          const data = await res.json();
          setRenoncements(data);
        }
      } catch (error) {
        console.error("Erreur chargement renoncements:", error);
      } finally {
        setCharger(false);
      }
    };
    fetchRenoncements();
  }, [id_enseignant]);

  if (charger)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-white">
          Etudiants ayant renoncé
        </h2>
      </div>

      {renoncements.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/20 italic">
          Aucun désistement signalé pour vos étudiants.
        </div>
      ) : (
        <div className="grid gap-6">
          {renoncements.map((r) => (
            <div
              key={r.id_candidature}
              className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <User size={18} className="text-blue-400" />
                      <span className="font-bold text-lg">
                        {r.prenom} {r.nom}
                      </span>
                      <span className="text-white/40 text-sm">({r.email})</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <Briefcase size={16} /> {r.titre}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/60">
                        <Building2 size={16} /> {r.entreprise_nom}
                      </span>
                    </div>
                  </div>

                  {r.justificatif_renoncement ? (
  <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex-1 md:max-w-md">
    <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-2">
      <MessageSquare size={14} /> Motif du renoncement
    </div>
    <p className="text-white/80 text-sm italic leading-relaxed">
      "{r.justificatif_renoncement}"
    </p>
  </div>
) : (
  <div className="flex items-center text-white/20 text-xs italic">
    renoncement simple
  </div>
)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
