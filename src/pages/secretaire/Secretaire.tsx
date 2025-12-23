import React from 'react'
import { Link, Outlet, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserPlus, FileCheck, ShieldCheck } from 'lucide-react'
import InscriptionEtudiant from './InscriptionEtudiant'
import ValidationAttestations from './ValidationAttestations'

export default function SecretaireDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-900 pt-20">
      

      <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl h-full overflow-y-auto border-r border-white/5">
        <div className="flex items-center gap-2 mb-6 opacity-50">
           <ShieldCheck className="w-5 h-5 text-blue-400" />
           <h2 className="text-sm font-bold text-white uppercase tracking-wider">
             Secrétariat
           </h2>
        </div>
        
        <nav className="flex flex-col space-y-2">
          <Link to="/secretaire/inscription">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:bg-neutral-700 hover:text-white transition-colors gap-2"
            >
              <UserPlus size={18} /> Inscrire Étudiant
            </Button>
          </Link>

          <Link to="/secretaire/validation">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:bg-neutral-700 hover:text-white transition-colors gap-2"
            >
              <FileCheck size={18} /> Valider Attestations
            </Button>
          </Link>
        </nav>
      </aside>
     
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Espace Secrétariat IDMC</h1>
        
        <Routes>
          <Route path="/" element={
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-white/60">
              <p className="text-lg">Bienvenue dans votre espace de gestion.</p>
              <p className="mt-2 text-sm">Utilisez la barre latérale pour inscrire de nouveaux étudiants ou vérifier les attestations de responsabilité civile déposées.</p>
            </div>
          } />
          <Route path="inscription" element={<InscriptionEtudiant />} />
          <Route path="validation" element={<ValidationAttestations />} />
        </Routes>

        <Outlet /> 
      </main>
    </div>
  )
}