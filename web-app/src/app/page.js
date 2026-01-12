'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowRight, Shield, Zap, Sparkles, Lock, Loader2, BrainCircuit, Heart, Users 
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  
  // États Connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Effet d'écriture machine pour le titre
  const [text, setText] = useState('');
  const fullText = "Retrouvez la Lumière.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-x-hidden selection:bg-[#4ECDC4] selection:text-[#2F3A4A]">
      
      {/* --- BACKGROUND DYNAMIQUE (Lueurs) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6C63FF]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#4ECDC4]/10 rounded-full blur-[120px] animate-float"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 flex justify-between items-center max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-[#EAE6DA] rounded-full flex items-center justify-center p-1 shadow-lg group-hover:rotate-12 transition-transform duration-500">
             <Image src="/logo.png" width={32} height={32} alt="Logo" className="object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-[0.2em] text-[#EAE6DA]">TAFSUT</span>
        </div>
        <div className="hidden md:flex gap-8 text-[#EAE6DA]/70 font-medium">
          <a href="#features" className="hover:text-[#4ECDC4] transition">Fonctionnalités</a>
          <a href="#mission" className="hover:text-[#4ECDC4] transition">Notre Mission</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Colonne Gauche : Texte */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#59647A]/30 border border-[#EAE6DA]/10 backdrop-blur-sm text-sm font-bold text-[#4ECDC4] shadow-lg">
            <Sparkles size={16} /> Nouvelle approche thérapeutique
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight h-40 md:h-auto">
            {text}<span className="animate-blink text-[#4ECDC4]">|</span><br/>
            Maîtrisez votre <span className="text-[#FFD93D]">Vie</span>.
          </h1>
          
          <p className="text-xl text-[#B0BCC9] leading-relaxed max-w-lg border-l-4 border-[#59647A] pl-6">
            TAFSUT combine l'intelligence artificielle et l'expertise humaine pour vous libérer de vos addictions, jour après jour.
          </p>

          <div className="flex gap-4 pt-4">
             <button onClick={() => document.getElementById('login-card').scrollIntoView({behavior:'smooth'})} className="bg-[#EAE6DA] text-[#2F3A4A] px-8 py-4 rounded-xl font-bold hover:bg-white transition shadow-lg shadow-white/10 flex items-center gap-2 transform hover:-translate-y-1">
               Commencer <ArrowRight size={20}/>
             </button>
             <button className="px-8 py-4 rounded-xl font-bold border border-[#EAE6DA]/20 hover:bg-[#59647A]/30 transition text-[#EAE6DA]">
               En savoir plus
             </button>
          </div>
        </div>

        {/* Colonne Droite : Formulaire de Connexion (Card) */}
        <div id="login-card" className="relative group perspective-1000">
          {/* Effet de bordure brillante au survol */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          
          <div className="relative bg-[#59647A] p-8 rounded-2xl shadow-2xl border border-white/5 transform transition-transform duration-500 hover:rotate-1">
            <h2 className="text-2xl font-bold mb-2 text-[#EAE6DA]">Espace Membre 👋</h2>
            <p className="text-[#B0BCC9] text-sm mb-8">Connectez-vous pour accéder à votre tableau de bord.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="group/input">
                <label className="text-xs font-bold text-[#EAE6DA]/50 uppercase tracking-wide group-focus-within/input:text-[#4ECDC4] transition">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl p-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none mt-2 placeholder-[#B0BCC9]/20"
                  placeholder="votre@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
              
              <div className="group/input">
                <label className="text-xs font-bold text-[#EAE6DA]/50 uppercase tracking-wide group-focus-within/input:text-[#4ECDC4] transition">Mot de passe</label>
                <input 
                  type="password" 
                  className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl p-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none mt-2 placeholder-[#B0BCC9]/20"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                />
              </div>

              {error && <div className="p-3 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] text-sm border border-[#FF6B6B]/20 text-center font-medium animate-shake">{error}</div>}

              <button 
                disabled={loading}
                className="w-full bg-[#6C63FF] hover:bg-[#5a52d5] text-white font-bold py-4 rounded-xl transition shadow-lg shadow-[#6C63FF]/25 flex justify-center items-center gap-2 transform active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Se connecter <ArrowRight size={18}/></>}
              </button>
            </form>
            
            <p className="text-center text-xs text-[#B0BCC9] mt-6">
              Pas encore de compte ? <span className="text-[#4ECDC4] font-bold cursor-pointer hover:underline" onClick={() => alert("Utilisez l'application mobile pour créer votre compte.")}>Télécharger l'app</span>
            </p>
          </div>
        </div>

      </main>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#EAE6DA]">Un écosystème complet pour <span className="text-[#4ECDC4]">guérir.</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit size={32}/>} 
            title="Coach IA Personnel" 
            desc="Une intelligence artificielle disponible 24/7 pour analyser vos émotions et prévenir les rechutes."
            color="#6C63FF"
            large
          />
          <FeatureCard 
            icon={<Shield size={32}/>} 
            title="100% Anonyme" 
            desc="Vos données sont chiffrées de bout en bout."
            color="#4ECDC4"
          />
          <FeatureCard 
            icon={<Users size={32}/>} 
            title="Experts Humains" 
            desc="Réservez une séance avec des psychologues certifiés."
            color="#FFD93D"
          />
          <FeatureCard 
            icon={<Heart size={32}/>} 
            title="Suivi Quotidien" 
            desc="Journal de bord intelligent, compteur de jours et système de récompenses pour célébrer chaque victoire."
            color="#FF6B6B"
            large
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-[#252E3E]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#EAE6DA] rounded flex items-center justify-center"><Image src="/logo.png" width={16} height={16} alt="Logo"/></div>
            <span className="font-bold tracking-widest text-[#EAE6DA]">TAFUT</span>
          </div>
          <p className="text-[#B0BCC9] text-sm">© 2025 TAFSUT . Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

// Composant Carte Fonctionnalité (Style TAFSUT)
function FeatureCard({ icon, title, desc, color, large }) {
  return (
    <div className={`${large ? 'md:col-span-2' : ''} bg-[#59647A]/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-[#59647A]/50 transition duration-300 group hover:-translate-y-2 cursor-default relative overflow-hidden`}>
       {/* Effet de lueur colorée au survol */}
       <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[60px] transition duration-500 opacity-0 group-hover:opacity-40 pointer-events-none" style={{backgroundColor: color}}></div>

       <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition transform group-hover:scale-110 shadow-lg" style={{backgroundColor: `${color}20`, color: color}}>
         {icon}
       </div>
       <h3 className="text-xl font-bold mb-3 text-[#EAE6DA]">{title}</h3>
       <p className="text-[#B0BCC9] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}