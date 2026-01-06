'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, MapPin, Plus, Save } from 'lucide-react';

export default function CoachDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nouveaux états
  const [address, setAddress] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE'); // 'REMOTE' ou 'IN_PERSON'

  // ⚠️ LOCALHOST
  const API_URL = "http://localhost:3000";

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      // 1. Demandes
      const resReq = await fetch(`${API_URL}/bookings/coach/${userId}`);
      const dataReq = await resReq.json();
      const sorted = dataReq.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.date) - new Date(a.date);
      });
      setRequests(sorted);

      // 2. Créneaux libres
      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`);
      const dataSlots = await resSlots.json();
      setMySlots(dataSlots);

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Sauvegarder l'adresse
  const saveAddress = async () => {
    const userId = localStorage.getItem('userId');
    await fetch(`${API_URL}/marketplace/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    alert("Adresse enregistrée !");
  };

  // Ajouter un créneau avec Type
  const addSlot = async () => {
    if (!newSlotDate) return alert("Date requise");
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${API_URL}/marketplace/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date: newSlotDate, type: sessionType })
      });
      alert("Créneau ajouté !");
      fetchData();
    } catch (e) { alert("Erreur"); }
  };

  const handleAction = async (bookingId, action) => {
    await fetch(`${API_URL}/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Briefcase className="text-[#FFD93D]" /> Espace Professionnel
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : GESTION --- */}
        <div className="space-y-6">
          
          {/* Carte Adresse */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="font-bold mb-4 flex items-center gap-2"><MapPin size={20}/> Adresse Cabinet</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ex: 10 Rue de la Paix..." 
                className="flex-1 bg-[#2F3A4A] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#4ECDC4]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button onClick={saveAddress} className="bg-[#4ECDC4] p-2 rounded-lg text-[#2F3A4A] hover:bg-white transition"><Save size={18}/></button>
            </div>
          </div>

          {/* Carte Ajout Créneau */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Calendar size={20}/> Ajouter Dispo</h2>
            
            <label className="text-xs text-[#EAE6DA]/60 uppercase font-bold">Date & Heure</label>
            <input 
              type="datetime-local" 
              className="w-full bg-[#2F3A4A] border border-white/10 rounded-lg p-2 text-white mb-4 mt-1"
              onChange={(e) => setNewSlotDate(e.target.value)}
            />

            <label className="text-xs text-[#EAE6DA]/60 uppercase font-bold">Type de séance</label>
            <div className="flex gap-2 mt-1 mb-4">
              <button 
                onClick={() => setSessionType('REMOTE')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-gray-400'}`}
              >
                <Video size={14}/> Visio
              </button>
              <button 
                onClick={() => setSessionType('IN_PERSON')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-gray-400'}`}
              >
                <MapPin size={14}/> Cabinet
              </button>
            </div>

            <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] py-2 rounded-lg font-bold hover:bg-white transition flex items-center justify-center gap-2">
              <Plus size={18}/> Ajouter
            </button>
          </div>

          {/* Liste Créneaux */}
          <div className="bg-[#2F3A4A]/50 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold mb-3 text-[#EAE6DA]/60">Vos créneaux ouverts</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mySlots.map(slot => (
                <div key={slot.id} className="flex justify-between items-center text-sm bg-[#59647A] p-2 rounded border border-white/5">
                  <span>{new Date(slot.date).toLocaleDateString()} à {new Date(slot.date).getHours()}h</span>
                  {slot.type === 'IN_PERSON' ? <MapPin size={14} className="text-[#FFD93D]"/> : <Video size={14} className="text-[#4ECDC4]"/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : DEMANDES --- */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Demandes de rendez-vous</h2>
          
          {requests.map((req) => (
            <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-[#EAE6DA] text-xl">
                  {req.patient.username.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{req.patient.username}</h3>
                  <div className="flex items-center gap-3 text-sm text-[#EAE6DA]/70">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(req.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(req.date).getHours()}h00</span>
                    {/* Badge Type */}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${req.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>
                      {req.type === 'IN_PERSON' ? <><MapPin size={10}/> Cabinet</> : <><Video size={10}/> Visio</>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {req.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] p-2 rounded-lg"><Check size={20}/></button>
                    <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/40 p-2 rounded-lg"><X size={20}/></button>
                  </>
                )}
                {req.status === 'CONFIRMED' && (
                  req.type === 'REMOTE' ? (
                    <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-4 py-2 rounded-lg font-bold text-sm flex gap-2">
                      <Video size={16}/> Lancer
                    </button>
                  ) : <span className="text-[#FFD93D] font-bold text-sm">Au Cabinet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}