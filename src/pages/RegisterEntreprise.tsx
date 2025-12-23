import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RegisterFormValues {
  login: string
  mdp: string
  email: string
  raison_sociale: string
  siret: string
  adresse: string
  telephone: string
}

export default function RegisterEntreprise() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      login: '',
      mdp: '',
      email: '',
      raison_sociale: '',
      siret: '',
      adresse: '',
      telephone: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('http://localhost:5000/api/register-entreprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.")
        navigate('/login')
      } else {
        setErrorMessage(data.message || "Une erreur est survenue lors de l'inscription.")
      }
    } catch (error) {
      setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion.")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  return (
    <div className="relative h-screen w-screen flex items-center justify-center font-sans text-white overflow-hidden">
 
      <div className="absolute inset-0 -z-10 bg-black">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(79,79,79,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(79,79,79,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '14px 24px',
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(251,251,251,0.15), transparent 70%)',
          }}
        ></div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-10 w-full max-w-2xl 
                    bg-neutral-900/90 backdrop-blur-md border border-white/10
                    p-10 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white">Inscription Entreprise</h2>
            <p className="text-white/40 text-sm mt-2">Devenez partenaire de l'IDMC</p>
          </div>

          {errorMessage && (
            <div className="text-sm text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
            <div className="md:col-span-2 border-b border-white/5 pb-2">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Compte Utilisateur</p>
            </div>

            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs">Login souhaité</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-neutral-800 border-white/10 text-sm" placeholder="ex: google_nancy" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mdp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs">Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="md:col-span-2 border-b border-white/5 pb-2 mt-2">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Informations Établissement</p>
            </div>

            <FormField
              control={form.control}
              name="raison_sociale"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-white/60 text-xs">Raison Sociale</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom officiel de l'entreprise" className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs">N° SIRET</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="14 chiffres" className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs">Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="06..." className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-white/60 text-xs">Email de contact professionnel</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="contact@entreprise.fr" className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-white/60 text-xs">Adresse du siège</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="N°, rue, CP, Ville" className="bg-neutral-800 border-white/10 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg py-6 transition-all"
            >
              {isLoading ? "Création en cours..." : "S'inscrire comme partenaire"}
            </Button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-sm text-white/40 hover:text-white transition-colors"
            >
              Déjà un compte ? <span className="text-blue-400">Se connecter</span>
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}