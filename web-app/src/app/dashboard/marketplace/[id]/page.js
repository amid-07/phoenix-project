'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Star, Calendar, Clock, ArrowLeft, CheckCircle, ShieldCheck, Video, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // --- CALENDRIER ---
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Dimanche
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Lundi = 0

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null); // Cases vides
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const hasSlots = (dateObj) => {
    if (!dateObj) return false;
    const dateStr = dateObj.toISOString().split('T')[0];
    return availabilities.some(slot => slot.date.startsWith(dateStr));
  };

  const getSlotsForSelectedDay = () => {
    if (!selectedDayObj) return [];
    const dateStr = selectedDayObj.toISOString().split('T')[0];
    return availabilities.filter(slot => slot.date.startsWith(dateStr));
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

      if (res.ok) router.push('/dashboard/bookings');
      else alert("Erreur réservation");
    } catch (e) { alert("Erreur réseau"); }
  };

  if (loading || !coach) return <div className="p-10 text-[#EAE6DA] text-center">Chargement...</div>;

  const profile = coach.professionalProfile;
  const calendarDays = getDaysInMonth();
  const daySlots = getSlotsForSelectedDay();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-[#EAE6DA] font-sans">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#EAE6DA]/60 hover:text-[#EAE6DA] mb-8 transition group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" /> Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- GAUCHE : PROFIL --- */}
        <div className="lg:col-span-4">
          <div className="bg-[#59647A] rounded-2xl p-6 border border-white/10 shadow-xl sticky top-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#EAE6DA] rounded-full flex items-center justify-center text-4xl font-bold mb-4 border-4 border-[#2F3A4A] text-[#2F3A4A]">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold flex items-center gap-2 text-[#EAE6DA]">
                {coach.username}
                <ShieldCheck size={18} className="text-[#4ECDC4]" />
              </h1>
              <p className="text-[#EAE6DA]/60 font-medium text-sm">{profile.title}</p>
            </div>
            <div className="my-6 border-t border-white/10"></div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#EAE6DA]/60">Tarif</span>
                <span className="font-bold text-[#4ECDC4]">{profile.hourlyRate}€/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#EAE6DA]/60">Avis</span>
                <span className="flex items-center gap-1 text-[#FFD93D] font-bold"><Star size={14} fill="currentColor"/> {profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- DROITE : CALENDRIER --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#59647A] p-6 md:p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#EAE6DA]">
              <Calendar className="text-[#4ECDC4]" /> Réserver une séance
            </h2>

            {/* Navigation Mois */}
            <div className="flex justify-between items-center mb-6 bg-[#2F3A4A] p-3 rounded-xl border border-white/5">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[#59647A] rounded-lg transition"><ChevronLeft/></button>
              <span className="font-bold text-lg capitalize">{monthName}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[#59647A] rounded-lg transition"><ChevronRight/></button>
            </div>

            {/* Grille Jours */}
            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[#EAE6DA]/40 text-xs font-bold">{d}</div>)}
              
              {calendarDays.map((day, index) => {
                // CORRECTION CRASH : Si day est null (case vide), on affiche une div vide
                if (!day) return <div key={index} className="h-10"></div>;
                
                const isSelected = selectedDayObj && selectedDayObj.toDateString() === day.toDateString();
                const available = hasSlots(day);
                const isPast = day < new Date().setHours(0,0,0,0);

                return (
                  <button
                    key={index}
                    disabled={isPast || !available}
                    onClick={() => { setSelectedDayObj(day); setSelectedSlot(null); }}
                    className={`
                      relative h-10 w-full rounded-lg flex items-center justify-center font-bold transition text-sm
                      ${isSelected ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-[#EAE6DA]/60'}
                      ${!available && !isPast && !isSelected ? 'opacity-30' : 'hover:bg-[#4ECDC4]/20'}
                      ${isPast ? 'opacity-10 cursor-not-allowed' : ''}
                    `}
                  >
                    {day.getDate()}
                    {available && !isSelected && !isPast && <span className="absolute bottom-1 w-1 h-1 bg-[#4ECDC4] rounded-full"></span>}
                  </button>
                );
              })}
            </div>

            {/* Liste Heures */}
            <div className="border-t border-white/10 pt-6">
               <h3 className="text-[#EAE6DA]/60 mb-4 text-sm font-bold uppercase">
                {selectedDayObj.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric'})}
               </h3>
               {daySlots.length > 0 ? (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                   {daySlots.map(slot => {
                     const time = new Date(slot.date).getHours() + "h00";
                     const isSelected = selectedSlot?.id === slot.id;
                     const isRemote = slot.type === 'REMOTE';
                     return (
                       <button
                         key={slot.id}
                         onClick={() => setSelectedSlot(slot)}
                         className={`py-2 px-2 rounded-lg text-sm font-bold border transition flex flex-col items-center gap-1 ${
                           isSelected ? 'bg-[#EAE6DA] text-[#2F3A4A] border-[#EAE6DA]' : 'bg-[#2F3A4A] border-white/10 text-[#EAE6DA] hover:border-[#EAE6DA]'
                         }`}
                       >
                         <span>{time}</span>
                         <span className="text-[10px] opacity-70 flex items-center gap-1">
                            {isRemote ? <Video size={10}/> : <MapPin size={10}/>} {isRemote ? "Visio" : "Cab."}
                         </span>
                       </button>
                     );
                   })}
                 </div>
               ) : <p className="text-[#EAE6DA]/40 text-sm italic">Aucun créneau ce jour-là.</p>}
            </div>

            {/* Bouton */}
            <button disabled={!selectedSlot} onClick={handleBooking} className={`w-full mt-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${selectedSlot ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#2F3A4A] text-[#EAE6DA]/30 cursor-not-allowed'}`}>
               Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}