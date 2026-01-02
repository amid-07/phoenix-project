'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Users, BookOpen, LogOut, Activity, MessageCircle, Calendar, Briefcase, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('USER');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) router.push('/');
    
    // On récupère juste le rôle pour afficher le bon menu
    fetch(`${API_URL}/users/${id}/stats`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(res => res.json())
      .then(data => { if (data.role) setUserRole(data.role); })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    if (confirm("Déconnexion ?")) { localStorage.clear(); window.location.href = '/'; }
  };

  const SidebarItem = ({ icon: Icon, label, path }) => {
    const isActive = pathname === path;
    return (
      <button 
        onClick={() => { router.push(path); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-[#EAE6DA] text-[#2F3A4A] font-bold shadow-lg' 
            : 'text-[#B0BCC9] hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#2F3A4A] text-[#EAE6DA] font-sans overflow-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="w-72 bg-[#252E3E] border-r border-white/5 hidden md:flex flex-col p-6 relative">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 relative"><Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" /></div>
          <h1 className="text-2xl font-bold tracking-widest text-[#EAE6DA]">TAFSUT</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Tableau de bord" path="/dashboard" />
          {userRole === 'COACH' ? (
            <>
              <SidebarItem icon={Briefcase} label="Espace Pro" path="/dashboard/coach" />
              <SidebarItem icon={Users} label="Annuaire" path="/dashboard/marketplace" />
            </>
          ) : (
            <>
              <SidebarItem icon={BookOpen} label="Journal" path="/dashboard/journal" />
              <SidebarItem icon={Users} label="Experts" path="/dashboard/marketplace" />
              <SidebarItem icon={Calendar} label="Mes RDV" path="/dashboard/bookings" />
              <SidebarItem icon={MessageCircle} label="Coach IA" path="/dashboard/chat" />
              <SidebarItem icon={Activity} label="Bilan IA" path="/dashboard/analysis" />
            </>
          )}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition mt-auto">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[url('/noise.png')]">
        {/* Header Mobile */}
        <div className="md:hidden p-4 flex justify-between items-center bg-[#252E3E] border-b border-white/5">
           <div className="flex items-center gap-2"><Image src="/logo.png" width={32} height={32} className="rounded-full"/><span className="font-bold">TAFSUT</span></div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={24}/></button>
        </div>

{/* Menu Mobile Overlay */}
{isMobileMenuOpen && (
          <div className="absolute inset-0 z-50 bg-[#252E3E] p-6 animate-in slide-in-from-top">
             <div className="flex justify-between mb-8">
               <h2 className="text-xl font-bold text-[#EAE6DA]">Menu</h2>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#EAE6DA]"><X/></button>
             </div>
             
             <nav className="space-y-4">
                {/* Liens communs */}
                <SidebarItem icon={LayoutDashboard} label="Tableau de bord" path="/dashboard" />

                {userRole === 'COACH' ? (
                  <>
                    <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold tracking-widest pt-4">Espace Pro</p>
                    <SidebarItem icon={Briefcase} label="Espace Pro" path="/dashboard/coach" />
                    <SidebarItem icon={Users} label="Annuaire" path="/dashboard/marketplace" />
                  </>
                ) : (
                  <>
                    <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold tracking-widest pt-4">Mental & Suivi</p>
                    <SidebarItem icon={BookOpen} label="Journal" path="/dashboard/journal" />
                    <SidebarItem icon={Activity} label="Bilan IA" path="/dashboard/analysis" /> {/* <-- AJOUTÉ */}
                    
                    <p className="text-xs text-[#EAE6DA]/40 uppercase font-bold tracking-widest pt-4">Santé</p>
                    <SidebarItem icon={MessageCircle} label="Coach IA" path="/dashboard/chat" /> {/* <-- AJOUTÉ */}
                    <SidebarItem icon={Users} label="Experts" path="/dashboard/marketplace" />
                    <SidebarItem icon={Calendar} label="Mes RDV" path="/dashboard/bookings" />
                  </>
                )}

                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[#FF6B6B] font-bold mt-8 border border-[#FF6B6B]/20 rounded-xl flex items-center gap-3">
                  <LogOut size={20}/> Déconnexion
                </button>
             </nav>
          </div>
        )}
        {/* C'est ici que les pages s'affichent */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}