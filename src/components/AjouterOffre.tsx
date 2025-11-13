import React from 'react';

export default function AjouterOffre() {
  return (
    <section id="ajouter" className="bg-white/10 rounded-xl p-10 backdrop-blur-md shadow-lg">
      <h2 className="text-3xl font-semibold mb-4">Ajouter une offre</h2>
      <p className="text-white/80 mb-4">Les entreprises peuvent proposer de nouvelles offres directement depuis ce portail.</p>
      <button className="px-6 py-3 bg-green-500 rounded hover:bg-green-600 transition">Ajouter une offre</button>
    </section>
  );
}
