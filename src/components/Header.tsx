import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom' 

interface HeaderProps {
  user: string | null         
  userName: string | null     
  setUser: React.Dispatch<React.SetStateAction<string | null>> 
}

export default function Header({ user, userName, setUser }: HeaderProps) {
  const navigate = useNavigate()

  const getDashboardPath = (role: string) => {
    if (role.includes('admin')) return '/admin/dashboard';
    if (role.includes('secretaire')) return '/secretaire/dashboard';
    if (role.includes('enseignant')) return '/enseignant/dashboard';
    if (role.includes('entreprise')) return '/entreprise/dashboard';
    return '/etudiant/dashboard';
  }

  return (
    <header className="text-center py-40">
      <h1 className="text-6xl font-extrabold mb-6 text-white">Portail des Stages & Alternances</h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        Consultez et gérez toutes les offres proposées par les entreprises partenaires de votre école.
      </p>

      {!user ? (
        <Button
          onClick={() => navigate('/login')} 
          size="lg"
          className="mt-8 bg-gray-500 hover:bg-gray-600 text-white"
        >
          Se connecter
        </Button>
      ) : (
        <Button
          onClick={() => navigate(getDashboardPath(user))}
          size="lg"
          className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold"
        >
          Accéder au Dashboard ({userName})
        </Button>
      )}
    </header>
  )
}