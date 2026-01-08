import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  User,
  Loader2,
  CheckCircle,
  UploadCloud,
  FileText,
} from "lucide-react";

interface AttestationData {
  attestation_fichier: string;
  validation_attestation: string;
}

export default function ProfilEtudiant() {
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [RC, setRC] = useState<AttestationData | null>(null);
  const [chargerAttestation, setChargerAttestation] = useState(true);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const telechargerRC = () => {
    if (!RC || !RC.attestation_fichier) return;

    const link = document.createElement("a");
    const fileType = RC.attestation_fichier.split(";")[0].split(":")[1];
    const extension = fileType.split("/")[1];

    link.href = RC.attestation_fichier;
    link.download = `attestation.${extension}`;
    link.click();
  };

  const supprimerRC = async () => {
    setRC(null);
    setChargerAttestation(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/etudiants/${userId}/attestation`,
        { method: "DELETE" }
      );
      if (!res.ok) console.log("Erreur suppression sur le serveur");
    } catch (err) {
      console.log("Erreur réseau lors de la suppression :", err);
    } finally {
      setChargerAttestation(false);
    }
  };

  useEffect(() => {
    const fetchAttestation = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/etudiants/${userId}/attestation` 
        );
        if (res.ok) {
          const data = await res.json();
            setRC(data);
        }
      } catch (error) {
        console.log("Erreur lors du fetch de l'attestation :", error);
      } finally {
        setChargerAttestation(false);
      }
    };
    fetchAttestation();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const base64File = await convertToBase64(file);

      const res = await fetch(
        `http://localhost:5000/api/etudiants/${userId}/documents`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attestation_data: base64File,
          }),
        }
      );

      if (res.ok) {
        setMessage("Attestation importée avec succès !");
        // ici on met à jour l'objet  pour refléter le changement immédiat car il faut respecter la forme 64 byte
        setRC({
          attestation_fichier: base64File,
          validation_attestation: 'en attente'
        });
        setFile(null);
      } else {
        setMessage("Erreur lors de l'envoi au serveur.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/5 pb-6 text-white">
        <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
        <p className="text-white/40 font-medium">
          Gerez vos documents officiels de scolarité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-neutral-800 border-white/10 h-fit text-white">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-white/40 tracking-widest flex items-center gap-2">
              <User size={14} /> Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-medium">
            <div>
              <p className="text-[10px] text-blue-400 uppercase font-bold">
                Nom complet
              </p>
              <p className="text-lg">{userName}</p>
            </div>
          </CardContent>
        </Card>

        <div
          className={` bg-neutral-800 border-white/50 p-5 rounded-2xl shadow-md text-white mt-4 relative bottom-4
            transition-all duration-300 ${RC ? "w-[450px]" : "w-full"}`}
        >
          <h3 className="text-lg font-bold mb-4">
            Mon attestation de responsabilité civile
          </h3>

          {chargerAttestation ? (
            <p>Chargement...</p>
          ) : (RC && RC.attestation_fichier) ? (
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-lime">Attestation RC</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                  RC.validation_attestation === 'validée' 
                    ? 'border-green-500 text-green-500 bg-green-500/10' 
                    : RC.validation_attestation === 'refusée' 
                    ? 'border-red-500 text-red-500 bg-red-500/10'     
                    : 'border-yellow-500 text-yellow-500 bg-yellow-500/10' 
                }`}>
                  {RC.validation_attestation || 'en attente'}
                </span>
              </div>

              <div className="flex gap-2">
                <Button className="bg-green-500 hover:bg-green-700 h-8 text-xs" onClick={telechargerRC}>
                  Télécharger
                </Button>

                <Button
                  className="bg-red-500 hover:bg-red-700 h-8 text-xs"
                  onClick={supprimerRC}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-white/50 italic">
              Aucune attestation disponible
            </p>
          )}
        </div>

        <Card className="md:col-span-2 bg-neutral-800 border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-blue-600/10 p-5 border-b border-white/5 flex items-center gap-3">
            <ShieldCheck className="text-blue-400" size={24} />
            <h3 className="font-bold text-white tracking-tight">
              Responsabilité Civile
            </h3>
          </div>

          <CardContent className="p-8 space-y-6 text-white">
            <p className="text-sm text-white/50 leading-relaxed italic">
              Votre attestation est nécessaire pour valider vos conventions.
              Importez le fichier PDF ou Image ici.
            </p>

            <form onSubmit={handleUpload} className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center transition-all cursor-pointer
                  ${file ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-blue-500/50 hover:bg-white/[0.02]"}`}
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.png"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="text-blue-400" size={56} />
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">{file.name}</p>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-widest mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      className="text-white/10 group-hover:text-blue-400 transition-colors"
                      size={56}
                    />
                    <p className="mt-4 text-white font-semibold text-center text-lg">
                      Importer mon attestation
                    </p>
                    <p className="text-[10px] text-white/30 mt-2 font-bold uppercase tracking-widest">
                      PDF, JPG ou PNG
                    </p>
                  </>
                )}
              </div>

              <Button
                type="submit"
                disabled={!file || isSaving}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 text-lg"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : "Enregistrer le document"}
              </Button>
            </form>

            {message && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                  message.includes("succès")
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                <CheckCircle size={18} />
                <span className="text-sm font-bold tracking-tight">{message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}