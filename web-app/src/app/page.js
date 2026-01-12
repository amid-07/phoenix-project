'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Zap, Lock, Mail, Loader2, Menu, X, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  
  // États
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Effet machine à écrire
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
    <div className="min-h-screen bg-[#0F172A] text-[#EAE6DA] font-sans overflow-x-hidden selection:bg-[#4ECDC4] selection:text-[#0F172A]">
      
      {/* --- BACKGROUND SUBTIL --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-[#6C63FF]/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-[#4ECDC4]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* --- NAVBAR STICKY (Fixe en haut) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0F172A]/70 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo & Marque */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="relative w-10 h-10">
               <Image src="/logo.png" fill alt="Logo TAFSUT" className="object-contain drop-shadow-lg" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] text-white">TAFSUT</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#EAE6DA]/80">
            <a href="#features" className="hover:text-[#4ECDC4] transition">Fonctionnalités</a>
            <a href="#mission" className="hover:text-[#4ECDC4] transition">Mission</a>
            <button onClick={() => document.getElementById('login').scrollIntoView({behavior:'smooth'})} className="bg-[#EAE6DA] text-[#0F172A] px-5 py-2.5 rounded-full font-bold hover:bg-white transition shadow-lg shadow-white/10">
              Connexion
            </button>
          </div>

          {/* Menu Mobile Button */}
          <button className="md:hidden text-[#EAE6DA]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#1E293B] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Fonctionnalités</a>
            <a href="#mission" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Mission</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Colonne Gauche : Texte */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#59647A]/30 border border-[#4ECDC4]/30 backdrop-blur-md text-xs font-bold text-[#4ECDC4] shadow-lg mx-auto lg:mx-0">
            <Sparkles size={14} /> NOUVELLE APPROCHE IA
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
            {text}<span className="animate-blink text-[#4ECDC4]">|</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAE6DA] to-[#94A3B8]">Maîtrisez votre vie.</span>
          </h1>
          
          <p className="text-lg text-[#94A3B8] leading-relaxed max-w-xl mx-auto lg:mx-0">
            Une plateforme médicale sécurisée combinant <strong className="text-[#EAE6DA]">Intelligence Artificielle</strong> et <strong className="text-[#EAE6DA]">Experts Humains</strong> pour un rétablissement durable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
             <button onClick={() => document.getElementById('login').scrollIntoView({behavior:'smooth'})} className="bg-[#6C63FF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#5a52d5] transition shadow-xl shadow-[#6C63FF]/20 flex items-center justify-center gap-2 transform hover:-translate-y-1">
               Commencer <ArrowRight size={20}/>
             </button>
             <a href="#features" className="px-8 py-4 rounded-xl font-bold border border-[#EAE6DA]/10 hover:bg-[#59647A]/30 transition text-[#EAE6DA] flex items-center justify-center">
               Découvrir
             </a>
          </div>

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-[#94A3B8]">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-gray-600"/>)}
             </div>
             <p>Rejoint par <span className="text-white font-bold">2,000+ membres</span></p>
          </div>
        </div>

        {/* Colonne Droite : Formulaire de Connexion (Design Glass) */}
        <div id="login" className="relative w-full max-w-md mx-auto lg:mx-0">
          {/* Effet de lueur arrière */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] rounded-2xl blur opacity-20 animate-pulse"></div>
          
          <div className="relative bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-white">Espace Membre</h2>
                  <p className="text-[#94A3B8] text-xs">Accédez à votre tableau de bord</p>
               </div>
               <div className="w-10 h-10 bg-[#2F3A4A] rounded-full flex items-center justify-center border border-white/5">
                 <Lock size={18} className="text-[#4ECDC4]"/>
               </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="group">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4ECDC4] transition">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-[#94A3B8] group-focus-within:text-white transition"/>
                  <input 
                    type="email" 
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#94A3B8]/30"
                    placeholder="votre@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4ECDC4] transition">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-[#94A3B8] group-focus-within:text-white transition"/>
                  <input 
                    type="password" 
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] transition outline-none placeholder-[#94A3B8]/30"
                    placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center gap-2 text-[#FF6B6B] text-sm font-medium animate-shake">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-[#EAE6DA] hover:bg-white text-[#0F172A] font-bold py-3.5 rounded-xl transition shadow-lg shadow-white/10 flex justify-center items-center gap-2 transform active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : "Se connecter"}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-[#94A3B8]">
                Pas encore de compte ? <br/>
                <button onClick={() => alert("Téléchargez l'app mobile pour créer votre compte sécurisé.")} className="text-[#4ECDC4] font-bold hover:underline mt-1">Télécharger l'Application</button>
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* --- FEATURES GRID (Bento) --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pourquoi choisir TAFSUT ?</h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">Une suite d'outils complète conçue par des experts en addictologie et des ingénieurs en IA.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit size={32}/>} 
            title="Coach IA 24/7" 
            desc="Analyse émotionnelle en temps réel et conseils personnalisés basés sur les TCC."
            color="#6C63FF"
            large
          />
          <FeatureCard 
            icon={<Shield size={32}/>} 
            title="Anonymat Total" 
            desc="Aucune donnée partagée. Votre vie privée est notre priorité absolue."
            color="#4ECDC4"
          />
          <FeatureCard 
            icon={<Users size={32}/>} 
            title="Experts Humains" 
            desc="Prenez rendez-vous en un clic avec des spécialistes certifiés."
            color="#FFD93D"
          />
          <FeatureCard 
            icon={<Heart size={32}/>} 
            title="Suivi Quotidien" 
            desc="Journal de bord intelligent et compteur de sobriété pour visualiser vos progrès."
            color="#FF6B6B"
            large
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#0B1120] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={24} height={24} alt="Logo"/>
            <span className="font-bold tracking-widest text-[#EAE6DA]">TAFSUT</span>
          </div>
          <div className="text-[#94A3B8] text-sm">
            © 2025 TAFSUT Inc. <span className="mx-2">•</span> Confidentialité <span className="mx-2">•</span> Contact
          </div>
        </div>
      </footer>
    </div>
  );
}

// Composant Carte
function FeatureCard({ icon, title, desc, color, large }) {
  return (
    <div className={`${large ? 'md:col-span-2' : ''} bg-[#1E293B]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-[#1E293B] transition duration-300 group hover:-translate-y-2 cursor-default relative overflow-hidden`}>
       <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" style={{backgroundColor: color}}></div>
       <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition transform group-hover:scale-110 shadow-lg border border-white/5" style={{backgroundColor: `${color}15`, color: color}}>
         {icon}
       </div>
       <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
       <p className="text-[#94A3B8] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}