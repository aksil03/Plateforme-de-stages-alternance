import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Euro,
  ArrowLeft,
  Send,
  Loader2,
  Calendar,
  Briefcase,
  Globe,
  Info,
  Clock,
} from "lucide-react";

export default function ConsulterOffres() {
  const [appliedOffers, setAppliedOffers] = useState<number[]>([]);


  const idOffre = localStorage.getItem("offreSelectionnee");


  const [offres, setOffres] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffre, setSelectedOffre] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cv, setCv] = useState("");
  const [lettre, setLettre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  if (!idOffre) return;

  fetch(`http://localhost:5000/api/offres/${idOffre}`)
    .then(res => res.json())
    .then(data => {
      setOffres(data); 
    });
}, [idOffre]);


  const fetchOffres = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/etudiants/offres");
      const data = await res.json();
      setOffres(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/etudiants/candidater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_etudiant: localStorage.getItem("userId"),
          id_offre: selectedOffre.id_offre,
          cv,
          lettre_motivation: lettre,
        }),
      });

      if (res.ok) {
        alert("Candidature transmise avec succès !");
        setAppliedOffers((prev) => [...prev, selectedOffre.id_offre]);
        setSelectedOffre(null);
        setCv("");
        setLettre("");
      } else if (res.status === 400) {
        const data = await res.json();
        alert(data.message);
        setAppliedOffers((prev) => [...prev, selectedOffre.id_offre]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasApplied = selectedOffre ? appliedOffers.includes(selectedOffre.id_offre) : false;

  if (selectedOffre) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
        <Button
          variant="ghost"
          onClick={() => setSelectedOffre(null)}
          className="text-white/50 hover:text-white mb-4"
        >
          <ArrowLeft size={18} className="mr-2" /> Retour à la liste
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold text-white">{selectedOffre.titre}</h1>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {selectedOffre.type}
                </span>
              </div>
              <p className="text-2xl text-blue-400/90 font-semibold">{selectedOffre.entreprise_nom}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><MapPin size={24}/></div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Localisation</p>
                  <p className="text-white font-medium">{selectedOffre.adresse}, {selectedOffre.pays}</p>
                </div>
              </div>
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Euro size={24}/></div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Rémunération</p>
                  <p className="text-white font-medium">{selectedOffre.remuneration} € / mois</p>
                </div>
              </div>
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Calendar size={24}/></div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Dates de mission</p>
                  <p className="text-white font-medium">
                    Du {new Date(selectedOffre.date_debut).toLocaleDateString()} au {new Date(selectedOffre.date_fin).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Clock size={24}/></div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Expire le</p>
                  <p className="text-white font-medium">{new Date(selectedOffre.date_validite).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Briefcase className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">Missions et profil recherché</h3>
              </div>
              <div className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
                {selectedOffre.description}
              </div>
            </div>
          </div>

          <Card className="bg-neutral-800 border-white/10 h-fit sticky top-24 shadow-2xl">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xl">Postuler à cette offre</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Lien de votre CV (PDF)
                  </label>
                  <Input
                    required
                    value={cv}
                    onChange={(e) => setCv(e.target.value)}
                    className="bg-neutral-900 border-white/5 h-12"
                    placeholder="Google Drive, Dropbox, etc..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Pourquoi vous ? (Lettre de motivation)
                  </label>
                  <textarea
                    required
                    value={lettre}
                    onChange={(e) => setLettre(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl p-4 text-sm min-h-[180px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Présentez votre motivation..."
                  />
                </div>
                <Button
                  disabled={isSubmitting || hasApplied}
                  className={`w-full font-bold py-7 rounded-xl shadow-lg transition-all 
                    ${hasApplied
                      ? "bg-orange-500 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                    }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : hasApplied ? (
                    "Déjà postulé"
                  ) : (
                    <>
                      <Send size={18} className="mr-2" /> Envoyer ma candidature
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
        <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Opportunités
          </h2>
          <p className="text-white/40 mt-1">
            Découvrez les offres validées par vos enseignants responsables.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-white/30" size={20} />
          <Input
            placeholder="Rechercher un poste..."
            className="bg-neutral-800 border-white/5 pl-12 h-14 text-lg rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-white/20 font-medium italic">
            Synchronisation avec le serveur...
          </p>
        </div>
      ) : offres.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={32} className="text-white/20" />
          </div>
          <p className="text-white/30 text-xl font-medium italic">
            Aucune offre n'est disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {offres
            .filter((o: any) =>
              o.titre.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((offre: any) => (
              <Card
                key={offre.id_offre}
                className="bg-neutral-800/40 border-white/5 hover:border-blue-500/40 hover:bg-neutral-800/60 transition-all cursor-pointer group rounded-3xl overflow-hidden"
                onClick={() => setSelectedOffre(offre)}
              >
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {offre.titre}
                      </h3>
                      <p className="text-blue-400/80 font-semibold text-lg">
                        {offre.entreprise_nom}
                      </p>
                    </div>
                    <span className="text-[10px] bg-white/5 text-white/60 px-3 py-1.5 rounded-full border border-white/10 font-black uppercase tracking-tighter">
                      {offre.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/50 mb-6">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin size={16} className="text-red-400/50" />{" "}
                      {offre.adresse}
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Euro size={16} className="text-green-400/50" />{" "}
                      {offre.remuneration}€
                    </div>
                  </div>
                  <Button className="w-full bg-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all text-white border-none h-12 rounded-xl font-bold">
                    Consulter les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
