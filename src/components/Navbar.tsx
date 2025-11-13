import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserCircle } from 'lucide-react' // Icône alternative plus stylisée

interface NavbarProps {
  user: string | null
  setUser: (user: string) => void
}

export default function Navbar({ user, setUser }: NavbarProps) {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  // Suivi du scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Opacité et blur
  const opacity = Math.min(scrollY / 300, 0.6)
  const blurClass = scrollY > 0 ? 'backdrop-blur-lg' : ''

  return (
    <nav
      className={`fixed top-0 w-full z-20 flex justify-between items-center px-8 py-6 transition-colors duration-300 ${blurClass}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
    >
      <div className="text-2xl font-bold text-white">ÉcolePortail</div>

      <ul className="flex items-center gap-6">
        <li>
          {!user ? (
            <Button
              onClick={() => navigate('/login')}
              className="px-3 py-2 bg-transparent border-none hover:bg-white/10"
            >
              <UserCircle className="w-6 h-6 text-black stroke-white" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-white font-medium">
              <UserCircle className="w-6 h-6 text-black stroke-white" />
              {user}
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}
