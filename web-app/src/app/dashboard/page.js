'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight, Menu, X // Ajout Menu et X
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État du menu mobile
  const router = useRouter();

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    
    if (!id) { router.push('/'); return; }
    
    setUserName(name || 'Membre TAFUT');

    fetch(`${API_URL}/users/${id}/stats`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        if (data.role) setUserRole(data.role);
      })
      .catch(err => console.error("Erreur:", err));
  }, [router]);

  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // Navigation Mobile
  const navigateMobile = (path) => {
    setIsMobileMenuOpen(false); // Ferme le menu
    router.push(path);
  };

  // Composant Menu Latéral (Desktop)
  const SidebarItem = ({ icon: Icon, label, onClick, active, highlight }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        highlight 
          ? 'text-[#FFD93D] border border-[#FFD93D]/30 bg-[#FFD93D]/5 hover:bg-[#FFD93D]/10' 
          : active 
            ? 'bg-[#EAE6DA] text-[#2F3A4A] shadow-md' 
            : 'text-[#EAE6DA]/60 hover:bg-[#2F3A4A] hover:text-[#EAE6DA]'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  // Composant Menu Mobile (Liste)
  const MobileMenuItem = ({ icon: Icon, label, onClick, color }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-[#59647A] rounded-xl mb-3 active:scale-95 transition"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-[${color}]/10`} style={{color: color}}>
          <Icon size={24} />
        </div>
        <span className="text-[#EAE6DA] font-bold text-lg">{label}</span>
      </div>
      <ChevronRight className="text-[#EAE6DA]/30" />
    </button>
  );

  // Composant Carte Accès Rapide (Desktop)
  const QuickAccessCard = ({ icon: Icon, title, sub, color, onClick }) => (
    <div 
      onClick={onClick} 
      className="group bg-[#59647A] p-6 rounded-2xl border border-white/5 hover:border-white/20 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold mb-1 text-[#EAE6DA]">{title}</h4>
      <p className="text-[#EAE6DA]/50 text-sm">{sub}</p>
    </div>
  );

  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] flex items-center justify-center">Chargement...</div>;

  return (
    <div className="flex h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-hidden relative">
      
      {/* =======================================
          MENU MOBILE (OVERLAY PLEIN ÉCRAN) 
         ======================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#2F3A4A] flex flex-col p-6 animate-in fade-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#EAE6DA] tracking-widest">MENU</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-[#59647A] rounded-full">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {userRole === 'COACH' ? (
              <>
                <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold mb-4 tracking-widest">Espace Pro</p>
                <MobileMenuItem icon={Briefcase} label="Gérer mon cabinet" onClick={() => navigateMobile('/dashboard/coach')} color="#FFD93D" />
                <MobileMenuItem icon={Users} label="Annuaire Experts" onClick={() => navigateMobile('/dashboard/marketplace')} color="#4ECDC4" />
              </>
            ) : (
              <>
                <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold mb-4 tracking-widest">Mental & Suivi</p>
                <MobileMenuItem icon={BookOpen} label="Journal de Bord" onClick={() => navigateMobile('/dashboard/journal')} color="#FFD93D" />
                <MobileMenuItem icon={Activity} label="Bilan IA" onClick={() => navigateMobile('/dashboard/analysis')} color="#4ECDC4" />
                
                <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold mb-4 mt-6 tracking-widest">Santé</p>
                <MobileMenuItem icon={MessageCircle} label="Coach IA" onClick={() => navigateMobile('/dashboard/chat')} color="#EAE6DA" />
                <MobileMenuItem icon={Users} label="Trouver un expert" onClick={() => navigateMobile('/dashboard/marketplace')} color="#4ECDC4" />
                <MobileMenuItem icon={Calendar} label="Mes Rendez-vous" onClick={() => navigateMobile('/dashboard/bookings')} color="#4ECDC4" />
                
                <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold mb-4 mt-6 tracking-widest">Urgence</p>
                <MobileMenuItem icon={AlertTriangle} label="Mode SOS" onClick={() => navigateMobile('/dashboard/crisis')} color="#FF6B6B" />
              </>
            )}
          </div>

          <button onClick={handleLogout} className="mt-6 flex items-center justify-center gap-2 p-4 rounded-xl border border-[#FF6B6B] text-[#FF6B6B] font-bold">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      )}


      {/* --- SIDEBAR DESKTOP (Cachée sur Mobile) --- */}
      <aside className="w-64 bg-[#59647A] border-r border-white/5 p-6 flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold mb-10 text-[#EAE6DA] tracking-widest text-center">TAFUT</h1>
          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active onClick={() => {}} />
            {userRole === 'COACH' ? (
              <>
                <SidebarItem icon={Briefcase} label="Espace Pro" highlight onClick={() => router.push('/dashboard/coach')} />
                <SidebarItem icon={Users} label="Annuaire Experts" onClick={() => router.push('/dashboard/marketplace')} />
              </>
            ) : (
              <>
                <SidebarItem icon={BookOpen} label="Journal" onClick={() => router.push('/dashboard/journal')} />
                <SidebarItem icon={Users} label="Experts" onClick={() => router.push('/dashboard/marketplace')} />
                <SidebarItem icon={Calendar} label="Mes RDV" onClick={() => router.push('/dashboard/bookings')} />
                <SidebarItem icon={MessageCircle} label="Coach IA" onClick={() => router.push('/dashboard/chat')} />
                <SidebarItem icon={Activity} label="Bilan IA" onClick={() => router.push('/dashboard/analysis')} />
              </>
            )}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition w-full">
          <LogOut size={20} /> <span>Déconnexion</span>
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* EN-TÊTE MOBILE */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-[#EAE6DA] rounded-full flex items-center justify-center text-[#2F3A4A] font-bold shadow-lg">
                T
             </div>
             <span className="text-xl font-bold text-[#EAE6DA] tracking-widest">TAFUT</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-[#59647A] rounded-lg text-[#EAE6DA]">
             <Menu size={28} />
          </button>
        </div>

        {/* EN-TÊTE DESKTOP */}
        <header className="hidden md:flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#EAE6DA]">Bonjour, {stats.username}</h2>
            <p className="text-[#EAE6DA]/60 mt-1">
              {userRole === 'COACH' ? "Gérez votre activité professionnelle." : "Votre chemin vers la lumière."}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#59647A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
            {stats.username?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* --- STATS PRINCIPALES --- */}
        {userRole === 'COACH' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-[#59647A] p-6 rounded-2xl border border-[#FFD93D]/30 shadow-lg flex flex-col justify-center items-center">
                 <h3 className="text-4xl font-bold text-[#FFD93D]">{stats.earnings || 0} €</h3>
                 <p className="text-sm text-[#EAE6DA]/60 mt-1">Revenus</p>
             </div>
             {/* ... autres stats coach ... */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Carte Jours */}
            <div className="bg-gradient-to-br from-[#6C63FF] to-[#8e85ff] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <p className="text-white/80 font-medium text-sm mb-2">JOURS SANS RECHUTE</p>
              <h3 className="text-6xl font-thin">{stats.days}</h3>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                <Trophy size={14} /> Continuer !
              </div>
            </div>

            {/* Carte Argent */}
            <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
              <div className="p-3 bg-[#4ECDC4]/10 rounded-full mb-3 text-[#4ECDC4]"><span className="text-3xl">💰</span></div>
              <h3 className="text-4xl font-bold text-[#4ECDC4]">{stats.money} €</h3>
              <p className="text-sm text-[#EAE6DA]/60 mt-1">Économisés</p>
            </div>

            {/* Carte Badges (Cachée sur très petits mobiles si besoin) */}
            <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg hidden md:block">
               <div className="flex items-center gap-2 mb-4 text-[#FFD93D] font-bold"><Trophy size={20} /> Succès</div>
               <div className="flex flex-wrap gap-2">
                 {stats.badges?.length > 0 ? stats.badges.map((b,i) => (
                   <span key={i} className="bg-[#2F3A4A] text-[#FFD93D] px-3 py-1 rounded-full text-xs border border-[#FFD93D]/20">{b.name}</span>
                 )) : <p className="text-[#EAE6DA]/40 italic text-sm">Aucun badge.</p>}
               </div>
            </div>
          </div>
        )}

        {/* --- GRILLE D'ACCÈS RAPIDE (VISIBLE UNIQUEMENT SUR DESKTOP) --- */}
        {/* La classe `hidden md:grid` cache cette section sur mobile */}
        <div className="hidden md:block">
          <h3 className="text-xl font-bold mb-4 mt-8 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Accès Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRole === 'USER' && (
              <>
                <QuickAccessCard icon={MessageCircle} title="Coach IA" sub="Discussion 24/7" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
                <QuickAccessCard icon={Users} title="Experts" sub="Prendre RDV" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
                <QuickAccessCard icon={BookOpen} title="Journal" sub="Vos pensées" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
                <QuickAccessCard icon={AlertTriangle} title="Urgence" sub="Aide immédiate" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
              </>
            )}
             {userRole === 'COACH' && (
               <>
                 <QuickAccessCard icon={Briefcase} title="Espace Pro" sub="Gérer RDV" color="#FFD93D" onClick={() => router.push('/dashboard/coach')} />
                 <QuickAccessCard icon={Users} title="Annuaire" sub="Voir collègues" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
               </>
             )}
          </div>
        </div>

        {/* --- MESSAGE MOBILE (Si la grille est cachée) --- */}
        <div className="md:hidden mt-8 text-center text-[#EAE6DA]/40 text-sm">
          <p>Ouvrez le menu pour accéder à toutes les fonctionnalités.</p>
        </div>

      </main>
    </div>
  );
}