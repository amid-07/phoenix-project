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

  // Navigation Mobile (ferme le menu après le clic)
  const navigateMobile = (path) => {
    setIsMobileMenuOpen(false);
    if(path) router.push(path);
  };

  // --- COMPOSANTS UI PREMIUM ---

  // Item du Menu (Sidebar & Mobile)
  const SidebarItem = ({ icon: Icon, label, onClick, active, highlight }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
        highlight 
          ? 'bg-gradient-to-r from-[#FFD93D]/20 to-transparent text-[#FFD93D] border-l-4 border-[#FFD93D]' 
          : active 
            ? 'bg-white/10 text-white font-medium border-l-4 border-[#EAE6DA]' 
            : 'text-[#B0BCC9] hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} className={`${active || highlight ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} transition-transform group-hover:scale-110`} />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  // Carte Accès Rapide (Design Premium)
  const QuickAction = ({ icon: Icon, title, desc, color, onClick }) => (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden bg-[#59647A]/30 backdrop-blur-sm border border-white/5 p-5 rounded-2xl cursor-pointer hover:bg-[#59647A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Effet d'icône géante en fond */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-500">
        <Icon size={64} color={color} />
      </div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-xl border border-white/5" style={{backgroundColor: `${color}20`}}>
          <Icon size={24} color={color} />
        </div>
        <div>
          <h3 className="text-[#EAE6DA] font-bold text-lg">{title}</h3>
          <p className="text-[#B0BCC9] text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-xs font-medium tracking-wider uppercase" style={{color: color}}>
        Accéder <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
      </div>
    </div>
  );

  // Contenu du Menu (Réutilisé Mobile/Desktop)
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
      
      {/* =========================================
          1. MENU MOBILE (Overlay Plein Écran)
         ========================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Fond sombre */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Panneau latéral Mobile */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#252E3E] p-6 shadow-2xl flex flex-col border-r border-white/10 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
                 <h1 className="text-xl font-bold text-[#EAE6DA] tracking-widest">TAFUT</h1>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-[#59647A] rounded-full text-[#EAE6DA]">
                  <X size={24} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto"><MenuContent /></div>
          </div>
        </div>
      )}

      {/* =========================================
          2. SIDEBAR DESKTOP (Fixe à gauche)
         ========================================= */}
      <aside className="w-72 bg-[#252E3E] border-r border-white/5 hidden md:flex flex-col justify-between relative">
         {/* Glow effect background */}
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#6C63FF]/10 to-transparent pointer-events-none"/>
         
         <div className="p-6 relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-12">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-[#EAE6DA] rounded-full blur opacity-20 animate-pulse"></div>
                <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#EAE6DA] tracking-widest">TAFUT</h1>
                <p className="text-[10px] text-[#B0BCC9] uppercase tracking-wider">Santé Mentale</p>
              </div>
            </div>
            <MenuContent />
         </div>
      </aside>

      {/* =========================================
          3. CONTENU PRINCIPAL (Scrollable)
         ========================================= */}
      <main className="flex-1 overflow-y-auto bg-[url('/noise.png')] p-4 md:p-8 relative">
        
        {/* EN-TÊTE (Header) */}
        <div className="flex justify-between items-center mb-8">
           
           {/* Mobile Header : Logo + Menu */}
           <div className="md:hidden flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
              <h1 className="text-lg font-bold text-[#EAE6DA]">TAFUT</h1>
           </div>

           {/* Desktop Header : Bonjour... */}
           <div className="hidden md:block">
              <h2 className="text-3xl font-bold text-white mb-1">Bon retour, {stats.username}</h2>
              <p className="text-[#B0BCC9]">{userRole === 'COACH' ? "Activité professionnelle." : "Votre progression en temps réel."}</p>
           </div>

           {/* Bouton Hamburger Mobile */}
           <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-3 bg-[#59647A] rounded-xl text-[#EAE6DA]">
             <Menu size={24} />
           </button>

           {/* Avatar Desktop */}
           <div className="hidden md:flex w-12 h-12 bg-[#59647A] rounded-full items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10 shadow-lg">
             {stats.username?.charAt(0).toUpperCase()}
           </div>
        </div>

        {/* --- STATS PRINCIPALES --- */}
        {userRole === 'COACH' ? (
          /* Coach Stats */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                 <div className="p-3 bg-[#FFD93D]/10 rounded-full w-fit mb-3 text-[#FFD93D]"><DollarSign size={24} /></div>
                 <h3 className="text-4xl font-bold text-white mb-1">{stats.earnings || 0} €</h3>
                 <p className="text-sm text-[#B0BCC9]">Revenus générés</p>
             </div>
             {/* ... autres stats ... */}
          </div>
        ) : (
          /* Patient Stats */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Carte Hero Jours */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Jours de Lumière</p>
                    <h3 className="text-7xl font-bold text-white tracking-tighter">{stats.days}</h3>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <Trophy size={32} className="text-white" />
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-3">
                   <div className="h-1.5 flex-1 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white w-3/4 rounded-full"></div></div>
                   <span className="text-xs font-bold text-white uppercase tracking-widest">Continuer ! 🔥</span>
                </div>
              </div>
            </div>

            {/* Carte Argent */}
            <div className="bg-[#59647A]/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center shadow-xl hover:bg-[#59647A]/30 transition">
              <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4 text-[#4ECDC4] shadow-lg shadow-[#4ECDC4]/20">
                <DollarSign size={32} />
              </div>
              <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
              <p className="text-[#B0BCC9] text-sm font-medium">Économisés</p>
            </div>
          </div>
        )}
        
        {/* SUCCÈS & BADGES (Bandeau) */}
        <div className="mb-10 bg-[#252E3E] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden relative shadow-lg">
           <div className="min-w-fit flex items-center gap-2 text-[#FFD93D] font-bold border-r border-white/10 pr-6">
             <Trophy size={20} /> Succès
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {stats.badges?.length > 0 ? stats.badges.map((b,i) => (
                <span key={i} className="flex items-center gap-2 bg-[#2F3A4A] px-4 py-2 rounded-lg text-xs font-medium text-[#EAE6DA] border border-white/10 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#FFD93D]"></span> {b.name}
                </span>
              )) : <span className="text-sm text-[#B0BCC9] italic">Aucun badge.</span>}
           </div>
        </div>

        {/* --- GRILLE D'ACCÈS RAPIDE (VISIBLE SUR DESKTOP, CACHÉE SUR MOBILE) --- */}
        <div className="hidden md:block">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Zap size={20} className="text-[#4ECDC4]"/> Accès Rapide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {userRole === 'COACH' ? (
               <>
                 <QuickAction icon={Briefcase} title="Gérer mon cabinet" desc="Accédez à vos demandes." color="#FFD93D" onClick={() => navigateMobile('/dashboard/coach')} />
                 <QuickAction icon={Users} title="Annuaire" desc="Voir les profils." color="#4ECDC4" onClick={() => navigateMobile('/dashboard/marketplace')} />
               </>
            ) : (
               <>
                 <QuickAction icon={MessageCircle} title="Coach IA" desc="Discussion & Soutien 24/7" color="#EAE6DA" onClick={() => navigateMobile('/dashboard/chat')} />
                 <QuickAction icon={Users} title="Experts" desc="Trouvez un psychologue certifié" color="#4ECDC4" onClick={() => navigateMobile('/dashboard/marketplace')} />
                 <QuickAction icon={BookOpen} title="Journal" desc="Notez vos pensées du jour" color="#FFD93D" onClick={() => navigateMobile('/dashboard/journal')} />
                 <QuickAction icon={AlertTriangle} title="Urgence" desc="Besoin d'aide immédiate ?" color="#FF6B6B" onClick={() => navigateMobile('/dashboard/crisis')} />
               </>
            )}
          </div>
        </div>

        {/* --- MESSAGE POUR MOBILE --- */}
        <div className="md:hidden mt-8 p-6 bg-[#59647A]/20 border border-dashed border-white/10 rounded-2xl text-center">
           <p className="text-[#EAE6DA]/60 text-sm">
             Toutes les fonctionnalités (Journal, IA, Experts) sont disponibles dans le <span className="text-[#EAE6DA] font-bold">Menu ☰</span> en haut.
           </p>
        </div>

      </main>
    </div>
  );
}