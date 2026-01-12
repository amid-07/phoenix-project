'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowRight, Lock, Mail, User, Briefcase, Loader2, AlertTriangle, CheckCircle, ArrowLeft 
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  
  // États
  const [role, setRole] = useState('USER'); // 'USER' ou 'COACH'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/users/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ 
          email: formData.email.toLowerCase(), 
          password: formData.password, 
          username: formData.username,
          role: role,
          isAnonymous: false 
        }),
      });

      const data = await response.json();

      if (data && data.id) {
        if (role === 'COACH') {
          setSuccessMsg("Votre compte Expert a été créé ! Il est en attente de validation par l'équipe TAFUT.");
        } else {
          // Patient : Connexion directe
          localStorage.setItem('userId', data.id);
          localStorage.setItem('username', data.username);
          router.push('/dashboard');
        }
      } else {
        setError("Erreur : Cet email est peut-être déjà utilisé.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-x-hidden selection:bg-[#4ECDC4] selection:text-[#2F3A4A]">
      
      {/* --- BACKGROUND DYNAMIQUE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C63FF]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#4ECDC4]/5 rounded-full blur-[120px] animate-float"></div>
      </div>

      {/* --- NAVBAR SIMPLE --- */}
      <nav className="absolute top-0 left-0 p-6 z-50">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#EAE6DA]/60 hover:text-[#EAE6DA] transition font-bold">
           <ArrowLeft size={20}/> Retour
        </button>
      </nav>

      {/* --- CONTENU --- */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-20">
        
        <div className="w-full max-w-md bg-[#59647A]/90 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-white/10 transform transition-all duration-500 hover:shadow-[#6C63FF]/10">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#EAE6DA] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#EAE6DA]/20">
               <Image src="/logo.png" width={40} height={40} alt="Logo" className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-[#EAE6DA] mb-2">Bienvenue</h1>
            <p className="text-[#B0BCC9] text-sm">Créez votre espace TAFUT.</p>
          </div>

          {successMsg ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-[#4ECDC4]/20 text-[#4ECDC4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4ECDC4]/50">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compte Créé !</h3>
              <p className="text-[#B0BCC9] mb-6">{successMsg}</p>
              <button onClick={() => router.push('/')} className="text-[#4ECDC4] font-bold hover:underline">
                Retour à l'accueil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              
              {/* SÉLECTEUR DE RÔLE (Design Premium) */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-[#2F3A4A] rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all duration-300 ${
                    role === 'USER' 
                      ? 'bg-[#EAE6DA] text-[#2F3A4A] shadow-md' 
                      : 'text-[#B0BCC9] hover:text-white'
                  }`}
                >
                  <User size={18} /> Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('COACH')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all duration-300 ${
                    role === 'COACH' 
                      ? 'bg-[#FFD93D] text-[#2F3A4A] shadow-md' 
                      : 'text-[#B0BCC9] hover:text-white'
                  }`}
                >
                  <Briefcase size={18} /> Expert
                </button>
              </div>

              {/* CHAMPS DE SAISIE */}
              <div className="space-y-4">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-4 text-[#B0BCC9] group-focus-within:text-[#EAE6DA] transition"/>
                  <input 
                    type="text" 
                    className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#B0BCC9]/30"
                    placeholder="Nom complet"
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required
                  />
                </div>

                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-4 text-[#B0BCC9] group-focus-within:text-[#EAE6DA] transition"/>
                  <input 
                    type="email" 
                    className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#B0BCC9]/30"
                    placeholder="Email"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
                  />
                </div>

                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-4 text-[#B0BCC9] group-focus-within:text-[#EAE6DA] transition"/>
                  <input 
                    type="password" 
                    className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#B0BCC9]/30"
                    placeholder="Mot de passe"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center gap-2 text-[#FF6B6B] text-sm font-medium animate-shake">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#2F3A4A] font-bold py-4 rounded-xl transition shadow-lg shadow-[#4ECDC4]/20 flex justify-center items-center gap-2 transform active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Créer mon compte <ArrowRight size={18}/></>}
              </button>
            </form>
          )}

          {!successMsg && (
            <p className="mt-6 text-center text-xs text-[#B0BCC9]">
              Déjà membre ? <span onClick={() => router.push('/')} className="text-[#EAE6DA] font-bold cursor-pointer hover:underline">Se connecter</span>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}