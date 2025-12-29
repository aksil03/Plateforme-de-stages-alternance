import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
    Check, X, ArrowLeft, MapPin, 
    Euro, Calendar, Clock, Briefcase, Loader2, MessageSquare, Globe 
} from 'lucide-react';

export default function ValiderOffres() {

    const motifRefus = [
        "Informations incomplètes ou incorrectes",
        "Rémunération non conforme aux standards légaux",
        "Offre hors sujet au domaine d'étude",
        "Secteur d'activité non conforme aux politiques de l'école",
        "Durée ou lieu non autorisé",
        "Autre"
    ];
    const [motifSelectionner, setMotifSelectionner] = useState("");
    const [motifTexte, setMotifTexte] = useState("");
    const [offres, setOffres] = useState<any[]>([]);
    const [selectedOffre, setSelectedOffre] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
 
    const [showRefusBox, setShowRefusBox] = useState(false);

    const id_enseignant = localStorage.getItem('userId');

    const fetchOffres = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/enseignant/${id_enseignant}/offres-a-valider`);
            const data = await res.json();
            setOffres(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOffres(); }, []);

    const handleAction = async (action: 'validée' | 'refusée') => {

        let motif = "";
        if(action === "refusée"){
           motif = motifSelectionner === "Autre" ? motifTexte : motifSelectionner;
           if(!motif){
            return alert("Veuillez préciser un motif de refus pour informer l'entreprise.")
           }
        }

        try {
            const res = await fetch(`http://localhost:5000/api/offres/${selectedOffre.id_offre}/statut`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    statut: action,
                    motif_refus: action === 'refusée' ? motif : null 
                })
            });

            if (res.ok) {
                setSelectedOffre(null);
                setShowRefusBox(false);
                setMotifSelectionner("");
                setMotifTexte("");
                fetchOffres();
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

  
    if (selectedOffre) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
                <Button variant="ghost" onClick={() => { setSelectedOffre(null); setShowRefusBox(false); }} className="text-white/50 hover:text-white">
                    <ArrowLeft size={18} className="mr-2"/> Retour à la liste
                </Button>

                <div className="bg-neutral-800 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{selectedOffre.titre}</h1>
                                <p className="text-xl text-blue-400 font-medium">{selectedOffre.entreprise_nom}</p>
                            </div>
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                {selectedOffre.type}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-neutral-900/40 rounded-2xl border border-white/5">
                                <MapPin className="text-red-400" size={24} />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Localisation</p>
                                    <p className="text-white">{selectedOffre.adresse}, {selectedOffre.pays}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-neutral-900/40 rounded-2xl border border-white/5">
                                <Euro className="text-green-400" size={24} />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Rémunération</p>
                                    <p className="text-white">{selectedOffre.remuneration} € / mois</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-neutral-900/40 rounded-2xl border border-white/5">
                                <Calendar className="text-blue-400" size={24} />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Dates de mission</p>
                                    <p className="text-white text-sm">Du {new Date(selectedOffre.date_debut).toLocaleDateString()} au {new Date(selectedOffre.date_fin).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-neutral-900/40 rounded-2xl border border-white/5">
                                <Clock className="text-amber-400" size={24} />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Expiration de l'annonce</p>
                                    <p className="text-white">{new Date(selectedOffre.date_validite).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-500"/> Description du poste
                            </h3>
                            <div className="bg-neutral-900/50 p-6 rounded-2xl text-white/80 leading-relaxed whitespace-pre-wrap border border-white/5 text-lg italic">
                                "{selectedOffre.description}"
                            </div>
                        </div>

                        {!showRefusBox ? (
                            <div className="flex gap-4 pt-6 border-t border-white/5">
                                <Button 
                                    onClick={() => handleAction('validée')}
                                    className="flex-1 bg-green-600 hover:bg-green-500 font-bold h-14 rounded-xl text-lg shadow-lg shadow-green-600/20"
                                >
                                    <Check className="mr-2" /> Valider et publier
                                </Button>
                                <Button 
                                    onClick={() => setShowRefusBox(true)}
                                    variant="destructive"
                                    className="flex-1 font-bold h-14 rounded-xl text-lg"
                                >
                                    <X className="mr-2" /> Refuser l'offre
                                </Button>
                            </div>
                        ) : (


                            
                            <div className="pt-6 space-y-4 border-t border-red-500/20 animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs tracking-widest">
                                    <MessageSquare size={16} />
                                    <span>Veuillez sélectionner un motif de refus</span>
                                </div>
                                

                                <select 
                                value ={motifSelectionner}
                                onChange={(e) => setMotifSelectionner(e.target.value)}
                                className='w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-red-500/50'
                                >
                                <option value=""> Motif de refus</option>
                                    {motifRefus.map((motif) => (
                                    <option key={motif} value={motif}>
                                        {motif}
                                    </option>
                                    ))}
                                </select>

                               {motifSelectionner === "Autre" && (
                                        <textarea
                                        className="w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-4 text-white focus:ring-2 focus:ring-red-500/50 outline-none min-h-[120px]"
                                        placeholder="Veuillez préciser le motif du refus..."
                                        value={motifTexte}
                                        onChange={(e) => setMotifTexte(e.target.value)}
                                        />
                                    )}




                                <div className="flex gap-3">
                                    <Button onClick={() => handleAction('refusée')} className="flex-1 bg-red-600 hover:bg-red-500 font-bold h-12 rounded-xl">
                                        Confirmer le refus
                                    </Button>
                                    <Button onClick={() => setShowRefusBox(false)} variant="ghost" className="flex-1 text-white/50 h-12">
                                        Annuler
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Offres à valider</h2>
            <div className="grid gap-4">
                {offres.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/20 italic">
                        Aucun dossier en attente de traitement.
                    </div>
                ) : (
                    offres.map((o) => (
                        <Card 
                            key={o.id_offre} 
                            className="bg-neutral-800/40 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                            onClick={() => setSelectedOffre(o)}
                        >
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{o.titre}</h3>
                                    <p className="text-sm text-white/40">{o.entreprise_nom} • Reçue le {new Date(o.date_debut).toLocaleDateString()}</p>
                                </div>
                                <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
                                    Examiner l'offre
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}