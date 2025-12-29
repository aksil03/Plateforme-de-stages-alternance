import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, GraduationCap, ClipboardList, UserCircle } from 'lucide-react';

import ConsulterOffres from './ConsulterOffres';
import MesCandidatures from './MesCandidatures';
import ProfilEtudiant from './ProfilEtudiant';
import OffresSignalees from './offresSignalees';
export default function EtudiantDashboard() {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-900 pt-20">
      
            <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl border-r border-white/5">
                <div className="flex items-center gap-2 mb-6 opacity-50">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Espace Étudiant</h2>
                </div>

                <nav className="flex flex-col space-y-2">
               
                    <Link to="/etudiant/consulter">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <Search size={18} /> Consulter les offres
                        </Button>
                    </Link>
                    <Link to="/etudiant/mes-candidatures">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <ClipboardList size={18} /> Mes candidatures
                        </Button>
                    </Link>
                    <Link to="/etudiant/profil">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <UserCircle size={18} /> Mon Profil
                        </Button>
                    </Link>
                    <Link to="/etudiant/offres-signalees">
                        <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700 gap-2">
                            <UserCircle size={18} /> Mes offres signalées
                        </Button>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto text-white">
                <Routes>
         
                    <Route index element={
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold">Bienvenue sur votre espace étudiant</h1>
                            <p className="text-white/40">Parcourez les offres validées et suivez l'état de vos candidatures en temps réel.</p>
                        </div>
                    } />
                    <Route path="consulter" element={<ConsulterOffres />} />
                    <Route path="mes-candidatures" element={<MesCandidatures />} />
                    <Route path="profil" element={<ProfilEtudiant />} />
                    <Route path="offres-signalees" element={<OffresSignalees />} />
                </Routes>
            </main>
        </div>
    );
}