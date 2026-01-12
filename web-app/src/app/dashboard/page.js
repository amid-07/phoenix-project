'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight, Menu, X, 
  RefreshCw // <--- AJOUT DE L'ICÔNE REFRESH
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    
    if (!id) { router.push('/'); return; }
    
    setUserName(name || 'Membre TAFSUT');

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

  // --- RECHUTE (NOUVEAU DESIGN) ---
  const handleRelapse = async () => {
    if (confirm("Cela va remettre votre compteur à zéro pour un nouveau départ. Continuer ?")) {
      const id = localStorage.getItem('userId');
      await fetch(`${API_URL}/users/${id}/relapse`, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setStats({ ...stats, days: 0 });
      // Petit effet visuel (scroll en haut)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateMobile = (path) => {
    setIsMobileMenuOpen(false);
    if(path) router.push(path);
  };

  const SidebarItem = ({ icon: Icon, label, onClick, active, highlight }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${highlight ? 'text-[#FFD93D] border border-[#FFD93D]/30 bg-[#FFD93D]/5 hover:bg-[#FFD93D]/10' : active ? 'bg-white/10 text-white font-medium border-l-4 border-[#EAE6DA]' : 'text-[#B0BCC9] hover:bg-white/5 hover:text-white'}`}>
      <Icon size={20} className={`${active || highlight ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} transition-transform group-hover:scale-110`} />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  const QuickAccessCard = ({ icon: Icon, title, sub, color, onClick }) => (
    <div onClick={onClick} className="group bg-[#59647A] p-6 rounded-2xl border border-white/5 hover:border-white/20 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold mb-1 text-[#EAE6DA]">{title}</h4>
      <p className="text-[#EAE6DA]/50 text-sm">{sub}</p>
      <div className="mt-4 flex items-center text-xs font-medium tracking-wider uppercase" style={{color: color}}>
        Accéder <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
      </div>
    </div>
  );

  const MenuContent = () => (
    <>
      <div className="space-y-1">
        <p className="px-4 text-xs font-bold text-[#59647A] uppercase tracking-widest mb-2 mt-4">Menu Principal</p>
        <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active onClick={() => navigateMobile()} />
        {userRole === 'COACH' ? (
          <>
            <SidebarItem icon={Briefcase} label="Espace Pro" highlight onClick={() => navigateMobile('/dashboard/coach')} />
            <SidebarItem icon={Users} label="Annuaire Experts" onClick={() => navigateMobile('/dashboard/marketplace')} />
          </>
        ) : (
          <>
            <SidebarItem icon={BookOpen} label="Journal de Bord" onClick={() => navigateMobile('/dashboard/journal')} />
            <SidebarItem icon={Activity} label="Bilan IA" onClick={() => navigateMobile('/dashboard/analysis')} />
            <p className="px-4 text-xs font-bold text-[#59647A] uppercase tracking-widest mb-2 mt-6">Santé</p>
            <SidebarItem icon={MessageCircle} label="Coach IA" onClick={() => navigateMobile('/dashboard/chat')} />
            <SidebarItem icon={Users} label="Trouver un expert" onClick={() => navigateMobile('/dashboard/marketplace')} />
            <SidebarItem icon={Calendar} label="Mes Rendez-vous" onClick={() => navigateMobile('/dashboard/bookings')} />
            <p className="px-4 text-xs font-bold text-[#59647A] uppercase tracking-widest mb-2 mt-6">Urgence</p>
            <SidebarItem icon={AlertTriangle} label="Mode SOS" onClick={() => navigateMobile('/dashboard/crisis')} />
          </>
        )}
      </div>
      <div className="mt-auto pt-6">
        <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition text-sm font-bold border border-[#FF6B6B]/20 hover:border-[#FF6B6B]">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </>
  );

  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] flex items-center justify-center">Chargement...</div>;

  return (
    <div className="flex h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-hidden relative">
      
      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm h-full bg-[#252E3E] p-6 shadow-2xl flex flex-col border-r border-white/10 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3"><Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" /><h1 className="text-xl font-bold text-[#EAE6DA] tracking-widest">TAFSUT</h1></div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-[#59647A] rounded-full text-[#EAE6DA]"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto"><MenuContent /></div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="w-72 bg-[#252E3E] border-r border-white/5 hidden md:flex flex-col justify-between relative">
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#6C63FF]/10 to-transparent pointer-events-none"/>
         <div className="p-6 relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-12">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-[#EAE6DA] rounded-full blur opacity-20 animate-pulse"></div>
                <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full relative z-10" />
              </div>
              <div><h1 className="text-2xl font-bold text-[#EAE6DA] tracking-widest">TAFSUT</h1><p className="text-[10px] text-[#B0BCC9] uppercase tracking-wider">Santé Mentale</p></div>
            </div>
            <MenuContent />
         </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 overflow-y-auto bg-[url('/noise.png')] p-4 md:p-8 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <div className="md:hidden flex items-center gap-3"><Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" /><h1 className="text-lg font-bold text-[#EAE6DA]">TAFSUT</h1></div>
           <div className="hidden md:block"><h2 className="text-3xl font-bold text-[#EAE6DA] mb-1">Bon retour, {userName}</h2><p className="text-[#EAE6DA]/60">{userRole === 'COACH' ? "Activité professionnelle." : "Votre progression en temps réel."}</p></div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-3 bg-[#59647A] rounded-xl text-[#EAE6DA]"><Menu size={24} /></button>
           <div className="hidden md:flex w-12 h-12 bg-[#59647A] rounded-full items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10 shadow-lg">{userName.charAt(0).toUpperCase()}</div>
        </div>

        {userRole === 'COACH' ? (
          <>
            {/* KPI Coach */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="bg-[#59647A] p-6 rounded-2xl border border-[#FFD93D]/30 shadow-lg flex flex-col justify-center items-center">
                   <div className="p-3 bg-[#FFD93D]/10 rounded-full mb-3 text-[#FFD93D]"><DollarSign size={32} /></div>
                   <h3 className="text-4xl font-bold text-[#FFD93D]">{stats.earnings || 0} €</h3>
                   <p className="text-sm text-[#EAE6DA]/60 mt-1">Revenus Totaux</p>
               </div>
               {/* ... autres stats ... */}
            </div>

            <div className="hidden md:block">
              <h3 className="text-xl font-bold mb-4 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Gestion</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <QuickAccessCard icon={Briefcase} title="Espace Professionnel" sub="Gérer et confirmer les RDV" color="#FFD93D" onClick={() => router.push('/dashboard/coach')} />
                 <QuickAccessCard icon={Users} title="Annuaire Experts" sub="Voir les profils collègues" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
              </div>
            </div>
          </>
        ) : (
          
          /* --- VUE PATIENT --- */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-8 shadow-xl group bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4]">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div><p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Jours de Lumière</p><h3 className="text-7xl font-bold text-white tracking-tighter">{stats.days}</h3></div>
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Trophy size={32} className="text-white" /></div>
                  </div>
                  <div className="mt-8 flex items-center gap-3"><div className="h-1.5 flex-1 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white w-3/4 rounded-full"></div></div><span className="text-xs font-bold text-white uppercase tracking-widest">Continuer ! 🔥</span></div>
                </div>
              </div>
              <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
                <div className="p-4 bg-[#4ECDC4]/10 rounded-full mb-4 text-[#4ECDC4]"><DollarSign size={36} /></div>
                <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
                <p className="text-[#EAE6DA]/60 text-sm font-medium">Économisés</p>
              </div>
            </div>

            {/* Accès Rapide (Desktop) */}
            <div className="hidden md:block">
              <h3 className="text-xl font-bold mb-4 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Accès Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <QuickAccessCard icon={MessageCircle} title="Coach IA" sub="Discussion 24/7" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
                 <QuickAccessCard icon={Users} title="Experts" sub="Prendre RDV" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
                 <QuickAccessCard icon={BookOpen} title="Journal" sub="Vos pensées" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
                 <QuickAccessCard icon={AlertTriangle} title="Urgence" sub="Aide immédiate" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
              </div>
            </div>

            <div className="md:hidden mt-8 p-6 bg-[#59647A]/20 border border-dashed border-white/10 rounded-2xl text-center">
               <p className="text-[#EAE6DA]/60 text-sm">Tout est dans le <span className="text-[#EAE6DA] font-bold">Menu ☰</span></p>
            </div>

            {/* --- BOUTON RECHUTE PREMIUM --- */}
            {userRole === 'USER' && (
              <div className="mt-16 flex justify-center pb-8 animate-fade-in">
                <button 
                  onClick={handleRelapse}
                  className="group flex items-center gap-3 px-6 py-3 rounded-full border border-[#FF6B6B]/20 text-[#FF6B6B]/70 hover:text-[#FF6B6B] hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-all duration-300"
                >
                  <RefreshCw size={18} className="transition-transform duration-500 group-hover:rotate-180" />
                  <span className="font-medium tracking-wide text-sm">Déclarer une rechute (Nouveau départ)</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}