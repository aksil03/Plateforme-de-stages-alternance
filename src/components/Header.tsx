// src/components/Header.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom' // <-- NOUVEL IMPORT

interface HeaderProps {
  user: string | null
  // NOTE: La signature de setUser a été modifiée pour être plus générale (pourrait être null)
  setUser: React.Dispatch<React.SetStateAction<string | null>> 
}

export default function Header({ user, setUser }: HeaderProps) {
  const navigate = useNavigate() // <-- Initialisation du hook de navigation

  const handleLoginClick = () => {
    // Redirige l'utilisateur vers la route définie pour le formulaire de connexion
    navigate('/login') 
  }

  return (
    <header className="text-center py-40">
      <h1 className="text-6xl font-extrabold mb-6">Portail des Stages & Alternances</h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        Consultez et gérez toutes les offres proposées par les entreprises partenaires de votre école.
      </p>

      {!user && (
        <Button
          onClick={handleLoginClick} // <-- Utilisation de la fonction de redirection
          size="lg"
          className="mt-8 bg-gray-500 hover:bg-gray-600 text-white"
        >
          Se connecter
        </Button>
      )}

      {/* Si l'utilisateur est connecté, vous pouvez afficher un autre bouton, par exemple : */}
      {user && (
        <Button
          onClick={() => navigate(`/${user.toLowerCase()}/dashboard`)}
          size="lg"
          className="mt-8 bg-green-500 hover:bg-green-600 text-white"
        >
          Accéder au Dashboard ({user})
        </Button>
      )}
    </header>
  )
}