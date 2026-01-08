import { set } from "date-fns";
import React, { useState, useEffect } from "react";
import { Loader2, X, Check, Briefcase, Mail } from "lucide-react";

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

export default function ValiderCandidatures() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [charger, setCharger] = useState(true);

  const id_entreprise = localStorage.getItem("userId");

  const handleDecision = async (
    idCandidature: number,
    decision: "accepter" | "refuser"
  ) => {
    const confirmation = window.confirm(
      `Etes vous sur de vouloir ${decision} cette candidature ?`
    );

    if (!confirmation) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/candidatures/${idCandidature}/${decision}`,
        {
          method: "PATCH",
        }
      );

      if (res.ok) {
        setCandidatures((prev) =>
          prev.filter((c) => c.id_candidature !== idCandidature)
        );
        alert(`candidature ${decision} avec succés `);
      } else {
        alert("Erruer lors de la decision");
      }
    } catch (error) {
      console.error("Erreur lors de la decision :", error);
      alert("Erreur technique");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id_entreprise) return;
      try {
        setCharger(true);
        const res = await fetch(
          `http://localhost:5000/api/entreprises/${id_entreprise}/candidatures`
        );
        if (!res.ok) {
          throw new Error("Erreur lors du fetch des candidatures");
        }
        const data = await res.json();
        setCandidatures(data);
      } catch (error) {
        console.error("Erreur lors du chargement des candidatures :", error);
      } finally {
        setCharger(false);
      }
    };
    fetchData();
  }, [id_entreprise]);

  if (charger) {
    return <Loader2 className="animate-spin"></Loader2>;
  }
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-8">
        Candidatures à traiter
      </h2>

      {candidatures.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/20 italic">
          Aucune nouvelle candidature pour le moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {candidatures.map((c) => (
            <div
              key={c.id_candidature}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04]"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {c.prenom} {c.nom}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-white/40 uppercase font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <Briefcase size={14} /> {c.titre}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} /> {c.email}
                    </span>
                    <span>
                      • Postulé le{" "}
                      {new Date(c.date_candidature).toLocaleDateString()}
                    </span>
                  </div>
                </div>






                <div className="flex items-center gap-3">

{c.statut_candidature === 'renoncée' ? (
    <div className="flex flex-col items-end gap-1">
        <span className="px-3 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-lg text-[10px] font-bold uppercase">l'étudiant a renoncé à cette offre</span>
        {c.justificatif_renoncement && (
            <button onClick={()=> alert(`Le motif de renoncement est : ${c.justificatif_renoncement}`)}
            className="text-[12px] pr-1 text-white/50 hover:text-white  transition-all"
            >
                Voir la justification
            </button>
        )}
    </div>
) : (
    <>
    <button
                    onClick={ () => handleDecision(c.id_candidature, "accepter")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl font-bold text-xs uppercase transition-all"
                  >
                    <Check size={16} />
                    Accepter
                  </button>
                  <button
                    onClick={()=> handleDecision(c.id_candidature, 'refuser')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold text-xs uppercase transition-all"
                  >
                    <X size={16} />
                    Refuser
                  </button>
    </>


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
