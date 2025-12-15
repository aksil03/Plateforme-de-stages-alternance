import React from 'react'
import { Link, Outlet, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CreationCompte from './CreationCompte' 
import GestionUtilisateurs from './GestionUtilisateurs' 

interface AdminProps {
  user: string | null 
}

export default function Admin({ user }: AdminProps) {
  const navigate = useNavigate()

  if (user !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen text-white bg-neutral-900">
        <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
        <p>Vous n'avez pas les droits d'administrateur pour accéder à cette page.</p>
        <Button onClick={() => navigate('/')} className="mt-4 bg-red-600 hover:bg-red-700">
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-900">
      
      <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">⚙️ Admin Dashboard</h2>
        
        <nav className="flex flex-col space-y-2">
          
          <Link to="/admin/creationCompte">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Créer des Comptes
            </Button>
          </Link>

          {/* NOUVEAU LIEN DANS LA SIDEBAR */}
          <Link to="/admin/gestionUtilisateurs">
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700">
              Gérer Utilisateurs/Partenaires
            </Button>
          </Link>

          <Link to="/admin/offres">
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-neutral-700">
              Gestion des Offres
            </Button>
          </Link>
          
        </nav>
      </aside>
      
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Espace Administration</h1>
        
        <Outlet /> 

        <Routes>
          <Route 
            path="/" 
            element={<p className="text-white/70">Sélectionnez une action dans la barre latérale.</p>} 
          />
          <Route path="creationCompte" element={<CreationCompte />} />
          {/* NOUVELLE ROUTE */}
          <Route path="gestionUtilisateurs" element={<GestionUtilisateurs />} />
        </Routes>
      </main>
    </div>
  )
}