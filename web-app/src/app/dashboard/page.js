'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight, Menu, X // Ajout de Menu et X
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile
  const router = useRouter();

  // ⚠️ URL Localhost
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    
    if (!id) { router.push('/'); return; }
    
    setUserName(name || 'Membre TAFSUT');

    fetch(`${API_URL}/users/${id}/stats`)
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

  // Navigation vers une page (ferme le menu mobile)
  const navigateTo = (path) => {
    setIsMobileMenuOpen(false);
    if (path) router.push(path);
  };

  // Composant Menu Latéral
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

  // Composant Carte Accès Rapide
  const QuickAction = ({ icon: Icon, title, desc, color, onClick }) => (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden bg-[#59647A]/30 backdrop-blur-sm border border-white/5 p-5 rounded-2xl cursor-pointer hover:bg-[#59647A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-500">
        <Icon size={64} color={color} />
      </div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-[${color}]/20 to-transparent border border-white/5`} style={{backgroundColor: `${color}20`}}>
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

  // Contenu du Menu (Utilisé pour Desktop et Mobile)
  const MenuContent = () => (
    <>
      <div className="space-y-1">
        <p className="px-4 text-xs font-bold text-[#59647A] uppercase tracking-widest mb-2">Menu Principal</p>
        <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active onClick={() => navigateTo()} />
        
        {userRole === 'COACH' ? (
          <>
            <SidebarItem icon={Briefcase} label="Espace Pro" highlight onClick={() => navigateTo('/dashboard/coach')} />
            <SidebarItem icon={Users} label="Annuaire Experts" onClick={() => navigateTo('/dashboard/marketplace')} />
          </>
        ) : (
          <>
            <SidebarItem icon={BookOpen} label="Journal de Bord" onClick={() => navigateTo('/dashboard/journal')} />
            <SidebarItem icon={Users} label="Experts & Coachs" onClick={() => navigateTo('/dashboard/marketplace')} />
            <SidebarItem icon={Calendar} label="Mes Rendez-vous" onClick={() => navigateTo('/dashboard/bookings')} />
            <SidebarItem icon={Activity} label="Bilan & Analyse" onClick={() => navigateTo('/dashboard/analysis')} />
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
    <div className="flex h-screen bg-[#2F3A4A] font-sans overflow-hidden">
      
      {/* === SIDEBAR DESKTOP (Cachée sur mobile) === */}
      <aside className="w-72 bg-[#252E3E] border-r border-white/5 flex-col justify-between hidden md:flex relative">
        <div className="p-6 relative z-10 h-full flex flex-col">
          {/* Logo Desktop */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-12 h-12">
               <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#EAE6DA] tracking-widest">TAFSUT</h1>
              <p className="text-[10px] text-[#B0BCC9] uppercase tracking-wider">Santé Mentale</p>
            </div>
          </div>
          
          <MenuContent />
        </div>
      </aside>

      {/* === MENU MOBILE (OVERLAY) === */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Fond sombre cliquable pour fermer */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Le Menu Latéral Mobile */}
          <div className="relative bg-[#252E3E] w-3/4 max-w-sm h-full shadow-2xl p-6 flex flex-col animate-slide-in">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
                 <h1 className="text-xl font-bold text-[#EAE6DA] tracking-widest">TAFSUT</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#B0BCC9] hover:text-white">
                <X size={28} />
              </button>
            </div>
            <MenuContent />
          </div>
        </div>
      )}

      {/* === CONTENU PRINCIPAL === */}
      <main className="flex-1 overflow-y-auto bg-[url('/noise.png')] relative"> 
        
        {/* HEADER MOBILE (Visible uniquement sur mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#252E3E] border-b border-white/5 sticky top-0 z-40">
           <div className="flex items-center gap-3">
             <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
             <h1 className="text-lg font-bold text-[#EAE6DA]">TAFSUT</h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#EAE6DA]">
             <Menu size={28} />
           </button>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          
          <header className="mb-10 mt-4 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Bon retour, {stats.username}</h2>
            <p className="text-[#B0BCC9] text-sm md:text-base">Voici un aperçu de votre progression.</p>
          </header>

          {/* ... (LE RESTE DU CONTENU RESTE IDENTIQUE) ... */}
          {userRole === 'COACH' ? (
            /* --- DASHBOARD COACH --- */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#FFD93D]/20 rounded-xl text-[#FFD93D]"><DollarSign size={24} /></div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">{stats.earnings || 0} €</h3>
                  <p className="text-sm text-[#B0BCC9]">Revenus générés</p>
                </div>

                <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#EAE6DA]/20 rounded-xl text-[#EAE6DA]"><ClipboardList size={24} /></div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">{stats.reservationsCount || 0}</h3>
                  <p className="text-sm text-[#B0BCC9]">Demandes de RDV</p>
                </div>

                <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                   <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#4ECDC4]/20 rounded-xl text-[#4ECDC4]"><Users size={24} /></div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-1">{stats.hourlyRate} €<span className="text-lg text-[#B0BCC9] font-normal">/h</span></h3>
                  <p className="text-sm text-[#B0BCC9]">Tarif actuel</p>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Briefcase size={20} className="text-[#FFD93D]"/> Actions Rapides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickAction icon={Briefcase} title="Gérer mon cabinet" desc="Accédez à vos demandes et confirmez les créneaux." color="#FFD93D" onClick={() => navigateTo('/dashboard/coach')} />
                <QuickAction icon={Users} title="Consulter l'annuaire" desc="Voir les profils des autres experts de la plateforme." color="#4ECDC4" onClick={() => navigateTo('/dashboard/marketplace')} />
              </div>
            </>
          ) : (
            /* --- DASHBOARD PATIENT --- */
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] opacity-90"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Jours de Lumière</p>
                        <h3 className="text-7xl font-bold text-white tracking-tighter">{stats.days}</h3>
                      </div>
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                        <Trophy size={32} className="text-white" />
                      </div>
                    </div>
                    <div className="mt-8 flex items-center gap-3">
                       <span className="text-sm font-bold text-white">Continuer ! 🔥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#59647A]/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center shadow-xl">
                  <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4 text-[#4ECDC4]">
                    <DollarSign size={32} />
                  </div>
                  <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
                  <p className="text-[#B0BCC9] text-sm font-medium">Économisés cette semaine</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Zap size={20} className="text-[#4ECDC4]"/> Accès Rapide
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <QuickAction icon={MessageCircle} title="Coach IA" desc="Discussion 24/7" color="#EAE6DA" onClick={() => navigateTo('/dashboard/chat')} />
                <QuickAction icon={Users} title="Experts" desc="Trouvez un psychologue" color="#4ECDC4" onClick={() => navigateTo('/dashboard/marketplace')} />
                <QuickAction icon={BookOpen} title="Journal" desc="Vos pensées du jour" color="#FFD93D" onClick={() => navigateTo('/dashboard/journal')} />
                <QuickAction icon={AlertTriangle} title="Urgence" desc="Besoin d'aide immédiate ?" color="#FF6B6B" onClick={() => navigateTo('/dashboard/crisis')} />
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}