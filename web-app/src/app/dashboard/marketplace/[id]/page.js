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

  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/marketplace/coach/${params.id}`);
        const data = await res.json();
        setCoach(data);
        if (data.professionalProfile?.availabilities) {
          setAvailabilities(data.professionalProfile.availabilities);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchDetails();
  }, [params.id]);

  // --- LOGIQUE CALENDRIER (Identique, juste le style change dans le return) ---
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const changeMonth = (offset) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const hasSlots = (dateObj) => {
    if (!dateObj) return false;
    const dateStr = dateObj.toISOString().split('T')[0];
    return availabilities.some(slot => slot.date.startsWith(dateStr));
  };

  const getSlotsForSelectedDay = () => {
    const dateStr = selectedDayObj.toISOString().split('T')[0];
    return availabilities.filter(slot => slot.date.startsWith(dateStr));
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    if(!confirm(`Confirmer la réservation ?`)) return;
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: userId,
          coachId: coach.id,
          date: selectedSlot.date,
          availabilityId: selectedSlot.id
        })
      });
      if (res.ok) router.push('/dashboard/bookings');
    } catch (e) { alert("Erreur réseau"); }
  };

  const sendReview = async () => {
    if (!comment) return;
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${API_URL}/marketplace/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coachId: coach.id, rating, comment })
      });
      setComment('');
      window.location.reload(); // Recharger pour voir l'avis
    } catch (e) { alert("Erreur"); }
  };

  if (loading || !coach) return <div className="p-10 text-primary text-center">Chargement...</div>;

  const profile = coach.professionalProfile;
  const calendarDays = getDaysInMonth();
  const daySlots = getSlotsForSelectedDay();

  return (
    <div className="p-8 max-w-6xl mx-auto text-primary font-sans">
      
      {/* Bouton Retour */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-primary/60 hover:text-primary mb-8 transition">
        <ArrowLeft size={20} /> Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- PROFIL COACH (GAUCHE) --- */}
        <div className="lg:col-span-4">
          <div className="bg-surface rounded-2xl p-6 border border-white/10 shadow-xl sticky top-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center text-5xl font-bold mb-4 border-4 border-background text-background shadow-lg">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
                {coach.username}
                <ShieldCheck size={20} className="text-accent" />
              </h1>
              <p className="text-primary/60 font-medium">{profile.title}</p>
            </div>

            <div className="my-6 border-t border-white/10"></div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-primary/60">Tarif</span>
                <span className="text-xl font-bold text-accent">{profile.hourlyRate}€ <span className="text-sm text-primary/60">/h</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/60">Note</span>
                <span className="flex items-center gap-1 text-warning font-bold">
                  <Star size={16} fill="currentColor" /> {profile.rating}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {profile.specialties.map((s, i) => (
                <span key={i} className="text-xs bg-background text-primary/70 px-3 py-1 rounded-full border border-white/10">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* --- CONTENU (DROITE) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bio */}
          <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-primary">À propos</h2>
            <p className="text-primary/80 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Calendrier */}
          <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
              <Calendar className="text-accent" /> Réserver une séance
            </h2>

            {/* Navigation Mois */}
            <div className="flex justify-between items-center mb-6 bg-background p-3 rounded-xl border border-white/5">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-surface rounded-lg transition"><ChevronLeft /></button>
              <span className="font-bold text-lg capitalize text-primary">{monthName}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-surface rounded-lg transition"><ChevronRight /></button>
            </div>

            {/* Grille */}
            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d} className="text-primary/40 text-sm font-medium">{d}</div>)}
              
              {calendarDays.map((day, index) => {
                if (!day) return <div key={index}></div>;
                const isSelected = selectedDayObj.toDateString() === day.toDateString();
                const available = hasSlots(day);
                const isPast = day < new Date().setHours(0,0,0,0);

                return (
                  <button
                    key={index}
                    disabled={isPast || !available}
                    onClick={() => { setSelectedDayObj(day); setSelectedSlot(null); }}
                    className={`
                      relative h-12 rounded-xl flex items-center justify-center font-bold transition
                      ${isSelected ? 'bg-accent text-background shadow-lg shadow-accent/30' : 'bg-background text-primary/60 hover:bg-white/10'}
                      ${!available && !isPast ? 'opacity-40 cursor-default' : ''}
                      ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                    `}
                  >
                    {day.getDate()}
                    {available && !isSelected && !isPast && <span className="absolute bottom-1 w-1.5 h-1.5 bg-accent rounded-full"></span>}
                  </button>
                );
              })}
            </div>

            {/* Horaires */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-primary/60 mb-4 font-medium flex items-center gap-2">
                Horaires pour le <span className="text-white">{selectedDayObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}</span>
              </h3>
              
              {daySlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {daySlots.map(slot => {
                    const time = new Date(slot.date).getHours() + "h00";
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-4 rounded-lg text-sm font-bold border transition ${
                          isSelected 
                            ? 'bg-accent border-accent text-background' 
                            : 'bg-background border-white/10 text-primary hover:border-accent'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              ) : <p className="text-primary/40 italic text-sm">Aucun créneau ce jour-là.</p>}
            </div>

            {/* Bouton Confirmer */}
            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedSlot}
                onClick={handleBooking}
                className={`px-8 py-3 rounded-xl font-bold text-background transition flex items-center gap-2 ${
                  selectedSlot 
                    ? 'bg-primary hover:bg-white shadow-lg' 
                    : 'bg-background border border-white/10 text-primary/30 cursor-not-allowed'
                }`}
              >
                <CheckCircle size={18} /> Confirmer
              </button>
            </div>
          </div>

          {/* Avis */}
          <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Star className="text-warning" /> Avis Clients</h2>
            
            <div className="bg-background p-4 rounded-xl mb-6 border border-white/5">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}><Star size={24} className={`${star <= rating ? 'text-warning fill-warning' : 'text-gray-600'}`} /></button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Partagez votre expérience..." className="w-full bg-surface text-primary p-3 rounded-lg border border-white/10 focus:border-accent outline-none mb-3 h-20" />
              <button onClick={sendReview} className="text-accent font-bold text-sm float-right hover:underline">Publier</button>
              <div className="clear-both"></div>
            </div>

            <div className="space-y-4">
              {profile.reviews.length > 0 ? profile.reviews.map(review => (
                <div key={review.id} className="border-b border-white/10 pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-primary">{review.author.username}</span>
                    <div className="flex text-warning">{[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                  </div>
                  <p className="text-primary/60 text-sm">{review.comment}</p>
                </div>
              )) : <p className="text-primary/40 italic text-center">Aucun avis.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}