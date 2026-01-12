'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Trophy, Activity, 
  AlertTriangle, MessageCircle, Calendar, Zap, Briefcase, 
  DollarSign, ClipboardList, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('Utilisateur');
  const router = useRouter();

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // --- CHARGEMENT ---
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

  if (!stats) return <div className="min-h-screen bg-[#2F3A4A] text-[#EAE6DA] flex items-center justify-center">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- EN-TÊTE --- */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DA]">Bonjour, {userName} 👋</h2>
          <p className="text-[#EAE6DA]/60 mt-1">
            {userRole === 'COACH' ? "Activité professionnelle." : "Votre progression vers la lumière."}
          </p>
        </div>
        <div className="w-12 h-12 bg-[#59647A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10 shadow-lg">
          {userName.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* --- VUE COACH --- */}
      {userRole === 'COACH' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#59647A] p-6 rounded-2xl border border-[#FFD93D]/30 shadow-lg flex flex-col justify-center items-center">
               <div className="p-3 bg-[#FFD93D]/10 rounded-full mb-3 text-[#FFD93D]"><DollarSign size={32} /></div>
               <h3 className="text-4xl font-bold text-[#FFD93D]">{stats.earnings || 0} €</h3>
               <p className="text-sm text-[#EAE6DA]/60 mt-1">Revenus Totaux</p>
            </div>
            <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
               <div className="p-3 bg-[#EAE6DA]/10 rounded-full mb-3 text-[#EAE6DA]"><ClipboardList size={32} /></div>
               <h3 className="text-4xl font-bold text-white">{stats.reservationsCount || 0}</h3>
               <p className="text-sm text-[#EAE6DA]/60 mt-1">Demandes reçues</p>
            </div>
            <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
               <div className="p-3 bg-[#4ECDC4]/10 rounded-full mb-3 text-[#4ECDC4]"><Users size={32} /></div>
               <h3 className="text-4xl font-bold text-[#4ECDC4]">{stats.hourlyRate} €/h</h3>
               <p className="text-sm text-[#EAE6DA]/60 mt-1">Tarif Actuel</p>
            </div>
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
                  <div>
                    <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Jours de Lumière</p>
                    <h3 className="text-7xl font-bold text-white tracking-tighter">{stats.days}</h3>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"><Trophy size={32} className="text-white" /></div>
                </div>
                <div className="mt-8 flex items-center gap-3">
                   <div className="h-1.5 flex-1 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white w-3/4 rounded-full"></div></div>
                   <span className="text-xs font-bold text-white uppercase tracking-widest">Continuer ! 🔥</span>
                </div>
              </div>
            </div>

            <div className="bg-[#59647A] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center items-center">
              <div className="p-4 bg-[#4ECDC4]/10 rounded-full mb-4 text-[#4ECDC4]"><DollarSign size={36} /></div>
              <h3 className="text-4xl font-bold text-[#EAE6DA] mb-1">{stats.money} €</h3>
              <p className="text-[#EAE6DA]/60 text-sm font-medium">Économisés</p>
            </div>
          </div>

          <div className="mb-10 bg-[#59647A] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden relative shadow-lg">
             <div className="min-w-fit flex items-center gap-2 text-[#FFD93D] font-bold border-r border-white/10 pr-6">
               <Trophy size={20} /> Succès
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {stats.badges?.length > 0 ? stats.badges.map((b,i) => (
                  <span key={i} className="flex items-center gap-2 bg-[#2F3A4A] px-4 py-2 rounded-lg text-xs font-medium text-[#EAE6DA] border border-white/10 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#FFD93D]"></span> {b.name}
                  </span>
                )) : <span className="text-sm text-[#EAE6DA]/40 italic">Aucun badge débloqué pour l'instant.</span>}
             </div>
          </div>

          {/* Accès Rapide (Caché sur mobile) */}
          <div className="hidden md:block">
            <h3 className="text-xl font-bold mb-4 text-[#EAE6DA] flex items-center gap-2"><Zap size={20}/> Accès Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <QuickAccessCard icon={MessageCircle} title="Coach IA" sub="Discussion 24/7" color="#EAE6DA" onClick={() => router.push('/dashboard/chat')} />
               <QuickAccessCard icon={Users} title="Experts" sub="Prendre RDV" color="#4ECDC4" onClick={() => router.push('/dashboard/marketplace')} />
               <QuickAccessCard icon={BookOpen} title="Journal" sub="Vos pensées" color="#FFD93D" onClick={() => router.push('/dashboard/journal')} />
               <QuickAccessCard icon={AlertTriangle} title="Urgence" sub="Aide immédiate" color="#FF6B6B" onClick={() => router.push('/dashboard/crisis')} />
            </div>
          </div>

          {/* --- BOUTON RECHUTE (NOUVEAU) --- */}
          <div className="mt-12 text-center border-t border-white/5 pt-8 pb-8">
            <button 
              onClick={handleRelapse}
              className="text-[#FF6B6B]/60 hover:text-[#FF6B6B] text-sm underline transition"
            >
              Déclarer une rechute (Remise à zéro)
            </button>
          </div>
        </>
      )}

    </div>
  );
}