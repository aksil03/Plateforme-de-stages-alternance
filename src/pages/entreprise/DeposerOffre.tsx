import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DeposerOffre() {
    const [formData, setFormData] = useState({
        titre: '', 
        type: 'stage', 
        pays: 'France', 
        adresse: '', 
        description: '', 
        remuneration: '', 
        date_validite: '',
        date_debut: '', 
        date_fin: '' 
    });

    const [status, setStatus] = useState<{ type: 'error' | 'success', messages: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setIsLoading(true);
        
        if (formData.date_validite > formData.date_debut) {
            setStatus({ type: 'error', messages: ["La date de fin de validité ne peut pas être après le début de la mission."] });
            setIsLoading(false);
            return;
        }

        const id_entreprise = localStorage.getItem('userId'); 
        
        try {
            const res = await fetch('http://localhost:5000/api/entreprises/offres', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id_entreprise })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', messages: [data.message] });
                setFormData({
                    titre: '', type: 'stage', pays: 'France', adresse: '',
                    description: '', remuneration: '', date_validite: '',
                    date_debut: '', date_fin: ''
                });
            } else {
                if (data.isLegalError && data.errors) {
                    setStatus({ type: 'error', messages: data.errors });
                } else {
                    setStatus({ type: 'error', messages: [data.message || "Une erreur est survenue."] });
                }
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setStatus({ type: 'error', messages: ["Impossible de joindre le serveur."] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-neutral-800 border-white/10 text-white max-w-4xl mx-auto shadow-2xl">
            <CardHeader className="border-b border-white/5 mb-6">
                <CardTitle className="text-xl font-bold">Déposer une nouvelle offre</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {status && (
                        <div className={`md:col-span-2 p-4 rounded-lg border flex flex-col gap-2 ${
                            status.type === 'error' 
                            ? 'bg-red-900/30 border-red-500/50 text-red-200' 
                            : 'bg-green-900/30 border-green-500/50 text-green-200'
                        }`}>
                            {status.messages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    {status.type === 'error' ? <AlertCircle className="mt-0.5 shrink-0" size={18} /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} />}
                                    <span className="text-sm font-medium">{msg}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Titre de l'offre</label>
                        <Input 
                            required 
                            value={formData.titre} 
                            onChange={e => setFormData({...formData, titre: e.target.value})} 
                            className="bg-neutral-900 border-white/10 focus:border-blue-500 text-white" 
                            placeholder="ex: Développeur React / Node.js"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Type de contrat</label>
                        <select 
                            className="w-full bg-neutral-900 border border-white/10 rounded-md h-10 px-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="stage">Stage</option>
                            <option value="alternance">Alternance</option>
                            <option value="cdd">CDD</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Pays</label>
                        <Input 
                            required
                            value={formData.pays} 
                            onChange={e => setFormData({...formData, pays: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Adresse exacte de la mission</label>
                        <Input 
                            required
                            placeholder="ex: 15 rue de l'Université, 75007 Paris"
                            value={formData.adresse} 
                            onChange={e => setFormData({...formData, adresse: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>
                 

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Rémunération (€ / mois)</label>
                        <Input 
                            type="number" 
                            required
                            placeholder="0.00"
                            value={formData.remuneration} 
                            onChange={e => setFormData({...formData, remuneration: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Début de mission</label>
                        <Input 
                            type="date" 
                            required
                            min={today}
                            value={formData.date_debut}
                            onChange={e => setFormData({...formData, date_debut: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Fin de mission</label>
                        <Input 
                            type="date" 
                            min={formData.date_debut || today}
                            value={formData.date_fin}
                            onChange={e => setFormData({...formData, date_fin: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">
                            Date d'expiration de l'annonce
                        </label>
                        <Input 
                            type="date" 
                            required
                            min={today}
                            max={formData.date_debut || undefined}
                            value={formData.date_validite}
                            onChange={e => setFormData({...formData, date_validite: e.target.value})} 
                            className="bg-neutral-900 border-white/10 text-white" 
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Missions et profil recherché</label>
                        <textarea 
                            required
                            placeholder="Décrivez les missions..."
                            className="w-full bg-neutral-900 border border-white/10 rounded-md p-3 text-sm min-h-[150px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="md:col-span-2 bg-blue-600 hover:bg-blue-700 font-bold py-6"
                    >
                        {isLoading ? "Vérification en cours..." : "Publier l'offre pour validation"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}