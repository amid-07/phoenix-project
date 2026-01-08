'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Star, Calendar, Clock, ArrowLeft, CheckCircle, ShieldCheck, MapPin, Video, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export default function CoachDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendrier
  const [availabilities, setAvailabilities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayObj, setSelectedDayObj] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/marketplace/coach/${params.id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        setCoach(data);
        if (data.professionalProfile?.availabilities) {
          setAvailabilities(data.professionalProfile.availabilities);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchDetails();
  }, [params.id]);

  // Fonctions date (ToLocaleDateKey)
  const toLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasSlots = (day) => {
    if (!day) return false;
    return availabilities.some(slot => toLocalDateKey(new Date(slot.date)) === toLocalDateKey(day));
  };

  const getSlotsForSelectedDay = () => {
    if (!selectedDayObj) return [];
    return availabilities.filter(slot => toLocalDateKey(new Date(slot.date)) === toLocalDateKey(selectedDayObj));
  };

  // Rendu Calendrier
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-6">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[#EAE6DA]/40 text-xs font-bold">{d}</div>)}
        {days.map((day, index) => {
          if (!day) return <div key={index}></div>;
          const isSelected = selectedDayObj && toLocalDateKey(day) === toLocalDateKey(selectedDayObj);
          const available = hasSlots(day);
          const isPast = day < new Date().setHours(0,0,0,0);

          return (
            <button key={index} disabled={isPast} onClick={() => { setSelectedDayObj(day); setSelectedSlot(null); }}
              className={`relative h-10 rounded-lg flex items-center justify-center font-bold text-sm transition ${isSelected ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-[#EAE6DA]'} ${!available && !isSelected ? 'opacity-40' : ''} ${isPast ? 'opacity-10' : 'hover:bg-[#4ECDC4]/20'}`}>
              {day.getDate()}
              {available && !isSelected && !isPast && <span className="absolute bottom-1 w-1 h-1 bg-[#4ECDC4] rounded-full"></span>}
            </button>
          );
        })}
      </div>
    );
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    if(!confirm(`Confirmer la réservation ?`)) return;
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ patientId: userId, coachId: coach.id, date: selectedSlot.date, availabilityId: selectedSlot.id })
      });
      if (res.ok) router.push('/dashboard/bookings');
      else alert("Erreur réservation");
    } catch (e) { alert("Erreur réseau"); }
  };

  if (loading || !coach) return <div className="p-10 text-center text-[#EAE6DA]">Chargement...</div>;

  const profile = coach.professionalProfile;
  const daySlots = getSlotsForSelectedDay();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-[#EAE6DA] font-sans pb-24">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 hover:text-white transition group text-sm font-bold">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" /> Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : INFO COACH --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Carte Profil */}
          <div className="bg-[#59647A] rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#EAE6DA] rounded-full flex items-center justify-center text-4xl font-bold text-[#2F3A4A] mx-auto mb-4 shadow-lg border-4 border-[#2F3A4A]">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold flex items-center gap-2 text-[#EAE6DA]">
                {coach.username} <ShieldCheck size={18} className="text-[#4ECDC4]" />
              </h1>
              <p className="text-[#EAE6DA]/60 font-medium text-sm">{profile.title}</p>
            </div>
            
            <div className="my-6 border-t border-white/10"></div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#EAE6DA]/60">Tarif</span>
                <span className="text-lg font-bold text-[#4ECDC4]">{profile.hourlyRate}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EAE6DA]/60">Avis</span>
                <span className="flex items-center gap-1 text-[#FFD93D] font-bold"><Star size={14} fill="currentColor"/> {profile.rating}</span>
              </div>
              {/* Adresse */}
              {profile.address && (
                 <div className="mt-4 bg-[#2F3A4A] p-3 rounded-lg flex items-start gap-3">
                    <MapPin size={16} className="text-[#FF6B6B] mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[#EAE6DA]/50 text-xs font-bold uppercase mb-1">Cabinet</p>
                        <p className="text-white text-xs leading-relaxed">{profile.address}</p>
                    </div>
                 </div>
              )}
            </div>
          </div>

          {/* Carte Bio */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
             <h3 className="font-bold mb-3 text-[#EAE6DA]">À propos</h3>
             <p className="text-[#EAE6DA]/80 text-sm leading-relaxed">{profile.bio}</p>
          </div>

        </div>

        {/* --- COLONNE DROITE : CALENDRIER & AVIS --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Calendrier */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Calendar className="text-[#4ECDC4]"/> Réserver une séance</h2>
             
             {/* Navigation Mois */}
             <div className="flex justify-between items-center mb-4 bg-[#2F3A4A] p-2 rounded-lg">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-2 hover:bg-[#59647A] rounded"><ChevronLeft size={20}/></button>
                <span className="font-bold capitalize text-sm">{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-2 hover:bg-[#59647A] rounded"><ChevronRight size={20}/></button>
             </div>

             {renderCalendar()}

             {/* Créneaux */}
             <div className="pt-4 border-t border-white/10">
                <h3 className="mb-4 font-bold text-[#EAE6DA]/80 text-sm capitalize">
                  {selectedDayObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                
                {daySlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {daySlots.map(slot => {
                      const time = new Date(slot.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)} className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition ${isSelected ? 'bg-[#4ECDC4] border-[#4ECDC4] text-[#2F3A4A]' : 'border-white/10 hover:border-[#4ECDC4] bg-[#2F3A4A]'}`}>
                          <span className="font-bold text-sm">{time}</span>
                          <div className="flex items-center gap-1 text-[10px] opacity-80 font-bold uppercase">
                            {slot.type === 'IN_PERSON' ? <><MapPin size={10}/> Cabinet</> : <><Video size={10}/> Visio</>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : <p className="text-center italic opacity-50 text-sm">Aucun créneau.</p>}
             </div>

             <div className="mt-8 flex justify-end">
               <button disabled={!selectedSlot} onClick={handleBooking} className={`px-8 py-3 rounded-xl font-bold transition shadow-lg ${selectedSlot ? 'bg-[#EAE6DA] text-[#2F3A4A] hover:bg-white' : 'bg-[#2F3A4A] text-white/20 cursor-not-allowed'}`}>
                 Confirmer
               </button>
             </div>
          </div>

          {/* Section Avis */}
          <div className="bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><MessageSquare className="text-[#FFD93D]"/> Avis Clients</h2>
             <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {profile.reviews.length > 0 ? profile.reviews.map(review => (
                   <div key={review.id} className="bg-[#2F3A4A] p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-sm text-[#EAE6DA]">{review.author.username}</span>
                         <div className="flex text-[#FFD93D]">{[...Array(review.rating)].map((_,i)=><Star key={i} size={10} fill="currentColor"/>)}</div>
                      </div>
                      <p className="text-[#EAE6DA]/70 text-sm italic">"{review.comment}"</p>
                   </div>
                )) : <p className="text-center opacity-50 italic text-sm">Aucun avis pour le moment.</p>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}