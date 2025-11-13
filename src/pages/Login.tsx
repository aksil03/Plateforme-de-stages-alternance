// src/pages/Login.tsx
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LoginFormValues {
  email: string
  password: string
}

export default function Login() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    console.log('Email:', values.email, 'Password:', values.password)
  }

  // 🔒 Bloquer le scroll sur le body quand on est sur cette page
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  return (
    <div className="relative h-screen w-screen flex items-center justify-center font-sans text-white overflow-hidden">
      {/* --- Fond sombre avec grille + halo --- */}
      <div className="absolute inset-0 -z-10 bg-black">
        {/* Grille subtile */}
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

        {/* Halo radial doux et fixe */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(251,251,251,0.15), transparent 70%)',
          }}
        ></div>
      </div>

      {/* --- Formulaire sombre et élégant --- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-10 w-full max-w-md 
                     bg-neutral-900/90 backdrop-blur-md border border-white/10
                     p-10 rounded-2xl shadow-2xl space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-4">
            Connexion
          </h2>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="exemple@email.com"
                    className="bg-neutral-800 border border-white/10 text-white placeholder-white/30 focus:border-white/40"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="********"
                    className="bg-neutral-800 border border-white/10 text-white placeholder-white/30 focus:border-white/40"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg py-2"
          >
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  )
}
