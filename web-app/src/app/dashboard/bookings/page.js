'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ LOCALHOST
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`${API_URL}/bookings/patient/${userId}`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
        setLoading(false);
      });
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');

  // Afficher le reçu (Adresse)
  const showReceipt = (booking) => {
    const address = booking.coach.professionalProfile?.address || "Adresse non renseignée.";
    alert(`📅 REÇU DE RÉSERVATION\n\nExpert : ${booking.coach.username}\nDate : ${new Date(booking.date).toLocaleString()}\n\n📍 LIEU : ${address}\n\nVeuillez présenter ce message à l'accueil.`);
  };

  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-8 max-w-4xl mx-auto text-[#EAE6DA]">
      <h1 className="text-3xl font-bold mb-8">Mes Rendez-vous</h1>
      
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isActive = isSessionActive(booking.date);
          const isRemote = booking.type === 'REMOTE';

          return (
            <div key={booking.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                  {booking.coach.username.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{booking.coach.username}</h3>
                  <div className="flex items-center gap-3 text-[#EAE6DA]/70 text-sm mt-1">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(booking.date).getHours()}h00</span>
                    
                    {/* Badge Type */}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${!isRemote ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>
                      {!isRemote ? <><MapPin size={10}/> Cabinet</> : <><Video size={10}/> Visio</>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Statut */}
                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${
                  booking.status === 'CONFIRMED' ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20' :
                  booking.status === 'CANCELLED' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20' :
                  'bg-[#FFD93D]/10 text-[#FFD93D] border-[#FFD93D]/20'
                }`}>
                  {booking.status === 'CONFIRMED' ? 'Confirmé' : booking.status}
                </div>

                {/* Bouton d'action */}
                {booking.status === 'CONFIRMED' && (
                  isRemote ? (
                    isActive ? (
                      <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition animate-pulse">
                        <Video size={18} /> Rejoindre
                      </button>
                    ) : <span className="text-xs text-[#EAE6DA]/40 italic">Lien dispo -15min</span>
                  ) : (
                    <button onClick={() => showReceipt(booking)} className="bg-[#FFD93D] hover:bg-white text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition">
                      <Receipt size={18} /> Voir Reçu
                    </button>
                  )
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}