import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Offre {
    id_offre: number;
    titre: string;
    type: string;
    pays: string;
    adresse: string;
    description: string;
    remuneration: string;
    statut: string;
    date_validite: string;
    date_debut: string;
    date_fin: string;
    modification: number;
}

export default function MesOffres() {
    const [offres, setOffres] = useState<Offre[]>([]);
    const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState<{ type: 'error' | 'success', messages: string[] } | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    
    const id_entreprise = localStorage.getItem('userId');

    const fetchOffres = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/entreprises/${id_entreprise}/offres`);
            const data = await res.json();
            if (Array.isArray(data)) setOffres(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchOffres(); }, [id_entreprise]);

    const handleSelectOffre = async (id: number) => {
        setIsDetailLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/offres/${id}`);
            const data = await res.json();
            setSelectedOffre(data);
            setIsEditing(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOffre) return;
        setStatus(null);

        try {
            const res = await fetch(`http://localhost:5000/api/offres/${selectedOffre.id_offre}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedOffre),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', messages: ["Offre mise à jour !"] });
                setTimeout(() => {
                    setIsEditing(false);
                    setSelectedOffre(null);
                    fetchOffres();
                }, 1500);
            } else {
                if (data.isLegalError && data.errors) {
                    setStatus({ type: 'error', messages: data.errors });
                } else {
                    setStatus({ type: 'error', messages: [data.message || "Erreur de modification"] });
                }
            }
        } catch (err) { console.error(err); }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "";
        return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    };

    if (isEditing && selectedOffre) {
        return (
            <Card className="bg-neutral-800 border-white/10 text-white max-w-4xl mx-auto shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
                    <CardTitle className="text-xl font-bold">Modifier l'offre #{selectedOffre.id_offre}</CardTitle>
                    <Button variant="ghost" onClick={() => {setIsEditing(false); setStatus(null);}} className="text-white/50 hover:text-white">
                        <ArrowLeft size={18} className="mr-2"/> Retour
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {status && (
                            <div className={`md:col-span-2 p-4 rounded-lg border flex flex-col gap-2 ${status.type === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-200' : 'bg-green-900/30 border-green-500/50 text-green-200'}`}>
                                {status.messages.map((msg, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        {status.type === 'error' ? <AlertCircle size={18} className="shrink-0" /> : <CheckCircle2 size={18} className="shrink-0" />}
                                        <span className="text-sm">{msg}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Titre de l'offre</label>
                            <Input value={selectedOffre.titre} onChange={e => setSelectedOffre({...selectedOffre, titre: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Type</label>
                            <select className="w-full bg-neutral-900 border border-white/10 rounded-md h-10 px-3 text-sm text-white" value={selectedOffre.type} onChange={e => setSelectedOffre({...selectedOffre, type: e.target.value})}>
                                <option value="stage">Stage</option>
                                <option value="alternance">Alternance</option>
                                <option value="cdd">CDD</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Pays</label>
                            <Input value={selectedOffre.pays} onChange={e => setSelectedOffre({...selectedOffre, pays: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Adresse</label>
                            <Input value={selectedOffre.adresse} onChange={e => setSelectedOffre({...selectedOffre, adresse: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Rémunération (€ / mois)</label>
                            <Input type="number" value={selectedOffre.remuneration} onChange={e => setSelectedOffre({...selectedOffre, remuneration: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Date d'expiration</label>
                            <Input type="date" value={formatDate(selectedOffre.date_validite)} onChange={e => setSelectedOffre({...selectedOffre, date_validite: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Début mission</label>
                            <Input type="date" value={formatDate(selectedOffre.date_debut)} onChange={e => setSelectedOffre({...selectedOffre, date_debut: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Fin mission</label>
                            <Input type="date" value={formatDate(selectedOffre.date_fin)} onChange={e => setSelectedOffre({...selectedOffre, date_fin: e.target.value})} className="bg-neutral-900 border-white/10" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Missions</label>
                            <textarea className="w-full bg-neutral-900 border border-white/10 rounded-md p-3 text-sm min-h-[150px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={selectedOffre.description} onChange={e => setSelectedOffre({...selectedOffre, description: e.target.value})} />
                        </div>

                        <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 font-bold py-6">
                            <Save size={18} className="mr-2"/> Enregistrer les modifications
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Mes Offres Déposées</h2>
                {isDetailLoading && <Loader2 className="animate-spin text-blue-500" />}
            </div>
            
            {offres.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl text-white/30 italic">
                    Aucune offre publiée pour le moment.
                </div>
            ) : (
                offres.map((offre) => (
                    <Card 
                        key={offre.id_offre} 
                        className={`bg-neutral-800/50 border-white/5 hover:bg-neutral-800 transition-all cursor-pointer hover:translate-x-1 ${isDetailLoading ? 'opacity-50 pointer-events-none' : ''}`} 
                        onClick={() => handleSelectOffre(offre.id_offre)}
                    >
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-white">{offre.titre}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${offre.statut === 'validée' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-amber-500 text-amber-500 bg-amber-500/10'}`}>{offre.statut}</span>
                                </div>
                                <div className="flex gap-4 text-xs text-white/40 uppercase font-semibold">
                                    <span className="text-blue-400">{offre.type}</span>
                                    <span>• {offre.remuneration}€</span>
                                    <span>• {offre.modification} modif(s)</span>
                                </div>
                            </div>
                            <ArrowLeft className="rotate-180 text-white/20" size={20} />
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}