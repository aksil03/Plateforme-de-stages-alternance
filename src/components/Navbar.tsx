import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserCircle, LogOut } from 'lucide-react'

interface NavbarProps {
  user: string | null       
  userName: string | null     
  setUser: React.Dispatch<React.SetStateAction<string | null>>
  setUserName: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Navbar({ user, userName, setUser, setUserName }: NavbarProps) {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    setUser(null)
    setUserName(null)
    localStorage.clear()
    navigate('/')
  }

  const opacity = Math.min(scrollY / 300, 0.6)
  const blurClass = scrollY > 0 ? 'backdrop-blur-lg' : ''

  return (
    <nav
      className={`fixed top-0 w-full z-20 flex justify-between items-center px-8 py-6 transition-colors duration-300 ${blurClass}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
    >
      <div 
        className="text-2xl font-bold text-white cursor-pointer" 
        onClick={() => navigate('/')}
      >
        ÉcolePortail
      </div>

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
            <div className="flex items-center gap-4">
              
              <div 
                onClick={() => navigate('/profil')} 
                className="flex items-center gap-2 text-white font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer hover:bg-white/20 transition-all active:scale-95"
              >
                <UserCircle className="w-5 h-5 text-black stroke-white" />
                <span className="text-sm">{userName}</span>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white/60 hover:text-red-400 hover:bg-red-400/10 flex gap-2 items-center"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">Quitter</span>
              </Button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}