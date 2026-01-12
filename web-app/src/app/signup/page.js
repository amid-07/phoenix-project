'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Briefcase, Check, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [role, setRole] = useState('USER'); // 'USER' ou 'COACH'
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  // ⚠️ LOCALHOST
  const API_URL = "http://localhost:3000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/users/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role, isAnonymous: false })
      });
      const data = await res.json();

      if (data && data.id) {
        if (role === 'COACH') {
          setSuccessMsg("Compte créé ! Veuillez attendre la validation de l'administrateur.");
        } else {
          // Patient : Connexion directe
          localStorage.setItem('userId', data.id);
          localStorage.setItem('username', data.username);
          router.push('/assessment');
        }
      } else {
        setError("Erreur lors de la création.");
      }
    } catch (err) { setError("Erreur serveur."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2F3A4A] p-4 text-[#EAE6DA]">
      <div className="w-full max-w-md bg-[#59647A] p-8 rounded-2xl shadow-2xl border border-white/10">
        
        <h1 className="text-3xl font-bold text-center mb-6">Inscription TAFSUT</h1>

        {successMsg ? (
          <div className="text-center p-6 bg-[#4ECDC4]/20 rounded-xl border border-[#4ECDC4]">
            <Check size={48} className="mx-auto text-[#4ECDC4] mb-4" />
            <p className="text-lg font-bold text-white">{successMsg}</p>
            <button onClick={() => router.push('/')} className="mt-6 text-[#4ECDC4] underline">Retour à l'accueil</button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Choix du Rôle */}
            <div className="flex bg-[#2F3A4A] p-1 rounded-xl mb-6">
              <button type="button" onClick={() => setRole('USER')} className={`flex-1 py-2 rounded-lg font-bold flex justify-center items-center gap-2 transition ${role === 'USER' ? 'bg-[#EAE6DA] text-[#2F3A4A]' : 'text-gray-400'}`}>
                <User size={18}/> Patient
              </button>
              <button type="button" onClick={() => setRole('COACH')} className={`flex-1 py-2 rounded-lg font-bold flex justify-center items-center gap-2 transition ${role === 'COACH' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'text-gray-400'}`}>
                <Briefcase size={18}/> Expert
              </button>
            </div>

            <input type="text" placeholder="Nom complet" className="w-full p-3 rounded-xl bg-[#2F3A4A] text-white border border-white/10" required onChange={e => setFormData({...formData, username: e.target.value})} />
            <input type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-[#2F3A4A] text-white border border-white/10" required onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Mot de passe" className="w-full p-3 rounded-xl bg-[#2F3A4A] text-white border border-white/10" required onChange={e => setFormData({...formData, password: e.target.value})} />

            {error && <p className="text-[#FF6B6B] text-center text-sm">{error}</p>}

            <button type="submit" className="w-full bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] font-bold py-3 rounded-xl transition mt-4">
              S'inscrire
            </button>

            <p className="text-center text-xs opacity-50 mt-4 cursor-pointer hover:underline" onClick={() => router.push('/')}>Déjà un compte ? Se connecter</p>
          </form>
        )}
      </div>
    </div>
  );
}