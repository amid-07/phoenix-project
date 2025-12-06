'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`${API_URL}/bookings/patient/${userId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' } // <--- FIX
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

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
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#4ECDC4]/10 rounded-xl text-[#4ECDC4]">
          <Calendar size={32} />
        </div>
        <h1 className="text-3xl font-bold">Mes Rendez-vous</h1>
      </div>

      {loading && <p className="text-[#EAE6DA]/40 text-center">Chargement...</p>}

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isActive = isSessionActive(booking.date);
          const date = new Date(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg hover:border-white/20 transition">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                  {booking.coach.username.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{booking.coach.username}</h3>
                  <div className="flex items-center gap-2 text-[#EAE6DA]/60 text-sm mt-1">
                    <Calendar size={14} />
                    <span className="capitalize">
                      {date.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}
                    </span>
                    <span className="text-[#EAE6DA]/30">|</span>
                    {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                
                {/* Badge Statut */}
                <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                  booking.status === 'CONFIRMED' ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20' :
                  booking.status === 'CANCELLED' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20' :
                  'bg-[#FFD93D]/10 text-[#FFD93D] border-[#FFD93D]/20'
                }`}>
                  {booking.status === 'CONFIRMED' && <><CheckCircle size={16}/> Confirmé</>}
                  {booking.status === 'CANCELLED' && <><XCircle size={16}/> Refusé</>}
                  {booking.status === 'PENDING' && <><Clock size={16}/> En attente</>}
                </div>

                {/* Bouton Visio */}
                {booking.status === 'CONFIRMED' && (
                  isActive ? (
                    <button 
                      onClick={() => openVideo(booking.id)}
                      className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#2F3A4A] px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-[#4ECDC4]/20"
                    >
                      <Video size={18} /> Rejoindre
                    </button>
                  ) : (
                    <div className="text-xs text-[#EAE6DA]/40 italic flex flex-col items-end">
                      <span>Lien vidéo disponible</span>
                      <span>15 min avant l'heure</span>
                    </div>
                  )
                )}
              </div>

            </div>
          );
        })}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-20 bg-[#59647A]/50 rounded-2xl border border-dashed border-white/10">
            <AlertCircle size={48} className="mx-auto text-[#EAE6DA]/20 mb-4"/>
            <p className="text-[#EAE6DA]/40 text-lg">Aucun rendez-vous prévu.</p>
            <p className="text-[#EAE6DA]/30 text-sm mt-2">Allez dans "Experts" pour réserver.</p>
          </div>
        )}
      </div>
    </div>
  );
}