'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt, X, AlertTriangle } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ GARDER NGROK POUR QUE ÇA MARCHE SUR TÉLÉPHONE
  const API_URL = "https://tenderhearted-sylas-diligently.ngrok-free.dev";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/bookings/patient/${userId}`, {
      headers: { 
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Tri par date décroissante (le plus récent en premier)
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
      })
      .catch(err => console.error("Erreur chargement:", err))
      .finally(() => setLoading(false));
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  
  // Le bouton vidéo est actif entre -15min et +90min autour de l'heure du RDV
  const isSessionActive = (d) => { 
    const diff = (new Date() - new Date(d)) / 60000; 
    return diff > -15 && diff < 90; 
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-[#EAE6DA] min-h-screen pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Mes Rendez-vous</h1>
      
      {loading && <div className="text-center opacity-50 py-10">Chargement de vos séances...</div>}

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => {
          const isRemote = booking.type === 'REMOTE';
          const date = new Date(booking.date);
          const isActive = isSessionActive(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg w-full transition hover:border-[#EAE6DA]/30">
              
              {/* Infos Gauche */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex shrink-0 items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                    {booking.coach.username.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight text-white">{booking.coach.username}</h3>
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
                      <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition text-sm animate-pulse">
                        <Video size={16}/> Rejoindre
                      </button> 
                      : <span className="text-xs italic opacity-50 border border-white/10 px-3 py-1 rounded-lg">Lien dispo -15min</span>
                  ) : (
                    <button onClick={() => setSelectedTicket(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2 items-center hover:bg-white transition text-sm shadow-md">
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
           <div className="text-center p-10 border border-dashed border-white/10 rounded-xl bg-[#2F3A4A]/50">
             <AlertTriangle className="mx-auto mb-2 text-[#EAE6DA]/30" />
             <p className="text-[#EAE6DA]/40">Aucune réservation trouvée.</p>
           </div>
        )}
      </div>

      {/* MODALE TICKET (Responsive) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white text-[#2F3A4A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             
             <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
               <X size={24}/>
             </button>

             <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-black tracking-widest text-[#2F3A4A] border-b-2 border-[#2F3A4A] pb-1 mb-4">E-BILLET TAFUT</h3>
                
                <div className="text-center w-full">
                  <p className="text-xs text-gray-400 uppercase font-bold">Expert</p>
                  <p className="font-bold text-lg mb-3">{selectedTicket.coach.username}</p>
                  
                  <p className="text-xs text-gray-400 uppercase font-bold">Date & Heure</p>
                  <p className="font-bold text-lg mb-3 text-[#6C63FF]">{new Date(selectedTicket.date).toLocaleString()}</p>
                  
                  <p className="text-xs text-gray-400 uppercase font-bold">Lieu</p>
                  <div className="bg-gray-100 p-3 rounded-lg mb-6">
                    <p className="font-medium text-sm text-[#2F3A4A]">{selectedTicket.coach.professionalProfile?.address || "Adresse non renseignée"}</p>
                  </div>
                </div>

                <div className="p-2 bg-white border-4 border-[#2F3A4A] rounded-xl mb-2">
                  <QRCode value={selectedTicket.id} size={140} fgColor="#2F3A4A"/>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Veuillez présenter ce code à l'accueil.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}