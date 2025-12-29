import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Etudiant {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  statut_recherche: boolean;
}

interface Offre {
  id_offre: number;
  titre: string;
}

interface Entreprise {
  id_entreprise: number;
  nom: string;
}

export default function ConsulterEtudiants() {
  const [etudiant, setEtudiant] = useState<Etudiant[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null); 
  const [charger, setCharger] = useState(true);
  const [offreSelectionnee, setOffreSelectionnee] = useState<{ [key: number]: number }>({});

  const id_entreprise = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/entreprises/etudiants_disponible"
        );
        const data = await res.json();
        setEtudiant(data);
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants :", error);
      } finally {
        setCharger(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/entreprises/${id_entreprise}/offres`
        );
        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur lors du chargement des offres :", err);
      }
    };
    fetchOffres();
  }, [id_entreprise]);

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/entreprises/${id_entreprise}`
        );
        const data = await res.json();
        setEntreprise(data); 
      } catch (err) {
        console.error("Erreur chargement entreprise :", err);
      }
    };
    fetchEntreprise();
  }, [id_entreprise]);

  const signalerOffre = async (
    id_etudiant: number,
    id_offre: number,
    titre_offre: string,
    entreprise_nom: string
  ) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/entreprises/signal-offre",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_etudiant,
            id_offre,
            titre_offre,
            entreprise_nom,
          }),
        }
      );
      if (res.ok) alert("Offre signalée avec succès !");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {charger ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
          <h2 className="text-2xl font-bold text-white">
            Étudiants en recherche
          </h2>

          {etudiant.length === 0 ? (
            <div className="text-white/40 italic text-center py-20">
              Aucun étudiant disponible pour le moment.
            </div>
          ) : (
            etudiant.map((etudiantItem) => (
              <Card
                key={etudiantItem.id_utilisateur}
                className="bg-neutral-800 border-white/10 text-white"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <User className="text-blue-400" />
                  <div>
                    <p className="font-bold">
                      {etudiantItem.prenom} {etudiantItem.nom}
                    </p>
                    <p className="text-sm text-white/50">
                      {etudiantItem.filiere}
                    </p>
                    <p className="text-xs text-white/40">
                      {etudiantItem.email}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <select
                        className="border rounded-md p-1 text-sm text-black"
                        value={offreSelectionnee[etudiantItem.id_utilisateur] || ""}
                        onChange={(e) =>
                          setOffreSelectionnee({
                            ...offreSelectionnee,
                            [etudiantItem.id_utilisateur]: Number(e.target.value),
                          })
                        }
                      >
                        <option value="">-- Choisir une offre --</option>
                        {offres.map((offre) => (
                          <option key={offre.id_offre} value={offre.id_offre}>
                            {offre.titre}
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={() => {
                          const offreId =
                            offreSelectionnee[etudiantItem.id_utilisateur];
                          const offre = offres.find(
                            (o) => o.id_offre === offreId
                          );
                          if (!offre || !entreprise) {
                            alert(
                              "Veuillez choisir une offre et vérifier l'entreprise."
                            );
                            return;
                          }

                          signalerOffre(
                            etudiantItem.id_utilisateur,
                            offre.id_offre,
                            offre.titre,
                            entreprise.nom 
                          );
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Signaler offre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  );
}
