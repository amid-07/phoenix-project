'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, MapPin, Trash } from 'lucide-react';

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState('requests'); 
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const resReq = await fetch(`${API_URL}/bookings/coach/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      setRequests(await resReq.json());

      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      setMySlots(await resSlots.json());
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

  return (
    <div className="p-8 max-w-5xl mx-auto text-[#EAE6DA]">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Briefcase className="text-[#FFD93D]" /> Espace Pro</h1>
      
      <div className="flex bg-[#2F3A4A] p-1 rounded-lg border border-white/10 mb-8 w-fit">
         <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'requests' ? 'bg-[#59647A] text-white' : 'text-gray-400'}`}>Demandes</button>
         <button onClick={() => setActiveTab('planning')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'planning' ? 'bg-[#59647A] text-white' : 'text-gray-400'}`}>Mon Agenda</button>
      </div>

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex justify-between items-center shadow-lg">
               <div>
                  <h3 className="font-bold text-lg">{req.patient.username}</h3>
                  <p className="text-sm opacity-60">{new Date(req.date).toLocaleString()} • {req.type === 'IN_PERSON' ? 'Cabinet' : 'Visio'}</p>
               </div>
               {req.status === 'PENDING' && (
                 <div className="flex gap-2">
                   <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] p-2 rounded-lg"><Check/></button>
                   <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] p-2 rounded-lg"><X/></button>
                 </div>
               )}
            </div>
          ))}
          {requests.length === 0 && <p className="text-center opacity-50">Aucune demande.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="font-bold mb-4 flex gap-2"><Plus size={20}/> Ajouter un créneau</h3>
              <input type="datetime-local" className="w-full bg-[#2F3A4A] p-3 rounded-lg text-white mb-4 border border-white/10" onChange={(e) => setNewSlotDate(e.target.value)} />
              <div className="flex gap-2 mb-4">
                 <button onClick={() => setSessionType('REMOTE')} className={`flex-1 py-2 rounded-lg font-bold border ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'border-white/10'}`}>Visio</button>
                 <button onClick={() => setSessionType('IN_PERSON')} className={`flex-1 py-2 rounded-lg font-bold border ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'border-white/10'}`}>Cabinet</button>
              </div>
              <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] font-bold py-3 rounded-lg">Valider</button>
           </div>
           
           <div className="bg-[#2F3A4A] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 opacity-70">Créneaux ouverts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                 {mySlots.map(slot => (
                   <div key={slot.id} className="flex justify-between p-3 bg-[#59647A] rounded-lg border border-white/5 text-sm">
                      <span>{new Date(slot.date).toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${slot.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>{slot.type === 'IN_PERSON' ? 'Cabinet' : 'Visio'}</span>
                   </div>
                 ))}
                 {mySlots.length === 0 && <p className="opacity-40 italic text-sm">Aucun créneau.</p>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}