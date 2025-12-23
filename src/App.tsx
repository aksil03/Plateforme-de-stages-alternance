import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Login from './pages/Login' 
import Admin from './pages/admin/Admin'
import Profil from './pages/Profil'
import Secretaire from './pages/secretaire/Secretaire' 
import RegisterEntreprise from './pages/RegisterEntreprise' 
import EntrepriseDashboard from './pages/entreprise/EntrepriseDashboard'
import EtudiantDashboard from './pages/etudiant/EtudiantDashboard' 
import EnseignantDashboard  from './pages/enseignant/EnseignantDashboard' 


function AppContent({ 
  user, 
  setUser, 
  userName, 
  setUserName 
}: { 
  user: string | null, 
  setUser: React.Dispatch<React.SetStateAction<string | null>>,
  userName: string | null,
  setUserName: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const location = useLocation(); 
  
  const isSpecialPage = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/secretaire') || 
    location.pathname.startsWith('/entreprise') ||
    location.pathname.startsWith('/etudiant') ||
    location.pathname === '/login' ||
    location.pathname === '/register-entreprise';

  useEffect(() => {
    if (isSpecialPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSpecialPage]);

  return (
    <div className="relative min-h-screen font-sans text-white bg-black">
      
      {!isSpecialPage && (
        <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
          <div className="absolute inset-0 bg-black"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(79,79,79,0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(128,128,128,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          ></div>
        </div>
      )}

      <Navbar 
        user={user} 
        userName={userName} 
        setUser={setUser} 
        setUserName={setUserName} 
      />

      <Routes>
        <Route path="/" element={
            <>
              <Header user={user} userName={userName} setUser={setUser} />
              <main className="max-w-6xl mx-auto px-8 space-y-24 pb-20">
                <section className="text-center py-20">
                  <h2 className="text-4xl font-bold mb-6">Bienvenue sur le portail de votre école</h2>
                  <p className="text-white/80 text-lg max-w-3xl mx-auto">
                    Découvrez les offres de stage et d'alternance proposées par nos entreprises partenaires.
                  </p>
                </section>
              </main>
            </>
          }
        />

        <Route path="/login" element={<Login setUser={setUser} setUserName={setUserName} />} />
        <Route path="/register-entreprise" element={<RegisterEntreprise />} />
        <Route path="/admin/*" element={<Admin user={user} />} />
        
        <Route path="/secretaire/*" element={
            user === 'role_secretaire_BAAASELA' || (user === 'role_enseignant_BAAASELA' && localStorage.getItem('isReplacement') === 'true') 
            ? <div className="pt-20 min-h-screen bg-black"><Secretaire /></div>
            : <Navigate to="/" />
          } 
        />

        <Route path="/entreprise/*" element={
            user === 'role_entreprise_BAAASELA' 
            ? <div className="bg-black min-h-screen"><EntrepriseDashboard /></div>
            : <Navigate to="/login" replace />
          } 
        />

        <Route path="/etudiant/*" element={
            user === 'role_etudiant_BAAASELA' 
            ? <div className="bg-black min-h-screen"><EtudiantDashboard /></div>
            : <Navigate to="/login" replace />
          } 
        />

        <Route path="/enseignant/*" element={
    user === 'role_enseignant_BAAASELA' 
    ? <div className="bg-black min-h-screen"><EnseignantDashboard /></div>
    : <Navigate to="/login" replace />
} />

        <Route path="/profil" element={<Profil />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem('userRole'))
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'))

  return (
    <Router>
      <AppContent 
        user={user} 
        setUser={setUser} 
        userName={userName} 
        setUserName={setUserName} 
      />
    </Router>
  )
}