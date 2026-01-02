'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, Trash } from 'lucide-react';

export default function CoachDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]); // Liste des créneaux libres
  const [newSlotDate, setNewSlotDate] = useState(''); // Nouvelle date à ajouter
  const [loading, setLoading] = useState(true);

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // 1. Récupérer les RDV (Bookings)
      const resBookings = await fetch(`${API_URL}/bookings/coach/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      const bookingsData = await resBookings.json();
      
      // Tri des RDV
      const sortedBookings = bookingsData.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.date) - new Date(a.date);
      });
      setRequests(sortedBookings);

      // 2. Récupérer les créneaux libres (Availabilities)
      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      const slotsData = await resSlots.json();
      setMySlots(slotsData);

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // --- ACTIONS RDV ---
  const handleAction = async (bookingId, action) => {
    await fetch(`${API_URL}/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  // --- AJOUTER UN CRÉNEAU ---
  const addAvailability = async () => {
    if (!newSlotDate) return alert("Choisissez une date !");
    
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`${API_URL}/marketplace/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date: newSlotDate })
      });

      if (res.ok) {
        alert("Créneau ajouté !");
        setNewSlotDate('');
        fetchData(); // Rafraîchir la liste
      }
    } catch (e) { alert("Erreur ajout"); }
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FFD93D]/10 rounded-xl text-[#FFD93D]"><Briefcase size={32} /></div>
        <div>
          <h1 className="text-3xl font-bold">Espace Professionnel</h1>
          <p className="text-[#EAE6DA]/60">Gérez vos rendez-vous et votre emploi du temps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLONNE GAUCHE : GESTION CALENDRIER === */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Carte Ajout */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar size={20}/> Ajouter une dispo</h2>
            <p className="text-sm text-[#EAE6DA]/60 mb-4">Ouvrez un créneau pour que les patients puissent réserver.</p>
            
            <input 
              type="datetime-local" 
              className="w-full bg-[#2F3A4A] border border-white/10 rounded-xl p-3 text-[#EAE6DA] mb-4 outline-none focus:border-[#4ECDC4]"
              value={newSlotDate}
              onChange={(e) => setNewSlotDate(e.target.value)}
            />
            
            <button onClick={addAvailability} className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#2F3A4A] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <Plus size={20}/> Ajouter au planning
            </button>
          </div>

          {/* Liste des créneaux libres */}
          <div className="bg-[#2F3A4A]/50 p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold mb-4 text-[#EAE6DA]/80">Vos créneaux libres ({mySlots.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {mySlots.map(slot => (
                <div key={slot.id} className="flex justify-between items-center bg-[#59647A] p-3 rounded-lg border border-white/5">
                  <span className="text-sm">
                    {new Date(slot.date).toLocaleDateString()} <span className="text-[#4ECDC4] font-bold">{new Date(slot.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#4ECDC4]"></div>
                </div>
              ))}
              {mySlots.length === 0 && <p className="text-xs text-[#EAE6DA]/40 italic">Aucun créneau ouvert.</p>}
            </div>
          </div>
        </div>

        {/* === COLONNE DROITE : DEMANDES DE RDV === */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20}/> Demandes & Séances</h2>
          
          {loading && <p className="text-[#EAE6DA]/40">Chargement...</p>}

          <div className="space-y-4">
            {requests.map((req) => {
              const isActive = isSessionActive(req.date);
              const date = new Date(req.date);

              return (
                <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg hover:border-white/20 transition">
                  
                  {/* Info Patient */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-xl text-[#EAE6DA] border border-white/10">
                      {req.patient.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#EAE6DA]">{req.patient.username}</h3>
                      <div className="flex items-center gap-2 text-[#EAE6DA]/60 text-sm mt-1">
                        <Calendar size={14} /> {date.toLocaleDateString()} 
                        <Clock size={14} className="ml-1"/> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    {req.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2"><Check size={18}/> Accepter</button>
                        <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] px-4 py-2 rounded-lg font-bold flex gap-2"><X size={18}/> Refuser</button>
                      </div>
                    )}

                    {req.status === 'CONFIRMED' && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[#4ECDC4] text-sm font-bold bg-[#4ECDC4]/10 px-3 py-1 rounded-full border border-[#4ECDC4]/20">Confirmé</span>
                        {isActive ? (
                          <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                            <Video size={18} /> Lancer la séance
                          </button>
                        ) : <span className="text-xs text-[#EAE6DA]/40 italic">Lien dispo 15min avant</span>}
                      </div>
                    )}
                    
                    {req.status === 'CANCELLED' && <span className="text-[#EAE6DA]/30 font-bold text-sm">Refusé</span>}
                  </div>
                </div>
              );
            })}
            
            {!loading && requests.length === 0 && <p className="text-[#EAE6DA]/40 italic text-center py-10">Aucune demande.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}