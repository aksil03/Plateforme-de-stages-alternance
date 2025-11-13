// App.tsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import { Button } from '@/components/ui/button'
import Login from './pages/Login' // Crée cette page avec ton formulaire email/mdp

export default function App() {
  const [user, setUser] = useState<string | null>(null)

  return (
    <Router>
      <div className="relative min-h-screen font-sans text-white">
        {/* Fond complet */}
        <div className="absolute inset-0 -z-10 h-full w-full">
          {/* Couche noire de base */}
          <div className="absolute inset-0 bg-black"></div>

          {/* Grille subtile avec opacité réduite */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(79,79,79,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(128,128,128,0.01) 1px, transparent 1px)
              `,
              backgroundSize: '14px 24px'
            }}
          ></div>

          {/* Halo radial */}
          <div
            className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full"
            style={{
              background: 'radial-gradient(circle 400px at 50% 300px, rgba(251,251,251,0.21), #000)'
            }}
          ></div>
        </div>

        {/* Navbar */}
        <Navbar user={user} setUser={setUser} />

        <Routes>
          {/* Page principale */}
          <Route
            path="/"
            element={
              <>
                <Header user={user} setUser={setUser} />

                <main className="max-w-6xl mx-auto px-8 space-y-24 pb-20">
                  {/* Section Présentation */}
                  <section className="text-center py-20">
                    <h2 className="text-4xl font-bold mb-6">
                      Bienvenue sur le portail de votre école
                    </h2>
                    <p className="text-white/80 text-lg max-w-3xl mx-auto">
                      Découvrez les offres de stage et d'alternance proposées par nos
                      entreprises partenaires et trouvez l'opportunité qui vous correspond.
                    </p>
                  </section>

                  {/* Section Avantages */}
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div className="rounded-xl p-8 backdrop-blur-md shadow-lg hover:scale-105 transition-transform bg-white/10">
                      <h3 className="text-2xl font-semibold mb-4">Toutes les offres</h3>
                      <p className="text-white/80">
                        Accédez facilement à toutes les offres de stage et d'alternance mises à jour par nos partenaires.
                      </p>
                    </div>
                    <div className="rounded-xl p-8 backdrop-blur-md shadow-lg hover:scale-105 transition-transform bg-white/10">
                      <h3 className="text-2xl font-semibold mb-4">Filtrage avancé</h3>
                      <p className="text-white/80">
                        Filtrez les offres par durée, localisation, domaine ou type d'alternance pour trouver votre match parfait.
                      </p>
                    </div>
                    <div className="rounded-xl p-8 backdrop-blur-md shadow-lg hover:scale-105 transition-transform bg-white/10">
                      <h3 className="text-2xl font-semibold mb-4">Facile et rapide</h3>
                      <p className="text-white/80">
                        Une interface moderne et intuitive pour consulter et candidater aux offres en quelques clics.
                      </p>
                    </div>
                  </section>

                  {/* Section Call to Action */}
                  <section className="text-center py-20">
                    <h2 className="text-4xl font-bold mb-6">Prêt à commencer ?</h2>
                    <p className="text-white/80 mb-8">
                      Connectez-vous ou explorez les offres pour trouver votre prochaine expérience professionnelle.
                    </p>
                    <Button className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-lg font-semibold transition">
                      Explorer les offres
                    </Button>
                  </section>
                </main>
              </>
            }
          />

          {/* Page Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}
