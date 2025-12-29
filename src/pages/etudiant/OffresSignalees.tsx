import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OffresSignalees() {
  const navigate = useNavigate();

  const [offresSignalees, setOffresSignalees] = useState<any>(null);
  const [charger, setCharger] = useState(true);

  const idEtudiant = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOffresSignalées = async () => {
      if (!idEtudiant) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/etudiants/${idEtudiant}/offres-signalees`
        );
        const data = await res.json();
        setOffresSignalees(data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des offres signalées :",
          err
        );
      } finally {
        setCharger(false);
      }
    };

    fetchOffresSignalées();
  }, [idEtudiant]);

  if (charger) {
    return <Loader2 className="animate-spin text-blue-500" size={40} />;
  }

  if (offresSignalees.length === 0) {
    return (
      <p className="text-white text-center mt-10">
        Aucune offre signalée pour le moment.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Offres Signalées</h2>
      {offresSignalees.map((offre: any) => (
        <Card
          key={offre.id_offre}
          className="bg-neutral-800 border-white/10 text-white"
        >
          <CardContent className="flex items-center justify-between">
            <div className=" relative top-2">
              <p className="font-bold text-lg">{offre.titre_offre}</p>
              <p className="text-xs text-white/40">
                Signalée le : {new Date(offre.date_signal).toLocaleDateString()}
              </p>
              <p className="text-xs text-white/40">
                Par : {offre.entreprise_nom}
              </p>
            </div>
            <Button
              onClick={() => {
                localStorage.setItem(
                  "offreSelectionnee",
                  offre.id_offre.toString()
                );
                navigate("/etudiant/consulter");
              }}
              className="bg-green-500 hover:bg-green-400 text-white flex items-center gap-2 relative top-3"
            >
              Voir <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
