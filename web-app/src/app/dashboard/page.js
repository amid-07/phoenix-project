'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight, TrendingUp 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const router = useRouter();

  // ⚠️ URL (Localhost pour le web)
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

  // Composant Menu Latéral Amélioré
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

  // Composant Carte Accès Rapide (Nouveau Design)
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

  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#EAE6DA]"></div></div>;

  return (
    <div className="flex h-screen bg-[#2F3A4A] font-sans overflow-hidden">
      
      {/* === SIDEBAR PREMIUM === */}
      <aside className="w-72 bg-[#252E3E] border-r border-white/5 flex flex-col justify-between hidden md:flex relative">
        {/* Glow effect background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#6C63FF]/10 to-transparent pointer-events-none"/>

        <div className="p-6 relative z-10">
          {/* LOGO AREA */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-[#EAE6DA] rounded-full blur opacity-20 animate-pulse"></div>
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#EAE6DA] tracking-widest">TAFSUT</h1>
              <p className="text-[10px] text-[#B0BCC9] uppercase tracking-wider">Santé Mentale</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-[#59647A] uppercase tracking-widest mb-2">Menu Principal</p>
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active onClick={() => {}} />
            
            {userRole === 'COACH' ? (
              <>
                <SidebarItem icon={Briefcase} label="Espace Pro" highlight onClick={() => router.push('/dashboard/coach')} />
                <SidebarItem icon={Users} label="Annuaire Experts" onClick={() => router.push('/dashboard/marketplace')} />
              </>
            ) : (
              <>
                <SidebarItem icon={BookOpen} label="Journal de Bord" onClick={() => router.push('/dashboard/journal')} />
                <SidebarItem icon={Users} label="Experts & Coachs" onClick={() => router.push('/dashboard/marketplace')} />
                <SidebarItem icon={Calendar} label="Mes Rendez-vous" onClick={() => router.push('/dashboard/bookings')} />
                <SidebarItem icon={Activity} label="Bilan & Analyse" onClick={() => router.push('/dashboard/analysis')} />
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#2F3A4A] rounded-xl p-4 mb-4 border border-white/5 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center text-white font-bold shadow-lg">
                {stats.username?.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm text-white font-bold truncate">{stats.username}</p>
               <p className="text-xs text-[#B0BCC9]">{userRole === 'COACH' ? 'Professionnel' : 'Membre'}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition text-sm font-bold border border-[#FF6B6B]/20 hover:border-[#FF6B6B]">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* === CONTENU PRINCIPAL === */}
      <main className="flex-1 overflow-y-auto bg-[url('/noise.png')]"> 
        <div className="p-8 max-w-7xl mx-auto">
          
          <header className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-1">Bon retour, {stats.username}</h2>
            <p className="text-[#B0BCC9]">Voici un aperçu de votre progression aujourd'hui.</p>
          </header>

          {userRole === 'COACH' ? (
            /* --- DASHBOARD COACH (Business) --- */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-[#59647A]/40 to-[#2F3A4A]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#FFD93D]/20 rounded-xl text-[#FFD93D]"><DollarSign size={24} /></div>
                    <span className="text-xs bg-[#FFD93D]/10 text-[#FFD93D] px-2 py-1 rounded">+12% cette semaine</span>
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
                <QuickAction icon={Briefcase} title="Gérer mon cabinet" desc="Accédez à vos demandes et confirmez les créneaux." color="#FFD93D" onClick={() => router.push('/dashboard/coach')} />
                <QuickAction icon={Users} title="Consulter l'annuaire" desc="Voir les profils des autres experts de la plateforme." color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
              </div>
            </>

          ) : (
            /* --- DASHBOARD PATIENT (Santé) --- */
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                
                {/* HERO CARD - JOURS */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] opacity-90 transition-opacity group-hover:opacity-100"></div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
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
                       <div className="h-2 flex-1 bg-black/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white w-3/4 rounded-full"></div>
                       </div>
                       <span className="text-sm font-bold text-white">Continuer ! 🔥</span>
                    </div>
                  </div>
                </div>

                {/* CARTE ÉCONOMIES */}
                <div className="bg-[#59647A]/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center shadow-xl hover:bg-[#59647A]/30 transition">
                  <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4 text-[#4ECDC4] shadow-lg shadow-[#4ECDC4]/20">
                    <DollarSign size={32} />
                  </div>
                  <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
                  <p className="text-[#B0BCC9] text-sm font-medium">Économisés cette semaine</p>
                </div>
              </div>

              {/* SUCCÈS & BADGES (Petit bandeau) */}
              <div className="mb-10 bg-[#252E3E] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden relative">
                <div className="min-w-fit flex items-center gap-2 text-[#FFD93D] font-bold border-r border-white/10 pr-6">
                  <Trophy size={20} /> Vos Succès
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                   {stats.badges?.length > 0 ? stats.badges.map((b,i) => (
                     <span key={i} className="flex items-center gap-2 bg-[#2F3A4A] px-4 py-2 rounded-lg text-xs font-medium text-[#EAE6DA] border border-white/10 whitespace-nowrap">
                       <span className="w-2 h-2 rounded-full bg-[#FFD93D]"></span> {b.name}
                     </span>
                   )) : <span className="text-sm text-[#B0BCC9] italic">Aucun badge débloqué pour l'instant.</span>}
                </div>
              </div>

              {/* GRILLE D'ACTIONS */}
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Zap size={20} className="text-[#4ECDC4]"/> Accès Rapide
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <QuickAction icon={MessageCircle} title="Coach IA" desc="Discussion & Soutien 24/7" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
                <QuickAction icon={Users} title="Experts" desc="Trouvez un psychologue certifié" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
                <QuickAction icon={BookOpen} title="Journal" desc="Notez vos pensées du jour" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
                <QuickAction icon={AlertTriangle} title="Urgence" desc="Besoin d'aide immédiate ?" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}