'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle } from 'lucide-react';

export default function AssessmentPage() {
  const [cost, setCost] = useState('');
  const router = useRouter();
  const API_URL = "http://localhost:3000"; // ou Ngrok

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    await fetch(`${API_URL}/users/${userId}/update-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyCost: cost })
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#2F3A4A] flex items-center justify-center p-4">
      <div className="bg-[#59647A] p-8 rounded-2xl max-w-md w-full text-[#EAE6DA] text-center shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">Dernière étape !</h1>
        <p className="mb-8 opacity-80">Pour calculer vos économies, combien dépensez-vous par jour pour votre addiction ?</p>
        
        <div className="flex items-center bg-[#2F3A4A] p-4 rounded-xl border border-white/10 mb-8">
          <Wallet className="text-[#4ECDC4] mr-3" />
          <input 
            type="number" 
            className="bg-transparent text-white text-xl w-full outline-none" 
            placeholder="Ex: 10" 
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <span className="text-gray-400">€ / jour</span>
        </div>

        <button onClick={handleSave} className="w-full bg-[#4ECDC4] text-[#2F3A4A] font-bold py-3 rounded-xl hover:bg-white transition flex justify-center gap-2">
          <CheckCircle /> Terminer
        </button>
      </div>
    </div>
  );
}