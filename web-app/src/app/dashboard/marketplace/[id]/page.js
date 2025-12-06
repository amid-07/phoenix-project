'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Star, Calendar, Clock, ArrowLeft, CheckCircle, ShieldCheck, Video, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CoachDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIQUE CALENDRIER ---
  const [availabilities, setAvailabilities] = useState([]); // Tous les créneaux
  const [currentDate, setCurrentDate] = useState(new Date()); // Mois affiché
  const [selectedDayObj, setSelectedDayObj] = useState(new Date()); // Jour sélectionné
  const [selectedSlot, setSelectedSlot] = useState(null); // Heure sélectionnée

  // --- LOGIQUE AVIS ---
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // ⚠️ URL DYNAMIQUE (Localhost ou Vercel/Ngrok)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/marketplace/coach/${params.id}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' } // Indispensable pour Vercel+Ngrok
      });
      const data = await res.json();
      setCoach(data);
      // On stocke les disponibilités
      if (data.professionalProfile?.availabilities) {
        setAvailabilities(data.professionalProfile.availabilities);
      }
    } catch (e) {
      console.error("Erreur fetch:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- FONCTIONS DU CALENDRIER ---
  
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Lundi = 0

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

  // --- ACTIONS ---

  const handleBooking = async () => {
    if (!selectedSlot) return;
    const dateReadable = new Date(selectedSlot.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
    
    if(!confirm(`Confirmer la réservation pour le ${dateReadable} ?`)) return;

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("Veuillez vous reconnecter.");
        return;
      }

      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          patientId: userId,
          coachId: coach.id,
          date: selectedSlot.date,
          availabilityId: selectedSlot.id
        })
      });

      if (res.ok) {
        alert("Réservation réussie !");
        router.push('/dashboard/bookings');
      } else {
        alert("Erreur lors de la réservation.");
      }
    } catch (e) { alert("Erreur réseau"); }
  };

  const sendReview = async () => {
    if (!comment) return;
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${API_URL}/marketplace/review`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ userId, coachId: coach.id, rating, comment })
      });
      setComment('');
      fetchDetails(); // Rafraîchir pour voir le nouvel avis
    } catch (e) { alert("Erreur lors de l'envoi de l'avis"); }
  };

  if (loading || !coach) return <div className="p-10 text-[#EAE6DA] text-center">Chargement du profil...</div>;

  const profile = coach.professionalProfile;
  const calendarDays = getDaysInMonth();
  const daySlots = getSlotsForSelectedDay();

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA] font-sans">
      
      {/* Header Navigation */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#EAE6DA]/60 hover:text-[#EAE6DA] mb-8 transition group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" /> Retour aux experts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE (PROFIL) --- */}
        <div className="lg:col-span-4">
          <div className="bg-[#59647A] rounded-2xl p-6 border border-white/10 shadow-xl sticky top-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-[#EAE6DA] rounded-full flex items-center justify-center text-5xl font-bold mb-4 border-4 border-[#2F3A4A] text-[#2F3A4A] shadow-lg">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-[#EAE6DA]">
                {coach.username}
                <ShieldCheck size={20} className="text-[#4ECDC4]" />
              </h1>
              <p className="text-[#EAE6DA]/60 font-medium">{profile.title}</p>
            </div>
            <div className="my-6 border-t border-white/10"></div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#EAE6DA]/60">Tarif</span>
                <span className="text-xl font-bold text-[#4ECDC4]">{profile.hourlyRate}€ <span className="text-sm text-[#EAE6DA]/60">/h</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EAE6DA]/60">Note</span>
                <span className="flex items-center gap-1 text-[#FFD93D] font-bold">
                  <Star size={16} fill="currentColor" /> {profile.rating} <span className="text-[#EAE6DA]/60 font-normal">({profile.reviews.length} avis)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#EAE6DA]/60">Consultation</span>
                <span className="flex items-center gap-1 text-[#EAE6DA]">
                  <Video size={16} /> Visio
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {profile.specialties.map((s, i) => (
                <span key={i} className="text-xs bg-[#2F3A4A] text-[#EAE6DA]/70 px-3 py-1 rounded-full border border-white/10">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (CONTENU) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bio */}
          <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#EAE6DA]">À propos</h2>
            <p className="text-[#EAE6DA]/80 leading-relaxed">{profile.bio}</p>
          </div>

          {/* === CALENDRIER VISUEL === */}
          <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#EAE6DA]">
              <Calendar className="text-[#4ECDC4]" /> Réserver une séance
            </h2>

            {/* Navigation Mois */}
            <div className="flex justify-between items-center mb-6 bg-[#2F3A4A] p-3 rounded-xl border border-white/5">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[#59647A] rounded-lg transition text-[#EAE6DA]"><ChevronLeft /></button>
              <span className="font-bold text-lg capitalize text-[#EAE6DA]">{monthName}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[#59647A] rounded-lg transition text-[#EAE6DA]"><ChevronRight /></button>
            </div>

            {/* Grille Jours */}
            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                <div key={d} className="text-[#EAE6DA]/40 text-sm font-medium">{d}</div>
              ))}
              
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
                      ${isSelected ? 'bg-[#4ECDC4] text-[#2F3A4A] shadow-lg shadow-[#4ECDC4]/30' : 'bg-[#2F3A4A] text-[#EAE6DA]/60 hover:bg-white/10'}
                      ${!available && !isPast ? 'opacity-40 cursor-default' : ''}
                      ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                    `}
                  >
                    {day.getDate()}
                    {/* Indicateur de dispo */}
                    {available && !isSelected && !isPast && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#4ECDC4] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 my-6"></div>

            {/* Liste des Heures */}
            <div>
              <h3 className="text-[#EAE6DA]/60 mb-4 font-medium flex items-center gap-2">
                Horaires pour le <span className="text-[#EAE6DA]">{selectedDayObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
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
                            ? 'bg-[#4ECDC4] border-[#4ECDC4] text-[#2F3A4A]' 
                            : 'bg-[#2F3A4A] border-white/10 text-[#EAE6DA] hover:border-[#4ECDC4]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#EAE6DA]/40 italic text-sm">Aucun créneau disponible ce jour-là.</p>
              )}
            </div>

            {/* Bouton Confirmer */}
            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedSlot}
                onClick={handleBooking}
                className={`px-8 py-3 rounded-xl font-bold text-[#2F3A4A] transition flex items-center gap-2 ${
                  selectedSlot 
                    ? 'bg-[#EAE6DA] hover:bg-white shadow-lg' 
                    : 'bg-[#2F3A4A] border border-white/10 text-[#EAE6DA]/30 cursor-not-allowed'
                }`}
              >
                <CheckCircle size={18} />
                Confirmer le RDV
              </button>
            </div>
          </div>

          {/* Avis */}
          <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#EAE6DA]">
              <Star className="text-[#FFD93D]" /> Avis Clients
            </h2>
            
            {/* Formulaire */}
            <div className="bg-[#2F3A4A] p-4 rounded-xl mb-6 border border-white/5">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="hover:scale-110 transition">
                    <Star size={24} className={`${star <= rating ? 'text-[#FFD93D] fill-[#FFD93D]' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Partagez votre expérience..." 
                className="w-full bg-[#59647A] text-[#EAE6DA] p-3 rounded-lg border border-white/10 focus:border-[#4ECDC4] outline-none mb-3 h-20 placeholder-[#EAE6DA]/30" 
              />
              <button onClick={sendReview} className="text-[#4ECDC4] font-bold text-sm float-right hover:underline">
                Publier
              </button>
              <div className="clear-both"></div>
            </div>

            <div className="space-y-4">
              {profile.reviews.length > 0 ? profile.reviews.map(review => (
                <div key={review.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-[#EAE6DA]">{review.author.username}</span>
                    <div className="flex text-[#FFD93D]">{[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                  </div>
                  <p className="text-[#EAE6DA]/60 text-sm">{review.comment}</p>
                </div>
              )) : (
                <p className="text-[#EAE6DA]/40 italic text-center">Aucun avis.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}