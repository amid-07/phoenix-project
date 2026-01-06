'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt, X } from 'lucide-react';
import QRCode from 'react-qr-code'; // <--- IMPORT DU QR CODE WEB

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // Pour la modale
  
  // ⚠️ LOCALHOST
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`${API_URL}/bookings/patient/${userId}`)
      .then(res => res.json())
      .then(data => setBookings(data.sort((a, b) => new Date(b.date) - new Date(a.date))));
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA]">
      <h1 className="text-3xl font-bold mb-8">Mes Rendez-vous</h1>
      
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isRemote = booking.type === 'REMOTE';
          const date = new Date(booking.date);
          const isActive = isSessionActive(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl">{booking.coach.username.charAt(0)}</div>
                 <div>
                    <h3 className="font-bold text-lg">{booking.coach.username}</h3>
                    <p className="text-sm opacity-70">{date.toLocaleDateString()} - {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                 </div>
              </div>

              {booking.status === 'CONFIRMED' && (
                isRemote ? (
                  isActive ? <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2"><Video size={18}/> Visio</button> 
                  : <span className="text-xs italic opacity-50">Lien bientôt</span>
                ) : (
                  <button onClick={() => setSelectedTicket(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2 items-center hover:bg-white transition">
                    <Receipt size={18}/> Billet QR
                  </button>
                )
              )}
              {booking.status !== 'CONFIRMED' && <span className="opacity-50 font-bold">{booking.status}</span>}
            </div>
          );
        })}
      </div>

      {/* --- MODALE TICKET WEB --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white text-[#2F3A4A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-[#2F3A4A] p-4 flex justify-between items-center text-[#EAE6DA]">
              <h2 className="font-bold tracking-widest">E-BILLET TAFUT</h2>
              <button onClick={() => setSelectedTicket(null)}><X /></button>
            </div>
            <div className="p-8 text-center flex flex-col items-center">
               <h3 className="text-2xl font-bold mb-1">{selectedTicket.coach.username}</h3>
               <p className="text-gray-500 text-sm mb-6">Psychologue / Coach</p>
               
               <div className="w-full border-t border-dashed border-gray-300 my-2"></div>
               
               <div className="py-4">
                 <p className="text-xs text-gray-400 font-bold uppercase">Date & Heure</p>
                 <p className="text-lg font-bold">{new Date(selectedTicket.date).toLocaleString()}</p>
               </div>

               <div className="mb-6">
                 <p className="text-xs text-gray-400 font-bold uppercase">Adresse</p>
                 <p className="font-medium">{selectedTicket.coach.professionalProfile?.address || "Adresse non renseignée"}</p>
               </div>

               <div className="p-2 bg-white border-2 border-[#2F3A4A] rounded-xl">
                 <QRCode value={selectedTicket.id} size={150} />
               </div>
               <p className="text-xs text-gray-400 mt-4">Scannez ce code à l'entrée du cabinet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}