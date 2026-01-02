'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`${API_URL}/bookings/patient/${userId}`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(res => res.json()).then(data => {
        setBookings(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      });
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#EAE6DA]">Mes Rendez-vous</h1>
      
      {loading && <p className="text-[#EAE6DA]/50">Chargement...</p>}

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isActive = isSessionActive(booking.date);
          const date = new Date(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-[#EAE6DA] border border-white/10">
                  {booking.coach.username.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#EAE6DA]">{booking.coach.username}</h3>
                  <div className="flex items-center gap-2 text-[#B0BCC9] text-sm mt-1">
                    <Calendar size={14} /> {date.toLocaleDateString()}
                    <Clock size={14} className="ml-2"/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  booking.status === 'CONFIRMED' ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20' :
                  booking.status === 'CANCELLED' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20' :
                  'bg-[#FFD93D]/10 text-[#FFD93D] border-[#FFD93D]/20'
                }`}>
                  {booking.status}
                </span>

                {booking.status === 'CONFIRMED' && (
                  isActive ? (
                    <button onClick={() => openVideo(booking.id)} className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition animate-pulse">
                      <Video size={16} /> Rejoindre
                    </button>
                  ) : <span className="text-xs text-[#B0BCC9] italic">Lien dispo 15min avant</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}