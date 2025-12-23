
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreationCompteFormValues {
    role: 'Secretaire' | 'Enseignant' | '';
    login: string;
    password: string;
    nom: string;
    prenom: string;
    email: string;
}

export default function CreationCompte() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const form = useForm<CreationCompteFormValues>({
        defaultValues: {
            role: '',
            login: '',
            password: '',
            nom: '',
            prenom: '',
            email: '',
        },
    })

    const onSubmit = async (values: CreationCompteFormValues) => {
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('http://localhost:5000/api/creationCompte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: values.role,
                    login: values.login,
                    password: values.password,
                    nom: values.nom,
                    prenom: values.prenom,
                    email: values.email,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || `Compte créé avec succès pour ${values.login}.` })
                form.reset() 
            } else {
                setMessage({ type: 'error', text: data.message || 'Échec de la création de compte.' })
            }
        } catch (error) {
            console.error('Erreur réseau/serveur:', error)
            setMessage({ type: 'error', text: 'Impossible de joindre le serveur backend.' })
        } finally {
            setIsLoading(false)
        }
    }

    const messageColor = message ? (message.type === 'success' ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-red-900/50 text-red-400 border-red-700') : ''

    return (
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Créer un Compte</h2>
            
            {message && (
                <div className={`p-3 rounded-lg border text-sm mb-6 ${messageColor}`}>
                    {message.text}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
       
                    <FormField
                        control={form.control}
                        name="role"
                        rules={{ required: 'Le rôle est obligatoire.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80">Rôle à créer</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white/90">
                                            <SelectValue placeholder="Sélectionner le rôle..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-neutral-700 text-white border-neutral-600">
                                        <SelectItem value="Secretaire">Secrétaire</SelectItem>
                                        <SelectItem value="Enseignant">Enseignant</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nom"
                            rules={{ required: 'Le nom est obligatoire.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Nom</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="DUBOIS" className="bg-neutral-700 border-neutral-600 text-white/90 placeholder-neutral-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
   
                        <FormField
                            control={form.control}
                            name="prenom"
                            rules={{ required: 'Le prénom est obligatoire.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Prénom</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Marie" className="bg-neutral-700 border-neutral-600 text-white/90 placeholder-neutral-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        rules={{ required: "L'email est obligatoire.", pattern: { value: /^\S+@\S+$/i, message: 'Format email invalide.' } }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80">Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="marie.dubois@univ.fr" className="bg-neutral-700 border-neutral-600 text-white/90 placeholder-neutral-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
       
                        <FormField
                            control={form.control}
                            name="login"
                            rules={{ required: 'Le login est obligatoire.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Login</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="mdubois" className="bg-neutral-700 border-neutral-600 text-white/90 placeholder-neutral-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
    
                        <FormField
                            control={form.control}
                            name="password"
                            rules={{ required: 'Le mot de passe est obligatoire.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80">Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="********" className="bg-neutral-700 border-neutral-600 text-white/90 placeholder-neutral-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                    >
                        {isLoading ? 'Création en cours...' : `Créer le compte ${form.watch('role') || 'utilisateur'}`}
                    </Button>
                </form>
            </Form>
        </div>
    )
}