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

interface LoginFormValues {
  email: string 
  password: string
}

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<string | null>>
  setUserName: React.Dispatch<React.SetStateAction<string | null>>
}


export default function Login({ setUser, setUserName }: LoginProps) { 
  const navigate = useNavigate() 
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '', 
      password: '', 
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                login: values.email, 
                password: values.password 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Connexion réussie:', data);
            
            const fullName = `${data.prenom} ${data.nom}`;
            setUser(data.role);
            setUserName(fullName);

            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userLogin', values.email);
            localStorage.setItem('userMdp', values.password);
            localStorage.setItem('isReplacement', data.isReplacement ? 'true' : 'false');
            localStorage.setItem('userStatutRecherche', String(data.statut_recherche));
    localStorage.setItem('userAttestation', String(data.attestation_responsabilite));
    localStorage.setItem('userValidation', data.validation_attestation);
    localStorage.setItem('userVisibilite', String(data.visibilite_infos));

            if (data.filiere) localStorage.setItem('userFiliere', data.filiere);

      
            navigate('/'); 
            return; 
        } else {
            setErrorMessage(data.message || 'Identifiants incorrects.');
        }
    } catch (error) {
   
        console.error('Erreur réseau:', error);
        setErrorMessage("Impossible de joindre le serveur. Vérifiez votre VPN.");
    } finally {
        setIsLoading(false);
    }
};

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
          className="relative z-10 w-full max-w-md 
                    bg-neutral-900/90 backdrop-blur-md border border-white/10
                    p-10 rounded-2xl shadow-2xl space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-4">
            Connexion
          </h2>
   
          {errorMessage && (
            <div className="text-sm text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
              {errorMessage}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Login</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text" 
                    placeholder="Votre identifiant (ex: aksil)"
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
            disabled={isLoading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg py-2 transition-colors"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>

         
          <div className="text-center mt-4">
            <p className="text-sm text-white/40">
              Vous êtes une entreprise ?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register-entreprise')}
                className="text-blue-400 hover:underline font-medium"
              >
                Inscrivez votre établissement
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  )
}