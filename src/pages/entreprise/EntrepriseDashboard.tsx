import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListOrdered, Building2 } from 'lucide-react';
import DeposerOffre from './DeposerOffre';
import MesOffres from './MesOffres';

export default function EntrepriseDashboard() {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-900 pt-20">
            <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl border-r border-white/5">
                <div className="flex items-center gap-2 mb-6 opacity-50">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Espace Partenaire</h2>
                </div>

                <nav className="flex flex-col space-y-2">
                    <Link to="/entreprise/deposer">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <PlusCircle size={18} /> Déposer une offre
                        </Button>
                    </Link>
                    <Link to="/entreprise/mes-offres">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <ListOrdered size={18} /> Gérer mes offres
                        </Button>
                    </Link>
                </nav>
            </aside>

       
            <main className="flex-1 p-10 overflow-y-auto text-white">
                <Routes>
                    <Route path="/" element={<h1 className="text-3xl font-bold">Bienvenue sur votre tableau de bord entreprise</h1>} />
                    <Route path="deposer" element={<DeposerOffre />} />
                    <Route path="mes-offres" element={<MesOffres />} />
                </Routes>
                <Outlet />
            </main>
        </div>
    );
}