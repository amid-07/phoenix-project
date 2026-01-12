'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowRight, Shield, Zap, Sparkles, Lock, CheckCircle, 
  BrainCircuit, Users, Heart, Loader2 
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  
  // États Connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const data = await response.json();

      if (data && data.id) {
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        router.push('/dashboard');
      } else {
        setError("Identifiants incorrects.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 flex justify-between items-center max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
             <Image src="/logo.png" width={32} height={32} alt="Logo" className="object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TAFUT</span>
        </div>
        <a href="#features" className="hidden md:block text-sm text-gray-400 hover:text-white transition">Fonctionnalités</a>
      </nav>

      {/* --- HERO SECTION (Split Screen) --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Colonne Gauche : Texte */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-indigo-300">
            <Sparkles size={16} /> Nouvelle approche thérapeutique
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Reprenez le <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Contrôle.</span>
          </h1>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            La première plateforme qui combine l'intelligence artificielle et l'expertise humaine pour vous libérer de vos addictions, jour après jour.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F172A] bg-gray-700"></div>
               ))}
             </div>
             <div className="text-sm text-gray-400 flex flex-col justify-center">
               <span className="font-bold text-white">2,000+ membres</span>
               <span>nous font confiance.</span>
             </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire de Connexion (Card) */}
        <div className="relative animate-float">
          {/* Effet Glow derrière la carte */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-30"></div>
          
          <div className="relative bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Bon retour 👋</h2>
            <p className="text-gray-400 text-sm mb-6">Connectez-vous pour accéder à votre espace.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none mt-1"
                  placeholder="votre@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Mot de passe</label>
                <input 
                  type="password" 
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none mt-1"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                />
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20 text-center">{error}</div>}

              <button 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Accéder à l'espace <ArrowRight size={18}/></>}
              </button>
            </form>
            
            <p className="text-center text-xs text-gray-500 mt-6">
              Pas encore de compte ? <a href="#" className="text-indigo-400 hover:underline">Téléchargez l'application mobile</a>
            </p>
          </div>
        </div>

      </main>

      {/* --- BENTO GRID (Fonctionnalités) --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Un écosystème complet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 : Large */}
          <div className="md:col-span-2 bg-[#1E293B]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#1E293B] transition duration-300 group">
             <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><BrainCircuit size={28}/></div>
             <h3 className="text-2xl font-bold mb-2">Coach IA Personnel</h3>
             <p className="text-gray-400">Une intelligence artificielle disponible 24/7 pour analyser vos émotions, vous donner des conseils personnalisés et prévenir les rechutes en temps réel.</p>
          </div>

          {/* Carte 2 : Carrée */}
          <div className="bg-[#1E293B]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#1E293B] transition duration-300 group">
             <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Shield size={28}/></div>
             <h3 className="text-xl font-bold mb-2">100% Anonyme</h3>
             <p className="text-gray-400 text-sm">Vos données sont chiffrées. Personne ne saura que vous êtes ici.</p>
          </div>

          {/* Carte 3 : Carrée */}
          <div className="bg-[#1E293B]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#1E293B] transition duration-300 group">
             <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Users size={28}/></div>
             <h3 className="text-xl font-bold mb-2">Experts Humains</h3>
             <p className="text-gray-400 text-sm">Réservez une séance visio ou cabinet avec des psychologues certifiés.</p>
          </div>

          {/* Carte 4 : Large */}
          <div className="md:col-span-2 bg-[#1E293B]/50 border border-white/5 rounded-3xl p-8 hover:bg-[#1E293B] transition duration-300 group">
             <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Heart size={28}/></div>
             <h3 className="text-2xl font-bold mb-2">Suivi Quotidien</h3>
             <p className="text-gray-400">Journal de bord intelligent, compteur de jours de sobriété et système de récompenses pour célébrer chaque victoire.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><Image src="/logo.png" width={24} height={24} alt="Logo"/></div>
            <span className="font-bold tracking-widest text-gray-300">TAFUT</span>
          </div>
          <p className="text-gray-600 text-sm">© 2025 TAFUT Inc. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}