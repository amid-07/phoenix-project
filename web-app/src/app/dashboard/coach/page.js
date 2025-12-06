'use client';

import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase } from 'lucide-react';

export default function CoachDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const response = await fetch(`${API_URL}/bookings/coach/${userId}`);
      const data = await response.json();
      
      // Trier : En attente d'abord, puis par date
      const sorted = data.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.date) - new Date(a.date);
      });
      
      setRequests(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      fetchRequests();
    } catch (e) {
      alert("Erreur lors de l'action");
    }
  };

  const openVideo = (id) => {
    window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  };

  const isSessionActive = (dateString) => {
    const rdvTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = (now - rdvTime) / (1000 * 60);
    return diff > -15 && diff < 90;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FFD93D]/10 rounded-xl text-[#FFD93D]">
          <Briefcase size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Espace Professionnel</h1>
          <p className="text-gray-400">Gérez vos demandes de rendez-vous.</p>
        </div>
      </div>

      {loading && <p className="text-gray-500 text-center py-10">Chargement des demandes...</p>}

      <div className="space-y-4">
        {requests.map((req) => {
          const isActive = isSessionActive(req.date);
          const date = new Date(req.date);

          return (
            <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg hover:border-white/20 transition">
              
              {/* Info Patient */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                  {req.patient.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#EAE6DA]">{req.patient.username}</h3>
                  <div className="flex items-center gap-2 text-[#EAE6DA]/60 text-sm mt-1">
                    <Calendar size={14} />
                    <span className="capitalize">
                      {date.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}
                    </span>
                    <Clock size={14} className="ml-2"/>
                    {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              {/* État et Actions */}
              <div className="flex items-center gap-4">
                
                {/* En Attente */}
                {req.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(req.id, 'CONFIRMED')}
                      className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#2F3A4A] px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
                    >
                      <Check size={18} /> Accepter
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'CANCELLED')}
                      className="bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30 px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition border border-[#FF6B6B]/30"
                    >
                      <X size={18} /> Refuser
                    </button>
                  </div>
                )}

                {/* Confirmé */}
                {req.status === 'CONFIRMED' && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[#4ECDC4] font-bold bg-[#4ECDC4]/10 px-3 py-1 rounded-full text-sm border border-[#4ECDC4]/20 flex items-center gap-2">
                      <Check size={14} /> Confirmé
                    </span>
                    
                    {isActive ? (
                      <button 
                        onClick={() => openVideo(req.id)}
                        className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse shadow-lg shadow-[#6C63FF]/30"
                      >
                        <Video size={18} /> Lancer la séance
                      </button>
                    ) : (
                      <span className="text-xs text-[#EAE6DA]/40 italic flex items-center gap-1">
                        <Clock size={12}/> Lien disponible 15min avant
                      </span>
                    )}
                  </div>
                )}

                {/* Refusé */}
                {req.status === 'CANCELLED' && (
                  <span className="text-[#EAE6DA]/40 font-bold bg-[#2F3A4A] px-4 py-2 rounded-xl text-sm border border-white/5">
                    Refusé
                  </span>
                )}

              </div>
            </div>
          );
        })}

        {!loading && requests.length === 0 && (
          <div className="text-center py-20 bg-[#59647A]/50 rounded-2xl border border-dashed border-white/10">
            <User size={48} className="mx-auto text-[#EAE6DA]/20 mb-4"/>
            <p className="text-[#EAE6DA]/40 text-lg">Aucune demande de rendez-vous.</p>
          </div>
        )}
      </div>
    </div>
  );
}