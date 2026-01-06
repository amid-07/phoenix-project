'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt, X } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ URL (Localhost pour éviter les soucis CORS sur le même réseau)
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`${API_URL}/bookings/patient/${userId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-[#EAE6DA] min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Mes Rendez-vous</h1>
      
      {loading && <p className="text-center opacity-50">Chargement des RDV...</p>}

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isRemote = booking.type === 'REMOTE';
          const date = new Date(booking.date);
          const isActive = isSessionActive(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg w-full">
              
              {/* Infos Gauche */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex shrink-0 items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                    {booking.coach.username.charAt(0)}
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{booking.coach.username}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[#EAE6DA]/70 text-sm mt-1">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {date.toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                 </div>
              </div>

              {/* Actions Droite (Responsive) */}
              <div className="flex items-center justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-0 border-white/10">
                
                {/* Badge Type */}
                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isRemote ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'bg-[#FFD93D]/20 text-[#FFD93D]'}`}>
                    {isRemote ? <><Video size={12}/> Visio</> : <><MapPin size={12}/> Cabinet</>}
                </span>

                {/* Bouton Action */}
                {booking.status === 'CONFIRMED' ? (
                  isRemote ? (
                    isActive ? 
                      <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition text-sm">
                        <Video size={16}/> Rejoindre
                      </button> 
                      : <span className="text-xs italic opacity-50 border border-white/10 px-2 py-1 rounded">Lien -15min</span>
                  ) : (
                    <button onClick={() => setSelectedTicket(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2 items-center hover:bg-white transition text-sm">
                      <Receipt size={16}/> Billet
                    </button>
                  )
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'CANCELLED' ? 'border-[#FF6B6B] text-[#FF6B6B]' : 'border-[#EAE6DA]/40 text-[#EAE6DA]/60'}`}>
                    {booking.status === 'CANCELLED' ? 'Refusé' : 'En attente'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {!loading && bookings.length === 0 && (
           <p className="text-center text-[#EAE6DA]/40 mt-10">Aucun rendez-vous trouvé.</p>
        )}
      </div>

      {/* MODALE TICKET (Responsive) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="bg-white text-[#2F3A4A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="bg-[#2F3A4A] p-4 flex justify-between items-center text-[#EAE6DA]">
              <h2 className="font-bold tracking-widest text-sm">E-BILLET TAFUT</h2>
              <button onClick={() => setSelectedTicket(null)}><X /></button>
            </div>
            <div className="p-6 text-center flex flex-col items-center bg-white">
               <h3 className="text-2xl font-bold mb-1 text-[#2F3A4A]">{selectedTicket.coach.username}</h3>
               <p className="text-gray-500 text-xs mb-4">Psychologue / Coach</p>
               
               <div className="w-full border-t border-dashed border-gray-300 my-2"></div>
               
               <div className="py-2">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Date & Heure</p>
                 <p className="text-lg font-bold text-[#2F3A4A]">{new Date(selectedTicket.date).toLocaleString()}</p>
               </div>

               <div className="mb-4">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Adresse</p>
                 <p className="font-medium text-sm text-[#2F3A4A] px-4">{selectedTicket.coach.professionalProfile?.address || "Adresse non renseignée"}</p>
               </div>

               <div className="p-2 bg-white border-2 border-[#2F3A4A] rounded-xl mb-2">
                 <QRCode value={selectedTicket.id} size={120} />
               </div>
               <p className="text-[10px] text-gray-400">Scannez ce code à l'entrée</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}