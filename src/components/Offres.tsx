import React from 'react';

export default function Offres() {
  return (
    <section id="offres" className="bg-white/10 rounded-xl p-10 backdrop-blur-md shadow-lg">
      <h2 className="text-3xl font-semibold mb-4">Offres disponibles</h2>
      <p className="text-white/80 mb-4">Toutes les offres de stage et d'alternance mises à jour par les entreprises.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/20 rounded-lg shadow hover:bg-white/30 transition">
          <h3 className="font-bold text-lg mb-2">Stage Développement Web</h3>
          <p className="text-white/70">Entreprise ABC - 3 mois - Paris</p>
        </div>
        <div className="p-6 bg-white/20 rounded-lg shadow hover:bg-white/30 transition">
          <h3 className="font-bold text-lg mb-2">Alternance Marketing Digital</h3>
          <p className="text-white/70">Entreprise XYZ - 12 mois - Lyon</p>
        </div>
      </div>
    </section>
  );
}
