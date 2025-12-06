'use client';
import { useState } from 'react';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

export default function AnalysisPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚠️ LOCALHOST pour le Web local
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_URL}/ai-coach/analysis/${userId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' } // <--- FIX
      });
      
      if (!response.ok) throw new Error("Erreur serveur");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'analyse. Assurez-vous d'avoir rempli votre journal.");
    } finally {
      setLoading(false);
    }
  };

  // Composant Barre de Progression (Style TAFUT)
  const ProgressBar = ({ label, value, color }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-[#EAE6DA]/80 text-sm font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full bg-[#2F3A4A] rounded-full h-3 border border-white/5">
        <div 
          className="h-3 rounded-full transition-all duration-1000 shadow-sm" 
          style={{ width: `${value}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA] font-sans">
      
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#EAE6DA] tracking-wide">Bilan Cognitif & Émotionnel</h1>
          <p className="text-[#EAE6DA]/60 mt-2">Analyse basée sur vos entrées de journal de la semaine.</p>
        </div>
        
        {/* BOUTON MODIFIÉ ICI (Couleur TAFUT) */}
        <button 
          onClick={generateAnalysis}
          disabled={loading}
          className="bg-[#EAE6DA] hover:bg-white text-[#2F3A4A] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-[#EAE6DA]/20 transform active:scale-95"
        >
          <Activity size={20} />
          {loading ? "Analyse en cours..." : "Lancer l'analyse IA"}
        </button>

      </div>

      {/* État vide */}
      {!data && !loading && (
        <div className="bg-[#59647A] p-12 rounded-2xl border border-white/10 text-center text-[#EAE6DA]/40 border-dashed">
          <Activity size={48} className="mx-auto mb-4 opacity-50"/>
          <p className="text-lg">Cliquez sur le bouton pour générer votre bilan de la semaine.</p>
        </div>
      )}

      {/* Résultats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          
          {/* COLONNE GAUCHE : Score Global */}
          <div className="bg-[#59647A] p-8 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-xl">
            <h3 className="text-[#EAE6DA]/60 mb-6 font-medium uppercase tracking-widest text-sm">Score de Bien-être</h3>
            
            <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center mb-6 relative shadow-inner bg-[#2F3A4A] ${data.score > 50 ? 'border-[#4ECDC4]' : 'border-[#FF6B6B]'}`}>
              <div className="text-center">
                <span className="text-6xl font-bold text-white block">{data.score}</span>
                <span className="text-xs text-[#EAE6DA]/40">/ 100</span>
              </div>
            </div>
            
            <div className="w-full border-t border-white/10 pt-6">
              <p className="text-center text-sm text-[#EAE6DA] italic leading-relaxed">
                "{data.summary}"
              </p>
            </div>
          </div>

          {/* COLONNE DROITE : Indicateurs */}
          <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 md:col-span-2 shadow-xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-[#EAE6DA]">
              <Zap className="text-[#FFD93D]" /> Indicateurs Clés
            </h3>
            
            <div className="space-y-2">
              <ProgressBar label="Niveau de Stress (Bas est mieux)" value={data.stressLevel} color="#FF6B6B" />
              <ProgressBar label="Motivation" value={data.motivation} color="#FFD93D" />
              <ProgressBar label="Stabilité Émotionnelle" value={data.score} color="#4ECDC4" />
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm text-[#EAE6DA]/60 mb-4 flex items-center gap-2 uppercase tracking-widest font-bold">
                <AlertTriangle size={16} /> Déclencheurs identifiés (Triggers)
              </h4>
              <div className="flex gap-3 flex-wrap">
                {data.triggers && data.triggers.length > 0 ? (
                  data.triggers.map((t, i) => (
                    <span key={i} className="bg-[#FF6B6B]/20 text-[#FF6B6B] px-4 py-2 rounded-lg text-sm border border-[#FF6B6B]/30 font-bold shadow-sm">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-[#EAE6DA]/40 text-sm italic">Aucun déclencheur majeur détecté.</span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}