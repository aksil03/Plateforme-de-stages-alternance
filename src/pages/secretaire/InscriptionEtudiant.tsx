import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const FILIERES = ["L1 MIASHS", "L2 MIASHS", "L3 MIAGE", "L3 Science Co", "L3 TAL", "M1 MIAGE", "M2 MIAGE", "M1 Science Co", "M2 Science Co", "M1 TAL", "M2 TAL"];

export default function InscriptionEtudiant() {
    const [formData, setFormData] = useState({ login: '', mdp: '', nom: '', prenom: '', email: '', filiere: FILIERES[0] });

    const handleInscription = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/secretaire/inscrire-etudiant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert("Étudiant inscrit !");
            setFormData({ login: '', mdp: '', nom: '', prenom: '', email: '', filiere: FILIERES[0] });
        }
    };

    return (
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader><CardTitle className="text-blue-400">Nouvel Étudiant</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleInscription} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="bg-neutral-900 border-white/10" required />
                    <Input placeholder="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="bg-neutral-900 border-white/10" required />
                    <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-neutral-900 border-white/10" required />
                    <select 
                        value={formData.filiere}
                        onChange={e => setFormData({...formData, filiere: e.target.value})}
                        className="w-full h-10 px-3 bg-neutral-900 border border-white/10 rounded-md text-sm text-white"
                    >
                        {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <Input placeholder="Login" value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} className="bg-neutral-900 border-white/10" required />
                    <Input placeholder="Mot de passe" type="password" value={formData.mdp} onChange={e => setFormData({...formData, mdp: e.target.value})} className="bg-neutral-900 border-white/10" required />
                    <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 h-12 font-bold">Inscrire</Button>
                </form>
            </CardContent>
        </Card>
    )
}