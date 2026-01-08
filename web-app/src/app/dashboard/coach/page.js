'use client';
import { useEffect, useState } from 'react';
import { Check, X, Calendar, User, Video, Clock, Briefcase, Plus, MapPin, QrCode, Edit, Save, DollarSign, ClipboardList } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner'; // Scanner pour le Web

export default function CoachDashboardPage() {
  // --- ÉTATS DONNÉES ---
  const [requests, setRequests] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS INTERFACE ---
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' ou 'planning'
  const [showScanner, setShowScanner] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Modal Édition Profil

  // --- ÉTATS FORMULAIRES ---
  const [newSlotDate, setNewSlotDate] = useState('');
  const [sessionType, setSessionType] = useState('REMOTE');
  const [manualCode, setManualCode] = useState(''); // Code QR manuel
  
  // Données du profil pour édition
  const [profileData, setProfileData] = useState({ 
    title: '', bio: '', hourlyRate: '', address: '', specialties: [] 
  });

  // ⚠️ URL API (Localhost pour le Web)
  const API_URL = "http://localhost:3000";

  // --- 1. CHARGEMENT DES DONNÉES ---
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // A. Récupérer les demandes de RDV
      // (Pas besoin de headers Ngrok ici car on est en localhost <-> localhost)
      const resReq = await fetch(`${API_URL}/bookings/coach/${userId}`);
      const dataReq = await resReq.json();
      
      // Tri : En attente d'abord, puis par date
      const sorted = dataReq.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.date) - new Date(a.date);
      });
      setRequests(sorted);

      // B. Récupérer les créneaux libres
      const resSlots = await fetch(`${API_URL}/marketplace/availability/${userId}`);
      const slotsData = await resSlots.json();
      setMySlots(slotsData);

      // C. Récupérer le profil pour le formulaire d'édition
      const resProfile = await fetch(`${API_URL}/marketplace/coach/${userId}`);
      const dataProfile = await resProfile.json();
      if (dataProfile.professionalProfile) {
        setProfileData({
          title: dataProfile.professionalProfile.title,
          bio: dataProfile.professionalProfile.bio,
          hourlyRate: dataProfile.professionalProfile.hourlyRate,
          address: dataProfile.professionalProfile.address || '',
          specialties: dataProfile.professionalProfile.specialties || []
        });
      }

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. ACTIONS RÉSERVATIONS ---
  const handleAction = async (bookingId, action) => {
    await fetch(`${API_URL}/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    });
    fetchData();
  };

  const openVideo = (id) => window.open(`https://meet.jit.si/Phoenix_Seance_${id}`, '_blank');

  const isSessionActive = (d) => {
    const diff = (new Date() - new Date(d)) / 60000;
    return diff > -15 && diff < 90; // Visible 15min avant et pendant 1h30
  };

  // --- 3. GESTION CALENDRIER ---
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
    } catch (e) { alert("Erreur ajout"); }
  };

  // --- 4. SCANNER & VALIDATION ---
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
        alert("✅ Séance validée ! Paiement reçu.");
        setShowScanner(false);
        setManualCode('');
        fetchData();
        window.location.reload(); // Pour mettre à jour le compteur d'argent global
      }
    } catch (e) { alert("Erreur réseau"); }
  };

  // --- 5. MISE À JOUR PROFIL ---
  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await fetch(`${API_URL}/marketplace/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, data: profileData })
      });
      alert("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (e) { alert("Erreur sauvegarde"); }
  };

  // --- RENDU ---
  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="text-[#FFD93D]" /> Espace Pro
          </h1>
          <p className="text-[#EAE6DA]/60">Gérez votre activité.</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-[#59647A] hover:bg-[#EAE6DA] hover:text-[#2F3A4A] px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition border border-white/10"
            >
                <Edit size={18} /> Profil
            </button>
            <button 
                onClick={() => setShowScanner(true)}
                className="bg-[#4ECDC4] hover:bg-white text-[#2F3A4A] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105"
            >
                <QrCode size={20} /> Valider Billet
            </button>
        </div>
      </div>
      
      {/* ONGLETS */}
      <div className="flex bg-[#2F3A4A] p-1 rounded-xl border border-white/10 mb-8 w-fit">
         <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'requests' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Demandes</button>
         <button onClick={() => setActiveTab('planning')} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'planning' ? 'bg-[#59647A] text-white shadow' : 'text-gray-400'}`}>Mon Agenda</button>
      </div>

      {/* --- ONGLET 1 : DEMANDES --- */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {requests.map((req) => {
            const isActive = isSessionActive(req.date);
            const date = new Date(req.date);
            return (
              <div key={req.id} className="bg-[#59647A] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2F3A4A] rounded-full flex items-center justify-center font-bold text-lg text-[#EAE6DA]">{req.patient.username.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-lg">{req.patient.username}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#EAE6DA]/70">
                       <Calendar size={14}/> {date.toLocaleDateString()} 
                       <Clock size={14} className="ml-2"/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                       <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${req.type === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A]' : 'bg-[#4ECDC4] text-[#2F3A4A]'}`}>
                         {req.type === 'IN_PERSON' ? 'CABINET' : 'VISIO'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-center mt-4 md:mt-0">
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAction(req.id, 'CONFIRMED')} className="bg-[#4ECDC4] text-[#2F3A4A] px-3 py-2 rounded-lg hover:bg-white transition flex items-center gap-1"><Check size={18}/> Accepter</button>
                      <button onClick={() => handleAction(req.id, 'CANCELLED')} className="bg-[#FF6B6B]/20 text-[#FF6B6B] px-3 py-2 rounded-lg hover:bg-[#FF6B6B]/40 transition flex items-center gap-1"><X size={18}/> Refuser</button>
                    </>
                  )}
                  {req.status === 'CONFIRMED' && (
                     req.type === 'REMOTE' ? (
                       isActive ? 
                       <button onClick={() => openVideo(req.id)} className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg font-bold flex gap-2 animate-pulse"><Video size={18}/> Lancer</button> 
                       : <span className="text-xs opacity-50 italic border border-white/10 px-3 py-2 rounded-lg">Lien dispo -15min</span>
                     ) : (
                        req.status === 'COMPLETED' ? null :
                        <span className="text-[#FFD93D] font-bold text-sm border border-[#FFD93D] px-3 py-2 rounded-lg">Rendez-vous Cabinet</span>
                     )
                  )}
                  {req.status === 'COMPLETED' && (
                     <span className="text-[#4ECDC4] font-bold text-sm bg-[#4ECDC4]/10 border border-[#4ECDC4] px-3 py-2 rounded-lg flex items-center gap-2">
                        <Check size={16}/> Payé & Terminé
                     </span>
                  )}
                  {req.status === 'CANCELLED' && <span className="text-[#EAE6DA]/30 font-bold text-sm">Refusé</span>}
                </div>
              </div>
            );
          })}
          {!loading && requests.length === 0 && <p className="text-center opacity-50 py-10">Aucune demande.</p>}
        </div>

      ) : (
        
        /* --- ONGLET 2 : AGENDA --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Formulaire Ajout */}
           <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="font-bold mb-4 flex gap-2 text-white"><Plus size={20}/> Ajouter un créneau</h3>
              
              <label className="text-xs uppercase font-bold text-[#EAE6DA]/50 mb-1 block">Date & Heure</label>
              <input type="datetime-local" className="w-full bg-[#2F3A4A] p-3 rounded-lg text-white mb-4 border border-white/10 outline-none focus:border-[#4ECDC4]" onChange={(e) => setNewSlotDate(e.target.value)} />
              
              <label className="text-xs uppercase font-bold text-[#EAE6DA]/50 mb-1 block">Type</label>
              <div className="flex gap-2 mb-6">
                 <button onClick={() => setSessionType('REMOTE')} className={`flex-1 py-3 rounded-lg text-sm font-bold border transition ${sessionType === 'REMOTE' ? 'bg-[#4ECDC4] text-[#2F3A4A] border-[#4ECDC4]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Visio</button>
                 <button onClick={() => setSessionType('IN_PERSON')} className={`flex-1 py-3 rounded-lg text-sm font-bold border transition ${sessionType === 'IN_PERSON' ? 'bg-[#FFD93D] text-[#2F3A4A] border-[#FFD93D]' : 'bg-[#2F3A4A] text-gray-400 border-white/10'}`}>Cabinet</button>
              </div>
              
              <button onClick={addSlot} className="w-full bg-[#EAE6DA] text-[#2F3A4A] font-bold py-3 rounded-lg hover:bg-white transition shadow-lg">Valider</button>
           </div>
           
           {/* Liste Slots */}
           <div className="bg-[#2F3A4A] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 opacity-70">Créneaux ouverts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                 {mySlots.map(slot => (
                   <div key={slot.id} className="flex justify-between items-center p-3 bg-[#59647A] rounded-lg border border-white/5 text-sm">
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

            <div className="aspect-square bg-black rounded-xl overflow-hidden mb-6 relative border-2 border-[#4ECDC4]">
              <Scanner 
                onScan={(result) => { if (result && result[0]) handleScanValidation(result[0].rawValue); }}
                components={{ audio: false }}
              />
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="Ou code manuel..." className="flex-1 bg-[#1E1E2E] p-3 rounded-lg text-white border border-white/10 focus:border-[#4ECDC4] outline-none" value={manualCode} onChange={(e) => setManualCode(e.target.value)} />
              <button onClick={() => handleScanValidation(manualCode)} className="bg-[#EAE6DA] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold hover:bg-white">Valider</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALE ÉDITION PROFIL --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#2B2B40] p-8 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-[#EAE6DA]">Modifier mon Profil</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#EAE6DA]/60">Titre</label>
                        <input className="w-full bg-[#59647A] p-3 rounded-lg text-white mt-1 border border-white/5" value={profileData.title} onChange={e => setProfileData({...profileData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#EAE6DA]/60">Tarif Horaire (€)</label>
                        <input type="number" className="w-full bg-[#59647A] p-3 rounded-lg text-white mt-1 border border-white/5" value={profileData.hourlyRate} onChange={e => setProfileData({...profileData, hourlyRate: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#EAE6DA]/60">Adresse Cabinet</label>
                        <input className="w-full bg-[#59647A] p-3 rounded-lg text-white mt-1 border border-white/5" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#EAE6DA]/60">Bio</label>
                        <textarea className="w-full bg-[#59647A] p-3 rounded-lg text-white mt-1 border border-white/5 h-24" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-lg border border-white/10 text-[#EAE6DA] hover:bg-white/5">Annuler</button>
                    <button onClick={handleUpdateProfile} className="flex-1 py-3 rounded-lg bg-[#4ECDC4] text-[#2F3A4A] font-bold hover:bg-white">Sauvegarder</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}