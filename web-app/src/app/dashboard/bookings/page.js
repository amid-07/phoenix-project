'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt, X, AlertTriangle, CheckCheck } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { setLoading(false); return; }

    fetch(`${API_URL}/bookings/patient/${userId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        // Tri : Futurs en premier
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  
  // Bouton vidéo actif -15min avant et +90min après
  const isSessionActive = (d) => { 
    const diff = (new Date() - new Date(d)) / 60000; 
    return diff > -15 && diff < 90; 
  };

  // Gestion des couleurs de statut
  const getStatusInfo = (status) => {
    switch(status) {
      case 'CONFIRMED': return { color: '#4ECDC4', text: 'Confirmé', icon: CheckCircle };
      case 'COMPLETED': return { color: '#4ECDC4', text: 'Terminé / Payé', icon: CheckCheck }; // <--- NOUVEAU
      case 'CANCELLED': return { color: '#FF6B6B', text: 'Refusé', icon: XCircle };
      default: return { color: '#FFD93D', text: 'En attente', icon: Clock };
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-[#EAE6DA] min-h-screen pb-24">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mes Rendez-vous</h1>
      
      {loading && <div className="text-center opacity-50 py-10">Chargement...</div>}

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => {
          const isRemote = booking.type === 'REMOTE';
          const date = new Date(booking.date);
          const isActive = isSessionActive(booking.date);
          const statusInfo = getStatusInfo(booking.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={booking.id} className="bg-[#59647A] p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-lg w-full">
              
              {/* Infos Gauche */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex shrink-0 items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                    {booking.coach.username.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1 min-w-0"> {/* min-w-0 aide sur mobile */}
                    <h3 className="font-bold text-lg text-white truncate">{booking.coach.username}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[#EAE6DA]/70 text-sm mt-1">
                      {/* CORRECTION DATE : Utilisation detoLocaleString pour éviter le décalage */}
                      <span className="flex items-center gap-1"><Calendar size={14}/> {date.toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                 </div>
              </div>

              {/* Actions Droite */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-white/10">
                
                {/* Badge Type */}
                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isRemote ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'bg-[#FFD93D]/20 text-[#FFD93D]'}`}>
                    {isRemote ? <><Video size={12}/> Visio</> : <><MapPin size={12}/> Cabinet</>}
                </span>

                {/* Badge Statut & Boutons */}
                {booking.status === 'CONFIRMED' ? (
                  isRemote ? (
                    isActive ? 
                      <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition text-sm animate-pulse w-full sm:w-auto justify-center">
                        <Video size={16}/> Rejoindre
                      </button> 
                      : <span className="text-xs italic opacity-50 border border-white/10 px-3 py-1 rounded-lg">Lien dispo -15min</span>
                  ) : (
                    <button onClick={() => setSelectedTicket(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2 items-center hover:bg-white transition text-sm w-full sm:w-auto justify-center">
                      <Receipt size={16}/> Billet
                    </button>
                  )
                ) : (
                  // Affiche En attente, Refusé ou PAYÉ
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 w-full sm:w-auto justify-center" style={{backgroundColor: statusInfo.color + '20', color: statusInfo.color, border: `1px solid ${statusInfo.color}40`}}>
                    <StatusIcon size={14} /> {statusInfo.text}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {!loading && bookings.length === 0 && (
           <p className="text-center text-[#EAE6DA]/40 mt-10">Aucune réservation.</p>
        )}
      </div>

      {/* MODALE TICKET */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white text-[#2F3A4A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
             <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24}/></button>
             <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-black tracking-widest text-[#2F3A4A] border-b-2 border-[#2F3A4A] pb-1 mb-4">E-BILLET TAFUT</h3>
                <p className="text-xs text-gray-400 uppercase font-bold">Expert</p>
                <p className="font-bold text-lg mb-3">{selectedTicket.coach.username}</p>
                
                <p className="text-xs text-gray-400 uppercase font-bold">Date</p>
                <p className="font-bold text-lg mb-3 text-[#6C63FF]">{new Date(selectedTicket.date).toLocaleString()}</p>
                
                <div className="p-2 bg-white border-4 border-[#2F3A4A] rounded-xl mb-2">
                  <QRCode value={selectedTicket.id} size={140} fgColor="#2F3A4A"/>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Code ID: {selectedTicket.id.split('-')[0]}...</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}