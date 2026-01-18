'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle, ArrowRight } from 'lucide-react';

export default function AssessmentPage() {
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // On vérifie si l'utilisateur est bien connecté en arrivant
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/'); // Si pas d'ID, retour au login
    }
  }, []);

  const handleSave = async () => {
    if (!cost) return alert("Veuillez entrer un montant.");
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_URL}/users/${userId}/update-cost`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // <--- INDISPENSABLE
        },
        body: JSON.stringify({ dailyCost: cost })
      });

      if (response.ok) {
        // Succès -> On va au Dashboard
        router.push('/dashboard');
      } else {
        alert("Erreur lors de l'enregistrement. Réessayez.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F3A4A] flex items-center justify-center p-4 text-[#EAE6DA] font-sans">
      <div className="bg-[#59647A] p-8 rounded-2xl max-w-md w-full text-center shadow-2xl border border-white/10 animate-fade-in-up">
        
        <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mx-auto mb-6">
           <Wallet size={32} className="text-[#4ECDC4]"/>
        </div>

        <h1 className="text-2xl font-bold mb-4">Dernière étape !</h1>
        <p className="mb-8 opacity-80 leading-relaxed">
          Pour calculer vos économies futures, combien dépensez-vous par jour pour votre addiction ?
        </p>
        
        <div className="flex items-center bg-[#2F3A4A] p-4 rounded-xl border border-white/10 mb-8 focus-within:border-[#4ECDC4] transition">
          <span className="text-[#4ECDC4] font-bold text-xl mr-2">€</span>
          <input 
            type="number" 
            className="bg-transparent text-white text-2xl w-full outline-none placeholder-white/20 font-bold" 
            placeholder="Ex: 10" 
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            autoFocus
          />
          <span className="text-sm text-gray-400 ml-2">/ jour</span>
        </div>

        <button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full bg-[#4ECDC4] text-[#2F3A4A] font-bold py-4 rounded-xl hover:bg-white transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : <>Terminer <ArrowRight size={20}/></>}
        </button>

      </div>
    </div>
  );
}