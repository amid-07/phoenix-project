'use client';
import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, CheckCircle, XCircle, MapPin, Receipt, X, AlertTriangle } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- VARIABLES DE DÉBOGAGE (Pour trouver le problème) ---
  const [debugInfo, setDebugInfo] = useState("Initialisation...");
  const [userIdStatus, setUserIdStatus] = useState("Recherche ID...");

  // ⚠️ UTILISEZ NGROK (Https) car le téléphone ne peut pas lire localhost
  // Remplacez par votre lien Ngrok actuel
  const API_URL = "https://tenderhearted-sylas-diligently.ngrok-free.dev";

  useEffect(() => {
    // 1. Vérifier l'ID utilisateur sur le téléphone
    const userId = localStorage.getItem('userId');
    setUserIdStatus(userId ? `Connecté avec ID: ${userId.substring(0, 5)}...` : "❌ AUCUN ID TROUVÉ (Non connecté)");

    if (!userId) {
      setLoading(false);
      return;
    }

    // 2. Lancer la requête
    setDebugInfo(`Appel vers: ${API_URL}...`);

    fetch(`${API_URL}/bookings/patient/${userId}`, {
      headers: { 
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then(async (res) => {
        setDebugInfo(`Statut Serveur: ${res.status}`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const text = await res.text(); // On lit en texte d'abord pour voir si c'est du HTML (erreur Ngrok)
        
        try {
          const data = JSON.parse(text);
          const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setBookings(sorted);
          setDebugInfo(`Succès ! ${data.length} RDV trouvés.`);
        } catch (e) {
          console.error(text);
          setDebugInfo("Erreur: Le serveur a renvoyé du HTML (Probablement la page Ngrok) au lieu du JSON.");
        }
      })
      .catch(err => {
        console.error(err);
        setDebugInfo(`Erreur Fetch: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-[#EAE6DA] min-h-screen pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mes Rendez-vous</h1>
      
      {/* --- ZONE DE DÉBOGAGE (Visible uniquement si problème) --- */}
      <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl mb-6 text-xs font-mono text-white">
        <p className="font-bold text-red-300 mb-2">📟 INFORMATIONS TECHNIQUES :</p>
        <p>1. {userIdStatus}</p>
        <p>2. {debugInfo}</p>
        {userIdStatus.includes("❌") && (
          <p className="mt-2 font-bold text-yellow-300">👉 SOLUTION : Déconnectez-vous et reconnectez-vous SUR LE TÉLÉPHONE.</p>
        )}
      </div>

      {loading && <p className="text-center opacity-50">Chargement des données...</p>}

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => {
          const isRemote = booking.type === 'REMOTE';
          const date = new Date(booking.date);
          const isActive = isSessionActive(booking.date);

          return (
            <div key={booking.id} className="bg-[#59647A] p-5 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-lg w-full">
              
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex shrink-0 items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                    {booking.coach.username.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-bold text-lg leading-tight text-white">{booking.coach.username}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[#EAE6DA]/70 text-sm mt-1">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {date.toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between w-full pt-3 border-t border-white/10">
                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isRemote ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'bg-[#FFD93D]/20 text-[#FFD93D]'}`}>
                    {isRemote ? <><Video size={12}/> Visio</> : <><MapPin size={12}/> Cabinet</>}
                </span>

                {booking.status === 'CONFIRMED' ? (
                  isRemote ? (
                    isActive ? 
                      <button onClick={() => openVideo(booking.id)} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                        <Video size={16}/> Rejoindre
                      </button> 
                      : <span className="text-xs italic opacity-50 border border-white/10 px-2 py-1 rounded">Lien -15min</span>
                  ) : (
                    <button onClick={() => setSelectedTicket(booking)} className="bg-[#FFD93D] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2 items-center text-sm">
                      <Receipt size={16}/> Billet
                    </button>
                  )
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-[#EAE6DA]/50">
                    {booking.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {!loading && bookings.length === 0 && (
           <div className="text-center p-10 border border-dashed border-white/10 rounded-xl">
             <AlertTriangle className="mx-auto mb-2 text-[#EAE6DA]/30" />
             <p className="text-[#EAE6DA]/40">Aucune réservation trouvée.</p>
           </div>
        )}
      </div>

      {/* MODALE TICKET */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white text-[#2F3A4A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">E-BILLET</h3>
                <button onClick={() => setSelectedTicket(null)}><X color="black"/></button>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Expert</p>
                  <p className="font-bold text-lg">{selectedTicket.coach.username}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-bold">{new Date(selectedTicket.date).toLocaleString()}</p>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-sm bg-gray-100 p-2 rounded">{selectedTicket.coach.professionalProfile?.address || "Non renseignée"}</p>
                </div>
                <QRCode value={selectedTicket.id} size={150} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}