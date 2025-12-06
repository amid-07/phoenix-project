'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut, 
  Trophy, 
  Activity, 
  AlertTriangle, 
  MessageCircle, 
  Calendar, 
  Zap, 
  Briefcase, 
  DollarSign, 
  ClipboardList 
} from 'lucide-react';

export default function Dashboard() {
  // États
  const [stats, setStats] = useState(null); // Null au début pour gérer le chargement
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const router = useRouter();

  // ⚠️ API URL : Utilisez localhost pour le Web local pour éviter les erreurs CORS/Ngrok
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- 1. CHARGEMENT ---
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    
    // Sécurité : Si pas connecté, retour à l'accueil
    if (!id) {
      router.push('/'); 
      return;
    }
    
    setUserName(name || 'Membre TAFSUT');

    // Récupération des données
    fetch(`${API_URL}/users/${id}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        if (data.role) setUserRole(data.role);
      })
      .catch(err => console.error("Erreur connexion:", err));
  }, [router]);

  // --- 2. DÉCONNEXION ---
  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // --- COMPOSANTS UI INTERNES ---
  
  // Bouton du menu latéral
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

  // Carte d'accès rapide
  const QuickAccessCard = ({ icon: Icon, title, sub, color, onClick }) => (
    <div 
      onClick={onClick} 
      className="group bg-[#59647A] p-6 rounded-2xl border border-white/5 hover:border-white/20 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg"
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold mb-1 text-[#EAE6DA]">{title}</h4>
      <p className="text-[#EAE6DA]/50 text-sm">{sub}</p>
    </div>
  );

  // Si chargement
  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] flex items-center justify-center">Chargement de votre espace...</div>;

  return (
    <div className="flex h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-hidden">
      
      {/* --- SIDEBAR (Menu Gauche) --- */}
      <aside className="w-64 bg-[#59647A] border-r border-white/5 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold mb-10 text-[#EAE6DA] tracking-widest text-center">TAFSUT</h1>
          
          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active onClick={() => {}} />
            
            {userRole === 'COACH' ? (
              <>
                {/* Menu Spécial Coach */}
                <SidebarItem icon={Briefcase} label="Espace Pro" highlight onClick={() => router.push('/dashboard/coach')} />
                <SidebarItem icon={Users} label="Annuaire Experts" onClick={() => router.push('/dashboard/marketplace')} />
              </>
            ) : (
              <>
                {/* Menu Patient */}
                <SidebarItem icon={BookOpen} label="Journal" onClick={() => router.push('/dashboard/journal')} />
                <SidebarItem icon={Users} label="Experts" onClick={() => router.push('/dashboard/marketplace')} />
                <SidebarItem icon={Calendar} label="Mes RDV" onClick={() => router.push('/dashboard/bookings')} />
                <SidebarItem icon={MessageCircle} label="Coach IA" onClick={() => router.push('/dashboard/chat')} />
                <SidebarItem icon={Activity} label="Bilan IA" onClick={() => router.push('/dashboard/analysis')} />
              </>
            )}
          </nav>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition w-full"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* En-tête */}
        <header className="flex justify-between items-center mb-8">
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

        {/* --- VUE COACH --- */}
        {userRole === 'COACH' ? (
          <>
            {/* KPI Coach */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Revenus */}
              <div className="bg-[#59647A] p-6 rounded-2xl border border-[#FFD93D]/30 shadow-lg flex flex-col justify-center items-center">
                 <div className="p-3 bg-[#FFD93D]/10 rounded-full mb-3 text-[#FFD93D]"><DollarSign size={32} /></div>
                 <h3 className="text-4xl font-bold text-[#FFD93D]">{stats.earnings || 0} €</h3>
                 <p className="text-sm text-[#EAE6DA]/60 mt-1">Revenus Totaux</p>
              </div>

              {/* Demandes */}
              <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
                 <div className="p-3 bg-[#EAE6DA]/10 rounded-full mb-3 text-[#EAE6DA]"><ClipboardList size={32} /></div>
                 <h3 className="text-4xl font-bold text-white">{stats.reservationsCount || 0}</h3>
                 <p className="text-sm text-[#EAE6DA]/60 mt-1">Demandes reçues</p>
              </div>

              {/* Tarif */}
              <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
                 <div className="p-3 bg-[#4ECDC4]/10 rounded-full mb-3 text-[#4ECDC4]"><Users size={32} /></div>
                 <h3 className="text-4xl font-bold text-[#4ECDC4]">{stats.hourlyRate} €/h</h3>
                 <p className="text-sm text-[#EAE6DA]/60 mt-1">Tarif Actuel</p>
              </div>
            </div>

            {/* Accès Rapide Coach */}
            <h3 className="text-xl font-bold mb-4 mt-8 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Gestion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <QuickAccessCard icon={Briefcase} title="Espace Professionnel" sub="Gérer et confirmer les RDV" color="#FFD93D" onClick={() => router.push('/dashboard/coach')} />
               <QuickAccessCard icon={Users} title="Annuaire Experts" sub="Voir les profils collègues" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
            </div>
          </>
        ) : (
          
          /* --- VUE PATIENT --- */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Carte Jours */}
              <div className="bg-[#59647A] p-6 rounded-2xl shadow-xl text-[#EAE6DA] border-2 border-[#EAE6DA]/10 relative overflow-hidden">
                <p className="text-[#EAE6DA]/60 font-medium uppercase tracking-wider text-sm">Jours de lumière</p>
                <h3 className="text-6xl font-thin mt-2 text-white">{stats.days}</h3>
                <div className="mt-4 inline-flex items-center gap-2 text-[#4ECDC4] font-bold">
                  <Trophy size={16} /> Continuez !
                </div>
              </div>

              {/* Carte Argent */}
              <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
                <div className="p-3 bg-[#4ECDC4]/10 rounded-full mb-3 text-[#4ECDC4]"><span className="text-3xl">💰</span></div>
                <h3 className="text-4xl font-bold text-[#4ECDC4]">{stats.money} €</h3>
                <p className="text-sm text-[#EAE6DA]/60 mt-1">Économisés</p>
              </div>

              {/* Carte Badges */}
              <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg">
                 <div className="flex items-center gap-2 mb-4 text-[#FFD93D] font-bold"><Trophy size={20} /> Succès</div>
                 <div className="flex flex-wrap gap-2">
                   {stats.badges?.length > 0 ? stats.badges.map((b,i) => (
                     <span key={i} className="bg-[#2F3A4A] text-[#FFD93D] px-3 py-1 rounded-full text-xs border border-[#FFD93D]/20">{b.name}</span>
                   )) : <p className="text-[#EAE6DA]/40 italic text-sm">Aucun badge.</p>}
                 </div>
              </div>
            </div>

            {/* Accès Rapide Patient */}
            <h3 className="text-xl font-bold mb-4 mt-8 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Accès Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <QuickAccessCard icon={MessageCircle} title="Coach IA" sub="Discussion 24/7" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
               <QuickAccessCard icon={Users} title="Experts" sub="Prendre RDV" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
               <QuickAccessCard icon={BookOpen} title="Journal" sub="Vos pensées" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
               <QuickAccessCard icon={AlertTriangle} title="Urgence" sub="Aide immédiate" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
               
               {/* Nouveau bouton pour voir ses RDV */}
               <QuickAccessCard icon={Calendar} title="Mes RDV" sub="Suivi demandes" color="#4ECDC4" onClick={() => router.push('/dashboard/bookings')} />
            </div>
          </>
        )}

      </main>
    </div>
  );
}