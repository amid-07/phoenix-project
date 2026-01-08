'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Star, Calendar, Clock, ArrowLeft, CheckCircle, ShieldCheck, MapPin, Video, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Avis
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // ⚠️ URL API
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.id]);

  // --- CORRECTION DU DÉCALAGE DE DATE ---
  // Cette fonction force la date locale (YYYY-MM-DD) sans conversion UTC
  const toLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasSlots = (day) => {
    if (!day) return false;
    const dayKey = toLocalDateKey(day);
    return availabilities.some(slot => toLocalDateKey(new Date(slot.date)) === dayKey);
  };

  const getSlotsForSelectedDay = () => {
    if (!selectedDayObj) return [];
    const dayKey = toLocalDateKey(selectedDayObj);
    return availabilities.filter(slot => toLocalDateKey(new Date(slot.date)) === dayKey);
  };

  // --- RENDU CALENDRIER ---
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
      <div className="grid grid-cols-7 gap-2 text-center mb-6">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[#EAE6DA]/40 text-xs font-bold">{d}</div>)}
        
        {days.map((day, index) => {
          if (!day) return <div key={index}></div>;
          
          // Comparaison avec la clé locale corrigée
          const isSelected = selectedDayObj && toLocalDateKey(day) === toLocalDateKey(selectedDayObj);
          const available = hasSlots(day);
          
          // On compare avec "hier" pour désactiver les jours passés
          const today = new Date();
          today.setHours(0,0,0,0);
          const isPast = day < today;

          return (
            <button
              key={index}
              disabled={isPast}
              onClick={() => { setSelectedDayObj(day); setSelectedSlot(null); }}
              className={`
                relative h-10 rounded-lg flex items-center justify-center font-bold text-sm transition
                ${isSelected ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-[#EAE6DA]'}
                ${!available && !isSelected ? 'opacity-50' : ''}
                ${isPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#4ECDC4]/20'}
              `}
            >
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
    const dateReadable = new Date(selectedSlot.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
    
    if(!confirm(`Confirmer la réservation pour le ${dateReadable} ?`)) return;

    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          patientId: userId,
          coachId: coach.id,
          date: selectedSlot.date,
          availabilityId: selectedSlot.id
        })
      });

      if (res.ok) {
        router.push('/dashboard/bookings');
      } else {
        alert("Erreur lors de la réservation");
      }
    } catch (e) { alert("Erreur réseau"); }
  };

  if (loading || !coach) return <div className="p-10 text-center text-[#EAE6DA]">Chargement...</div>;

  const profile = coach.professionalProfile;
  const daySlots = getSlotsForSelectedDay();

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA] font-sans">
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 hover:text-white transition"><ArrowLeft/> Retour</button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profil */}
        <div className="bg-[#59647A] p-6 rounded-2xl h-fit border border-white/10 shadow-lg">
           <div className="text-center mb-6">
             <div className="w-24 h-24 bg-[#EAE6DA] rounded-full flex items-center justify-center text-4xl font-bold text-[#2F3A4A] mx-auto mb-4">{coach.username.charAt(0).toUpperCase()}</div>
             <h1 className="text-2xl font-bold">{coach.username}</h1>
             <p className="text-[#EAE6DA]/60">{profile.title}</p>
           </div>
           <div className="border-t border-white/10 my-4"></div>
           <div className="flex justify-between text-sm">
             <span>Tarif</span> <span className="text-[#4ECDC4] font-bold">{profile.hourlyRate}€</span>
           </div>
           <div className="flex justify-between text-sm mt-2">
             <span>Avis</span> <span className="text-[#FFD93D] font-bold flex items-center gap-1"><Star size={12} fill="currentColor"/> {profile.rating}</span>
           </div>
        </div>

        {/* Calendrier */}
        <div className="lg:col-span-2 bg-[#59647A] p-6 rounded-2xl border border-white/10 shadow-lg">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-[#4ECDC4]"/> Réserver</h2>
           
           <div className="flex justify-between items-center mb-4 bg-[#2F3A4A] p-3 rounded-lg">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))}><ChevronLeft/></button>
              <span className="font-bold capitalize">{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))}><ChevronRight/></button>
           </div>

           {renderCalendar()}

           {/* Liste des créneaux */}
           <div className="pt-4 border-t border-white/10">
              <h3 className="mb-4 font-bold text-[#EAE6DA]/80 capitalize">
                {selectedDayObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              
              {daySlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {daySlots.map(slot => {
                    const time = new Date(slot.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition ${isSelected ? 'bg-[#4ECDC4] border-[#4ECDC4] text-[#2F3A4A]' : 'border-white/10 hover:border-[#4ECDC4]'}`}
                      >
                        <span className="font-bold">{time}</span>
                        <div className="flex items-center gap-1 text-xs opacity-80">
                          {slot.type === 'IN_PERSON' ? <><MapPin size={10}/> Cabinet</> : <><Video size={10}/> Visio</>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : <p className="text-center italic opacity-50">Aucun créneau ce jour-là.</p>}
           </div>

           <div className="mt-8 flex justify-end">
             <button disabled={!selectedSlot} onClick={handleBooking} className={`px-6 py-3 rounded-xl font-bold ${selectedSlot ? 'bg-[#EAE6DA] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-white/20'}`}>Confirmer</button>
           </div>
        </div>

      </div>
    </div>
  );
}