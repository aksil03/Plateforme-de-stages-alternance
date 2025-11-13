import React from 'react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  user: string | null
  setUser: (user: string) => void
}

export default function Header({ user, setUser }: HeaderProps) {
  return (
    <header className="text-center py-40">
      <h1 className="text-6xl font-extrabold mb-6">Portail des Stages & Alternances</h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        Consultez et gérez toutes les offres proposées par les entreprises partenaires de votre école.
      </p>

      {!user && (
        <Button
          onClick={() => setUser('Eleve')}
          size="lg"
          className="mt-8 bg-gray-500 hover:bg-gray-600 text-white"
        >
          Se connecter
        </Button>
      )}
    </header>
  )
}
