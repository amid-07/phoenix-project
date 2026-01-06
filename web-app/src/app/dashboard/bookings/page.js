'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`${API_URL}/bookings/patient/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}})
      .then(res => res.json())
      .then(data => {
        setBookings(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      });
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  
  const showReceipt = (booking) => {
    const address = booking.coach.professionalProfile?.address || "Adresse non renseignée.";
    alert(`📍 RDV CABINET\n\n${address}\n\nPrésentez ce message à l'accueil.`);
  };

  // LOGIQUE STRICTE DU TEMPS
  const isSessionActive = (dateString) => {
    const rdvTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - rdvTime) / (1000 * 60);

    // Visible si : On est max 15min avant le début ET max 60min après le début
    // Ex: RDV 14h00.
    // 13h40 (Diff -20) -> Faux
    // 13h50 (Diff -10) -> Vrai
    // 14h30 (Diff +30) -> Vrai
    // 15h05 (Diff +65) -> Faux
    return diffMinutes > -15 && diffMinutes < 60;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA]">
      <h1 className="text-3xl font-bold mb-8">Mes Rendez-vous</h1>
      {loading && <p>Chargement...</p>}

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isActive = isSessionActive(booking.date);
          const date = new Date(booking.date);
          const isRemote = booking.type === 'REMOTE';

          return (
            <div key={booking.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl">{booking.coach.username.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-lg">{booking.coach.username}</h3>
                  <div className="flex items-center gap-3 text-[#EAE6DA]/60 text-sm mt-1">
                    <span>{date.toLocaleDateString()} à {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isRemote ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'bg-[#FFD93D]/20 text-[#FFD93D]'}`}>
                        {isRemote ? 'VISIO' : 'CABINET'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {booking.status === 'CONFIRMED' ? (
                   isRemote ? (
                     isActive ? 
                       <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition animate-pulse"><Video size={18}/> Rejoindre</button> 
                       : <span className="text-xs text-[#EAE6DA]/40 italic border border-white/10 px-2 py-1 rounded">Lien -15min</span>
                   ) : (
                     <button onClick={() => showReceipt(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition"><Receipt size={18}/> Reçu</button>
                   )
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-bold border border-white/10 text-[#EAE6DA]/50">{booking.status}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}