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

  if (!user || user !== 'role_admin_fonc_BAAASELA') { 
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen text-white bg-neutral-900">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Accès Refusé</h1>
        <p>Votre rôle actuel ({user || 'Aucun'}) ne vous permet pas d'accéder à cet espace.</p>
        <Button onClick={() => navigate('/')} className="mt-4 bg-red-600 hover:bg-red-700">
          Retour à l'accueil
        </Button>
      </div>
    )
  }



  return (

    <div className="flex h-screen overflow-hidden bg-neutral-900 pt-20">
    
      <aside className="w-64 bg-neutral-800 p-6 flex flex-col space-y-4 shadow-xl h-full overflow-y-auto border-r border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-sm opacity-50">
          ⚙️ Admin Dashboard
        </h2>
        
<nav className="flex flex-col space-y-2">
  <Link to="/admin/creationCompte">
    <Button 
      variant="ghost" 
      className="w-full justify-start text-white/80 hover:bg-neutral-700 hover:text-white transition-colors"
    >
      👤 Créer des Comptes
    </Button>
  </Link>

  <Link to="/admin/gestionUtilisateurs">
    <Button 
      variant="ghost" 
      className="w-full justify-start text-white/80 hover:bg-neutral-700 hover:text-white transition-colors"
    >
      👥 Gérer Utilisateurs
    </Button>
  </Link>

  <Link to="/admin/offres">
    <Button 
      variant="ghost" 
      className="w-full justify-start text-white/80 hover:bg-neutral-700 hover:text-white transition-colors"
    >
      💼 Gestion des Offres
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
          <Route path="gestionUtilisateurs" element={<GestionUtilisateurs />} />
        </Routes>
      </main>
    </div>
  )
}