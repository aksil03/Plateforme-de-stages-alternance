import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
    LayoutDashboard, 
    CheckSquare, 
    Users, 
    FileText, 
    ShieldCheck, 
    LogOut,
    UserCog
} from 'lucide-react';

import ValiderOffres from './ValiderOffres';
import ListeRenoncement from '../enseignant/ListeRenoncement';

import InscriptionEtudiant from '../secretaire/InscriptionEtudiant';
import ValidationAttestations from '../secretaire/ValidationAttestations';


export default function EnseignantDashboard() {

const isReplacement = localStorage.getItem('isReplacement') === 'true';

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-900 pt-20">
      
            <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl border-r border-white/5 font-sans">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-tighter">Espace Enseignant</h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Responsable</p>
                    </div>
                </div>

                <nav className="flex flex-col space-y-2 flex-1">
                    <Link to="/enseignant/valider-offres">
                        <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-neutral-700 hover:text-white gap-3 h-12 rounded-xl transition-all border border-transparent hover:border-white/5">
                            <CheckSquare size={20} />
                            <span className="font-medium">Offres à valider</span>
                        </Button>
                    </Link>
                    <Link to="/enseignant/liste_renoncement">
                        <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-neutral-700 hover:text-white gap-3 h-12 rounded-xl transition-all border border-transparent hover:border-white/5">
                            <Users size={20} />
                            <span className="font-medium">Liste des renoncements</span>
                        </Button>
                    </Link>


                    {

                        isReplacement && (
                    <div>
                        <Link to="/enseignant/Inscription">
                        <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-neutral-700 hover:text-white gap-3 h-12 rounded-xl transition-all border border-transparent hover:border-white/5">
                            <CheckSquare size={20} />
                            <span className="font-medium">Inscrire Étudiant</span>
                        </Button>
                    </Link>
                    <Link to="/enseignant/Validation">
                        <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-neutral-700 hover:text-white gap-3 h-12 rounded-xl transition-all border border-transparent hover:border-white/5">
                            <Users size={20} />
                            <span className="font-medium">Valider Attestations</span>
                        </Button>
                    </Link>
                    </div>
                )
                    }

                

                </nav>

                <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start text-red-400/60 hover:text-red-400 hover:bg-red-400/10 gap-3 h-12 rounded-xl mt-auto"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </Button>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto text-white custom-scrollbar">
                <Routes>
                    <Route index element={
                        <div className="space-y-6">
                            <h1 className="text-4xl font-black tracking-tight">Bonjour, Professeur</h1>
                            <p className="text-white/40 text-lg max-w-2xl">
                                Vous avez le contrôle sur les offres soumises par les entreprises partenaires. 
                                Vérifiez la conformité des missions avant de les rendre visibles aux étudiants.
                            </p>
                        </div>
                    } />
                    <Route path="valider-offres" element={<ValiderOffres />} />
                    <Route path="liste_renoncement" element={<ListeRenoncement/>}/>
                    <Route path= "Inscription" element={<InscriptionEtudiant/>} />
                    <Route path= "Validation" element={<ValidationAttestations/>} />

                </Routes>
                <Outlet />
            </main>
        </div>
    );
}