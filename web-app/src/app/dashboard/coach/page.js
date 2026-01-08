'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, MapPin, QrCode, DollarSign, ClipboardList, CheckCheck } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE');
  
  // Scanner
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // 1. Demandes
      const resReq = await fetch(`${API_URL}/bookings/coach/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      const dataReq = await resReq.json();
      
      const sorted = dataReq.sort((a, b) => {
        // Tri : PENDING > CONFIRMED > COMPLETED
        const statusOrder = { 'PENDING': 1, 'CONFIRMED': 2, 'COMPLETED': 3, 'CANCELLED': 4 };
        if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
        return new Date(b.date) - new Date(a.date);
      });
      setRequests(sorted);

      // 2. Créneaux
      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      setMySlots(await resSlots.json());

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- CORRECTION DATE SHIFT ---
  const addSlot = async () => {
    if (!newSlotDate) return alert("Date requise");
    try {
      const userId = localStorage.getItem('userId');
      
      // On crée la date directement depuis la valeur de l'input local
      // Le navigateur gère le fuseau horaire ici
      const dateObj = new Date(newSlotDate);

      await fetch(`${API_URL}/marketplace/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          date: dateObj.toISOString(), // On envoie en format ISO standard
          type: sessionType 
        })
      });
      alert("Créneau ajouté !");
      setNewSlotDate('');
      fetchData();
    } catch (e) { alert("Erreur"); }
  };

  const handleAction = async (id, action) => {
    await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  // --- SCAN ---
  const handleScanValidation = async (bookingId) => {
    if (!bookingId) return;
    try {
      const coachId = localStorage.getItem('userId');
      const response = await fetch(`${API_URL}/bookings/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, coachId })
      });
      const result = await response.json();

      if (result.error) alert("Erreur : " + result.error);
      else {
        alert("✅ Validé ! Paiement reçu.");
        setShowScanner(false);
        setManualCode('');
        fetchData();
        window.location.reload(); 
      }
    } catch (e) { alert("Erreur réseau"); }
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  const isSessionActive = (d) => { const diff = (new Date() - new Date(d)) / 60000; return diff > -15 && diff < 90; };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Briefcase className="text-[#FFD93D]" /> Espace Pro</h1>
        </div>
        <button onClick={() => setShowScanner(true)} className="w-full md:w-auto bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg transition">
          <QrCode size={20} /> Valider Billet
        </button>
      </div>
      
      <div className="flex bg-[#2F3A4A] p-1 rounded-xl border border-white/10 mb-8 w-full md:w-fit overflow-hidden">
         <button onClick={() => setActiveTab('requests')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold transition ${activeTab === 'requests' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Demandes</button>
         <button onClick={() => setActiveTab('planning')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold transition ${activeTab === 'planning' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Mon Agenda</button>
      </div>

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {requests.map((req) => {
            const isActive = isSessionActive(req.date);
            const date = new Date(req.date);
            return (
              <div key={req.id} className="bg-[#59647A] p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex shrink-0 items-center justify-center font-bold text-lg text-[#EAE6DA]">{req.patient.username.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-lg text-[#EAE6DA]">{req.patient.username}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#EAE6DA]/70">
                       {/* CORRECTION DATE AFFICHAGE */}
                       <span className="flex items-center gap-1"><Calendar size={14}/> {date.toLocaleDateString()}</span> 
                       <span className="flex items-center gap-1"><Clock size={14}/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${req.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>
                         {req.type === 'IN_PERSON' ? 'CABINET' : 'VISIO'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto justify-end">
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] p-2 rounded-lg hover:bg-white flex-1 md:flex-none justify-center flex"><Check/></button>
                      <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] p-2 rounded-lg hover:bg-[#FF6B6B]/40 flex-1 md:flex-none justify-center flex"><X/></button>
                    </>
                  )}
                  {req.status === 'CONFIRMED' && (
                     req.type === 'REMOTE' ? (
                       isActive ? <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg font-bold flex gap-2 animate-pulse w-full md:w-auto justify-center"><Video size={18}/> Lancer</button> : <span className="text-xs opacity-50 italic border border-white/10 px-3 py-2 rounded-lg">Lien dispo -15min</span>
                     ) : <span className="text-[#FFD93D] font-bold text-sm border border-[#FFD93D] px-3 py-1 rounded-lg">Au Cabinet</span>
                  )}
                  {/* STATUT TERMINÉ CORRIGÉ */}
                  {req.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 px-3 py-1 rounded-lg">
                      <CheckCheck size={16} className="text-[#4ECDC4]" />
                      <span className="text-[#4ECDC4] font-bold text-sm">Payé & Terminé</span>
                    </div>
                  )}
                  {req.status === 'CANCELLED' && <span className="text-[#EAE6DA]/30 font-bold text-sm">Refusé</span>}
                </div>
              </div>
            );
          })}
          {requests.length === 0 && <p className="text-center opacity-50 py-10">Aucune demande.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Formulaire Ajout (Avec Correction Date) */}
           <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="font-bold mb-4 flex gap-2"><Plus size={20}/> Ajouter un créneau</h3>
              <input type="datetime-local" className="w-full bg-[#2F3A4A] p-3 rounded-lg text-[#EAE6DA] mb-4 border border-white/10" onChange={(e) => setNewSlotDate(e.target.value)} />
              {/* ... (Boutons Visio/Cabinet identiques) ... */}
              <div className="flex gap-2 mb-6">
                 <button onClick={() => setSessionType('REMOTE')} className={`flex-1 py-3 rounded-lg text-sm font-bold border transition ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A] border-[#4ECDC4]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Visio</button>
                 <button onClick={() => setSessionType('IN_PERSON')} className={`flex-1 py-3 rounded-lg text-sm font-bold border transition ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A] border-[#FFD93D]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Cabinet</button>
              </div>
              <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] font-bold py-3 rounded-lg hover:bg-white transition shadow-lg">Valider</button>
           </div>
           
           <div className="bg-[#2F3A4A] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 opacity-70">Créneaux ouverts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                 {mySlots.map(slot => (
                   <div key={slot.id} className="flex justify-between p-3 bg-[#59647A] rounded-lg border border-white/5 text-sm">
                      {/* Affichage Date Corrigé */}
                      <span>{new Date(slot.date).toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${slot.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>{slot.type === 'IN_PERSON' ? 'Cabinet' : 'Visio'}</span>
                   </div>
                 ))}
                 {mySlots.length === 0 && <p className="text-center opacity-30 italic">Aucun créneau ouvert.</p>}
              </div>
           </div>
        </div>
      )}

      {/* --- MODALE SCANNER --- */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowScanner(false)}>
          <div className="bg-[#2B2B40] p-6 rounded-2xl w-full max-w-md border border-white/10 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white"><X/></button>
            <h2 className="text-xl font-bold text-white mb-6 text-center">Valider un billet</h2>
            
            {/* Zone Caméra Web */}
            <div className="aspect-square bg-black rounded-xl overflow-hidden mb-6 relative border-2 border-[#4ECDC4]">
              <Scanner 
                onScan={(result) => { if (result && result[0]) handleScanValidation(result[0].rawValue); }}
                components={{ audio: false }}
              />
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="Code ID..." className="flex-1 bg-[#1E1E2E] p-3 rounded-lg text-white border border-white/10 focus:border-[#4ECDC4] outline-none" value={manualCode} onChange={(e) => setManualCode(e.target.value)} />
              <button onClick={() => handleScanValidation(manualCode)} className="bg-[#EAE6DA] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold hover:bg-white">Valider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}