'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowRight, Shield, Zap, Sparkles, Lock, Mail, Loader2, Menu, X, 
  BrainCircuit, Heart, Users, CheckCircle 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // États
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [text, setText] = useState('');
  const fullText = "Retrouvez la Lumière.";

  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
      
      {/* --- BACKGROUND TAFSUT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#59647A]/30 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#4ECDC4]/5 rounded-full blur-[120px] animate-float"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#2F3A4A]/80 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 bg-[#EAE6DA] rounded-xl flex items-center justify-center p-1 shadow-lg group-hover:rotate-12 transition-transform duration-500">
               <Image src="/logo.png" width={32} height={32} alt="Logo" className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] text-[#EAE6DA] group-hover:text-[#4ECDC4] transition-colors">TAFSUT</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#EAE6DA]/80">
            <a href="#features" className="hover:text-[#4ECDC4] transition">Fonctionnalités</a>
            <a href="#mission" className="hover:text-[#4ECDC4] transition">Notre Mission</a>
            <button onClick={() => document.getElementById('login-card').scrollIntoView({behavior:'smooth'})} className="bg-[#EAE6DA] text-[#2F3A4A] px-5 py-2.5 rounded-full font-bold hover:bg-white transition shadow-lg shadow-white/10 transform hover:scale-105">
              Espace Membre
            </button>
          </div>

          <button className="md:hidden text-[#EAE6DA]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#59647A] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Fonctionnalités</a>
            <a href="#mission" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Mission</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        <div className="space-y-8 animate-fade-in-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#59647A]/30 border border-[#4ECDC4]/30 backdrop-blur-md text-xs font-bold text-[#4ECDC4] shadow-lg mx-auto lg:mx-0">
            <Sparkles size={14} /> IA THÉRAPEUTIQUE & EXPERTS
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#EAE6DA] h-auto min-h-[160px] lg:min-h-0">
            {text}<span className="animate-blink text-[#4ECDC4]">|</span><br/>
            Maîtrisez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B]">Vie</span>.
          </h1>
          
          <p className="text-lg text-[#B0BCC9] leading-relaxed max-w-xl mx-auto lg:mx-0">
            Une plateforme sécurisée qui combine la puissance de l'IA et l'empathie humaine pour vous accompagner vers la liberté, jour après jour.
          </p>

          
        </div>

        {/* --- FORMULAIRE DE CONNEXION --- */}
        <div id="login-card" className="relative w-full max-w-md mx-auto lg:ml-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#59647A] to-[#4ECDC4] rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse-slow"></div>
          
          {/* FOND CARTE : #59647A (Surface) */}
          <div className="relative bg-[#59647A]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl transform transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
               <div>
                  <h2 className="text-2xl font-bold text-[#EAE6DA]">Espace Membre</h2>
                  <p className="text-[#B0BCC9] text-xs mt-1">Connectez-vous à votre dashboard</p>
               </div>
               <div className="w-12 h-12 bg-[#2F3A4A] rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                 <Lock size={20} className="text-[#4ECDC4]"/>
               </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="group/input">
                <label className="text-xs font-bold text-[#B0BCC9] uppercase tracking-wider mb-2 block group-focus-within/input:text-[#4ECDC4] transition">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-4 text-[#B0BCC9] group-focus-within/input:text-[#EAE6DA] transition"/>
                  <input 
                    type="email" 
                    className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[#EAE6DA] focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#B0BCC9]/30"
                    placeholder="votre@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
              </div>
              
              <div className="group/input">
                <label className="text-xs font-bold text-[#B0BCC9] uppercase tracking-wider mb-2 block group-focus-within/input:text-[#4ECDC4] transition">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-4 text-[#B0BCC9] group-focus-within/input:text-[#EAE6DA] transition"/>
                  <input 
                    type="password" 
                    className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[#EAE6DA] focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#B0BCC9]/30"
                    placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required
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
                className="w-full bg-[#EAE6DA] hover:bg-white text-[#2F3A4A] font-bold py-4 rounded-xl transition shadow-lg shadow-white/10 flex justify-center items-center gap-2 transform active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <>Se connecter <ArrowRight size={18}/></>}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-[#B0BCC9]">
            Pas encore de compte ? <br/>
            <button 
              onClick={() => router.push('/signup')} 
              className="text-[#4ECDC4] font-bold hover:underline mt-2 inline-flex items-center gap-1 transition transform hover:scale-105"
            >
              Créer un compte gratuitement <ArrowRight size={12}/>
            </button>
          </p>
        </div>
          </div>
        </div>

      </main>

      {/* --- FEATURES GRID (Bento) --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAE6DA] mb-4">Un écosystème complet</h2>
          <p className="text-[#B0BCC9] max-w-2xl mx-auto">Conçu par des experts en addictologie et des ingénieurs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit size={32}/>} 
            title="Coach IA 24/7" 
            desc="Analyse émotionnelle en temps réel et conseils personnalisés."
            color="#6C63FF"
            large
          />
          <FeatureCard 
            icon={<Shield size={32}/>} 
            title="Anonymat Total" 
            desc="Vos données sont chiffrées de bout en bout."
            color="#4ECDC4"
          />
          <FeatureCard 
            icon={<Users size={32}/>} 
            title="Experts Humains" 
            desc="Prenez rendez-vous en un clic."
            color="#FFD93D"
          />
          <FeatureCard 
            icon={<Heart size={32}/>} 
            title="Suivi Quotidien" 
            desc="Journal de bord intelligent, compteur de jours et récompenses."
            color="#FF6B6B"
            large
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#252E3E] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EAE6DA] rounded-lg flex items-center justify-center p-1"><Image src="/logo.png" width={24} height={24} alt="Logo"/></div>
            <span className="font-bold tracking-widest text-[#EAE6DA]">TAFSUT</span>
          </div>
          <p className="text-[#B0BCC9] text-sm">© 2025 TAFSUT Inc. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, large }) {
  return (
    <div className={`${large ? 'md:col-span-2' : ''} bg-[#59647A]/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-[#59647A]/50 transition duration-300 group hover:-translate-y-2 cursor-default relative overflow-hidden`}>
       <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" style={{backgroundColor: color}}></div>
       <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition transform group-hover:scale-110 shadow-lg border border-white/5" style={{backgroundColor: `${color}15`, color: color}}>
         {icon}
       </div>
       <h3 className="text-xl font-bold mb-3 text-[#EAE6DA]">{title}</h3>
       <p className="text-[#B0BCC9] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}