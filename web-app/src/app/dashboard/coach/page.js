'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, MapPin, QrCode, DollarSign, ClipboardList } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner'; // Import du scanner web

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour le formulaire
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE');
  
  // États pour le SCAN
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
      const sorted = dataReq.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRequests(sorted);

      // 2. Créneaux
      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`, {headers: {'ngrok-skip-browser-warning':'true'}});
      setMySlots(await resSlots.json());

      // Note: Pour mettre à jour l'argent affiché dans le header global, il faudrait idéalement utiliser un Context ou recharger la page, 
      // mais ici nous gérons les données de la page courante.

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIQUE SCAN & VALIDATION ---
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

      if (result.error) {
        alert("Erreur : " + result.error);
      } else {
        alert("✅ Séance validée ! Le montant a été ajouté à votre portefeuille.");
        setShowScanner(false); // Fermer le scanner
        setManualCode('');
        fetchData(); // Rafraîchir les données
        // Astuce : Recharger la page pour mettre à jour le compteur d'argent dans la Sidebar/Header
        window.location.reload(); 
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };

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

  const handleAction = async (id, action) => {
    await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');
  const isSessionActive = (d) => {
    const diff = (new Date() - new Date(d)) / 60000;
    return diff > -15 && diff < 90;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Briefcase className="text-[#FFD93D]" /> Espace Pro
        </h1>
        
        {/* BOUTON SCANNER */}
        <button 
          onClick={() => setShowScanner(true)}
          className="bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105"
        >
          <QrCode size={20} /> Valider une séance
        </button>
      </div>
      
      {/* ONGLETS */}
      <div className="flex bg-[#2F3A4A] p-1 rounded-lg border border-white/10 mb-8 w-fit">
         <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-md font-bold transition ${activeTab === 'requests' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Demandes</button>
         <button onClick={() => setActiveTab('planning')} className={`px-4 py-2 rounded-md font-bold transition ${activeTab === 'planning' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Mon Agenda</button>
      </div>

      {/* CONTENU ONGLETS */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
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
                <div className="flex gap-3 items-center">
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] p-2 rounded-lg hover:bg-white transition"><Check/></button>
                      <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] p-2 rounded-lg hover:bg-[#FF6B6B]/40 transition"><X/></button>
                    </>
                  )}
                  {req.status === 'CONFIRMED' && (
                     req.type === 'REMOTE' ? (
                       isActive ? <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg font-bold flex gap-2 animate-pulse"><Video size={18}/> Lancer</button> : <span className="text-xs opacity-50 italic">Lien dispo -15min</span>
                     ) : (
                       req.status === 'COMPLETED' ? 
                       <span className="text-[#4ECDC4] font-bold text-sm border border-[#4ECDC4] px-3 py-1 rounded-lg">Payé ✅</span> :
                       <span className="text-[#FFD93D] font-bold text-sm border border-[#FFD93D] px-3 py-1 rounded-lg">Au Cabinet</span>
                     )
                  )}
                  {req.status === 'COMPLETED' && req.type === 'REMOTE' && <span className="text-[#4ECDC4] font-bold text-sm">Terminé</span>}
                </div>
              </div>
            );
          })}
          {requests.length === 0 && <p className="text-center opacity-50">Aucune demande.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="font-bold mb-4 flex gap-2"><Plus size={20}/> Ajouter un créneau</h3>
              <input type="datetime-local" className="w-full bg-[#2F3A4A] p-3 rounded-lg text-white mb-4 border border-white/10" onChange={(e) => setNewSlotDate(e.target.value)} />
              <div className="flex gap-2 mb-4">
                 <button onClick={() => setSessionType('REMOTE')} className={`flex-1 py-2 rounded-lg font-bold border ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A] border-[#4ECDC4]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Visio</button>
                 <button onClick={() => setSessionType('IN_PERSON')} className={`flex-1 py-2 rounded-lg font-bold border ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A] border-[#FFD93D]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Cabinet</button>
              </div>
              <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] font-bold py-3 rounded-lg hover:bg-white transition">Valider</button>
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
              </div>
           </div>
        </div>
      )}

      {/* --- MODALE SCANNER (POPUP) --- */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowScanner(false)}>
          <div className="bg-[#2B2B40] p-6 rounded-2xl w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Valider une séance</h2>
              <button onClick={() => setShowScanner(false)}><X/></button>
            </div>

            {/* Zone Caméra */}
            <div className="aspect-square bg-black rounded-xl overflow-hidden mb-4 relative border-2 border-[#4ECDC4]">
              <Scanner 
                onScan={(result) => {
                  if (result && result[0]) handleScanValidation(result[0].rawValue);
                }}
                components={{ audio: false }} // Désactive le son pour éviter les bugs
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/50 rounded-lg"></div>
              </div>
            </div>

            {/* Saisie Manuelle (Secours) */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-gray-400 mb-2 text-center">Ou entrez le code manuellement :</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Code ID du RDV..." 
                  className="flex-1 bg-[#1E1E2E] p-3 rounded-lg text-white border border-white/10 focus:border-[#4ECDC4] outline-none"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <button 
                  onClick={() => handleScanValidation(manualCode)}
                  className="bg-[#EAE6DA] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold hover:bg-white"
                >
                  Valider
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}