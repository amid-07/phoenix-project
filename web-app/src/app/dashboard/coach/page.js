'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, MapPin } from 'lucide-react';

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' ou 'planning'
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  
  // Formulaire
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const resReq = await fetch(`${API_URL}/bookings/coach/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      const dataReq = await resReq.json();
      setRequests(dataReq);

      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      const slotsData = await resSlots.json();
      setMySlots(slotsData);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const addSlot = async () => {
    if (!newSlotDate) return alert("Date requise");
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${API_URL}/marketplace/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning':'true' },
        body: JSON.stringify({ userId, date: newSlotDate, type: sessionType })
      });
      alert("Créneau ajouté !");
      fetchData();
    } catch (e) { alert("Erreur"); }
  };

  const handleAction = async (id, action) => {
    await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning':'true' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  // Logique du bouton vidéo (15min avant / 60min après)
  const isSessionActive = (d) => {
    const diff = (new Date() - new Date(d)) / 60000; // diff en minutes
    // Actif si on est entre -15min avant et +60min après
    return diff > -15 && diff < 60;
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');

  return (
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Briefcase className="text-[#FFD93D]" /> Espace Pro
        </h1>
        {/* Selecteur d'onglets */}
        <div className="flex bg-[#2F3A4A] p-1 rounded-lg border border-white/10">
           <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'requests' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Demandes ({requests.filter(r => r.status === 'PENDING').length})</button>
           <button onClick={() => setActiveTab('planning')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'planning' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Mon Agenda</button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {requests.length === 0 && <p className="text-center text-gray-500 mt-10">Aucune demande.</p>}
          {requests.map((req) => {
            const isActive = isSessionActive(req.date);
            const date = new Date(req.date);
            
            return (
              <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-lg">{req.patient.username.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-lg">{req.patient.username}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-70">
                       <Calendar size={14}/> {date.toLocaleDateString()} 
                       <Clock size={14} className="ml-2"/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                       <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${req.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>{req.type === 'IN_PERSON' ? 'CABINET' : 'VISIO'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold flex gap-2"><Check size={18}/> Accepter</button>
                      <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] px-4 py-2 rounded-lg font-bold"><X size={18}/></button>
                    </>
                  )}
                  {req.status === 'CONFIRMED' && (
                     req.type === 'REMOTE' ? (
                       isActive ? 
                       <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg font-bold flex gap-2 animate-pulse"><Video size={18}/> Lancer</button> 
                       : <span className="text-xs opacity-50 italic">Lien dispo -15min</span>
                     ) : <span className="text-[#FFD93D] font-bold text-sm border border-[#FFD93D] px-3 py-1 rounded-lg">Au Cabinet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Ajouter */}
           <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="font-bold mb-4 flex gap-2"><Plus size={20}/> Ajouter un créneau</h3>
              <input type="datetime-local" className="w-full bg-[#2F3A4A] p-3 rounded-lg text-white mb-4 border border-white/10" onChange={(e) => setNewSlotDate(e.target.value)} />
              <div className="flex gap-2 mb-4">
                 <button onClick={() => setSessionType('REMOTE')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A] border-[#4ECDC4]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Visio</button>
                 <button onClick={() => setSessionType('IN_PERSON')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A] border-[#FFD93D]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Cabinet</button>
              </div>
              <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] font-bold py-3 rounded-lg hover:bg-white transition">Valider</button>
           </div>
           
           {/* Liste */}
           <div className="bg-[#2F3A4A] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 opacity-70">Créneaux ouverts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                 {mySlots.map(slot => (
                   <div key={slot.id} className="flex justify-between p-3 bg-[#59647A] rounded-lg border border-white/5 text-sm">
                      <span>{new Date(slot.date).toLocaleString()}</span>
                      {slot.type === 'IN_PERSON' ? <MapPin size={16} className="text-[#FFD93D]"/> : <Video size={16} className="text-[#4ECDC4]"/>}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}