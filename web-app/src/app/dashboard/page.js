'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight, Menu, X 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // --- CHARGEMENT ---
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

  // --- DÉCONNEXION ---
  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // --- RECHUTE (NOUVEAU) ---
  const handleRelapse = async () => {
    if (confirm("Voulez-vous vraiment remettre votre compteur à zéro ?")) {
      const id = localStorage.getItem('userId');
      await fetch(`${API_URL}/users/${id}/relapse`, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setStats({ ...stats, days: 0 }); // Mise à jour immédiate
      alert("Compteur réinitialisé. Courage !");
    }
  };

  // --- NAVIGATION ---
  const navigateMobile = (path) => {
    setIsMobileMenuOpen(false);
    if(path) router.push(path);
  };

  // --- COMPOSANTS UI ---
  const SidebarItem = ({ icon: Icon, label, onClick, active, highlight }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${highlight ? 'text-[#FFD93D] border border-[#FFD93D]/30 bg-[#FFD93D]/5 hover:bg-[#FFD93D]/10' : active ? 'bg-white/10 text-white font-medium border-l-4 border-[#EAE6DA]' : 'text-[#B0BCC9] hover:bg-white/5 hover:text-white'}`}>
      <Icon size={20} className={`${active || highlight ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} transition-transform group-hover:scale-110`} />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  const QuickAction = ({ icon: Icon, title, desc, color, onClick }) => (
    <div onClick={onClick} className="group relative overflow-hidden bg-[#59647A]/30 backdrop-blur-sm border border-white/5 p-5 rounded-2xl cursor-pointer hover:bg-[#59647A]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-500"><Icon size={64} color={color} /></div>
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-xl border border-white/5" style={{backgroundColor: `${color}20`}}><Icon size={24} color={color} /></div>
        <div><h3 className="text-[#EAE6DA] font-bold text-lg">{title}</h3><p className="text-[#B0BCC9] text-xs mt-1 leading-relaxed">{desc}</p></div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium tracking-wider uppercase" style={{color: color}}>Accéder <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/></div>
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

  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#EAE6DA]"></div></div>;

  return (
    <div className="flex h-screen bg-[#2F3A4A] font-sans overflow-hidden relative">
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

      <main className="flex-1 overflow-y-auto bg-[url('/noise.png')] p-4 md:p-8 relative">
        <div className="flex justify-between items-center mb-8">
           <div className="md:hidden flex items-center gap-3"><Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" /><h1 className="text-lg font-bold text-[#EAE6DA]">TAFSUT</h1></div>
           <div className="hidden md:block"><h2 className="text-3xl font-bold text-white mb-1">Bon retour, {stats.username}</h2><p className="text-[#B0BCC9]">{userRole === 'COACH' ? "Activité professionnelle." : "Votre progression en temps réel."}</p></div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-3 bg-[#59647A] rounded-xl text-[#EAE6DA]"><Menu size={24} /></button>
           <div className="hidden md:flex w-12 h-12 bg-[#59647A] rounded-full items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10 shadow-lg">{stats.username?.charAt(0).toUpperCase()}</div>
        </div>

        {userRole === 'COACH' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                 <div className="p-3 bg-[#FFD93D]/10 rounded-full w-fit mb-3 text-[#FFD93D]"><DollarSign size={24} /></div>
                 <h3 className="text-4xl font-bold text-white mb-1">{stats.earnings || 0} €</h3>
                 <p className="text-sm text-[#B0BCC9]">Revenus générés</p>
             </div>
             {/* Autres stats coach */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] opacity-90"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div><p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Jours de Lumière</p><h3 className="text-7xl font-bold text-white tracking-tighter">{stats.days}</h3></div>
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Trophy size={32} className="text-white" /></div>
                </div>
                <div className="mt-8 flex items-center gap-3"><span className="text-xs font-bold text-white uppercase tracking-widest">Continuer ! 🔥</span></div>
              </div>
            </div>
            <div className="bg-[#59647A]/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center shadow-xl hover:bg-[#59647A]/30 transition">
              <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4 text-[#4ECDC4] shadow-lg"><DollarSign size={32} /></div>
              <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
              <p className="text-[#B0BCC9] text-sm font-medium">Économisés</p>
            </div>
          </div>
        )}

        <div className="hidden md:block">
          <h3 className="text-xl font-bold mb-4 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Accès Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRole === 'COACH' ? (
               <>
                 <QuickAccessCard icon={Briefcase} title="Espace Pro" sub="Gérer RDV" color="#FFD93D" onClick={() => router.push('/dashboard/coach')} />
                 <QuickAccessCard icon={Users} title="Annuaire" sub="Voir profils" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
               </>
            ) : (
               <>
                 <QuickAccessCard icon={MessageCircle} title="Coach IA" sub="Discussion" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
                 <QuickAccessCard icon={Users} title="Experts" sub="Prendre RDV" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
                 <QuickAccessCard icon={BookOpen} title="Journal" sub="Pensées" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
                 <QuickAccessCard icon={AlertTriangle} title="Urgence" sub="Aide" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
               </>
            )}
          </div>
        </div>

        <div className="md:hidden mt-8 p-6 bg-[#59647A]/20 border border-dashed border-white/10 rounded-2xl text-center">
           <p className="text-[#EAE6DA]/60 text-sm">Tout est dans le <span className="text-[#EAE6DA] font-bold">Menu ☰</span></p>
        </div>

        {/* --- BOUTON RECHUTE (POUR LE WEB) --- */}
        {userRole === 'USER' && (
          <div className="mt-12 text-center border-t border-white/5 pt-8 pb-8">
            <button onClick={handleRelapse} className="text-[#FF6B6B]/60 hover:text-[#FF6B6B] text-sm underline transition">
              Déclarer une rechute (Remise à zéro)
            </button>
          </div>
        )}

      </main>
    </div>
  );
}