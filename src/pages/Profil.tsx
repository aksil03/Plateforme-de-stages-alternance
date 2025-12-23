import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, Shield, Mail, BadgeCheck, BookOpen, 
  Search, Lock, Fingerprint, Eye, EyeOff, FileCheck, Globe, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Profil() {
  const [showPassword, setShowPassword] = useState(false)
  const [dynamicData, setDynamicData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  const userEmail = localStorage.getItem('userEmail')
  const userLogin = localStorage.getItem('userLogin')
  const userMdp = localStorage.getItem('userMdp') 
  const userRole = localStorage.getItem('userRole')
  const isReplacement = localStorage.getItem('isReplacement') === 'true'

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/etudiants/${userId}/profil-complet`)
        if (res.ok) {
          const data = await res.json()
          setDynamicData(data)
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) fetchFreshData()
  }, [userId])

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-32 px-8 flex justify-center pb-20 font-sans">
      <Card className="w-full max-w-3xl bg-white/5 border-white/10 text-white backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-white/10 pb-8 pt-8 px-10">
          <CardTitle className="text-3xl font-black flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
                <User className="w-8 h-8 text-blue-400" />
            </div>
            Détails du Compte
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-10 space-y-12">
   
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
               <Mail size={14}/> Coordonnées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/40 uppercase font-black">Nom Complet</span>
                <p className="text-lg font-bold mt-1 tracking-tight">{userName || "N/A"}</p>
              </div>
              <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/40 uppercase font-black">Email</span>
                <p className="text-lg font-bold mt-1 truncate">{userEmail || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
               <Lock size={14}/> Sécurité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-500/[0.02] p-6 rounded-3xl border border-red-500/10">
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-black flex items-center gap-2"><Fingerprint size={12}/> Login</span>
                <p className="font-mono text-lg font-bold text-white/90">{userLogin}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-black flex items-center gap-2"><Shield size={12}/> Mot de passe</span>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-lg">{showPassword ? userMdp : "••••••••"}</p>
                  <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="hover:bg-white/10 h-8 w-8 p-0">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
               Votre Statut {userRole?.includes('etudiant') ? 'Étudiant' : 'Professionnel'}
            </h3>
            
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl"><Shield className="text-green-400" /></div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-black">Rôle système</span>
                  <p className="text-xl font-black uppercase tracking-tighter">{userRole?.split('_')[1]}</p>
                </div>
              </div>

              {userRole?.includes('etudiant') && (
                <div className="grid gap-6 animate-in fade-in duration-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/30 uppercase font-black flex items-center gap-2"><BookOpen size={12}/> Filière</span>
                      <p className="font-bold">{dynamicData?.filiere || "Non renseignée"}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] text-white/30 uppercase font-black flex items-center justify-end gap-2"><Search size={12}/> Recherche</span>
                      <p className={`font-black ${dynamicData?.statut_recherche ? "text-green-400" : "text-red-400"}`}>
                        {dynamicData?.statut_recherche ? "ACTIVE" : "INACTIVE"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[10px] text-white/30 uppercase font-black flex items-center gap-2"><FileCheck size={14} className="text-blue-400"/> Attestation RC</span>
                      
                        <p className={`text-sm font-black ${dynamicData?.attestation_responsabilite ? "text-green-400" : "text-red-400"}`}>
                            {dynamicData?.attestation_responsabilite ? "✓ DÉPOSÉE" : "✗ NON DÉPOSÉE"}
                        </p>
                    </div>
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[10px] text-white/30 uppercase font-black flex items-center gap-2">Validation RC</span>
                        <p className={`text-[10px] font-black uppercase px-2 py-1 rounded w-fit border ${
                            dynamicData?.validation_attestation === 'Validé' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                            {dynamicData?.validation_attestation || "EN ATTENTE"}
                        </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-500/[0.03] rounded-2xl border border-blue-500/10">
                    <Globe className={dynamicData?.visibilite_infos ? "text-blue-400" : "text-white/20"} size={20} />
                    <div>
                      <span className="text-[10px] text-white/30 uppercase font-black block">Visibilité Entreprises</span>
                      <p className="text-xs font-bold">{dynamicData?.visibilite_infos ? "Profil public activé" : "Profil masqué"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}