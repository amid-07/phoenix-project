'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Star } from 'lucide-react';

export default function MarketplacePage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/marketplace/coaches`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then(data => {
        setCoaches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les experts.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary tracking-wide">Experts Disponibles</h1>

      {loading && <p className="text-primary/60 animate-pulse">Recherche des meilleurs experts...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          // CARTE TAFUT : Fond Surface (Bleu Gris)
          <div key={coach.id} className="bg-surface rounded-2xl p-6 border border-white/5 hover:border-accent transition shadow-lg flex flex-col group">
            
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar : Fond Crème, Texte Foncé */}
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-background shadow-md">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition">{coach.username}</h3>
                <p className="text-primary/60 text-sm flex items-center gap-1">
                  {coach.professionalProfile?.title}
                </p>
                <div className="flex items-center text-warning text-sm font-bold mt-1">
                  <Star size={14} className="fill-current mr-1"/> {coach.professionalProfile?.rating}
                </div>
              </div>
            </div>

            <p className="text-primary/80 text-sm mb-6 line-clamp-3 h-16 leading-relaxed">
              {coach.professionalProfile?.bio}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
               {coach.professionalProfile?.specialties.map((tag, i) => (
                 <span key={i} className="bg-background text-primary/70 px-2 py-1 rounded text-xs border border-white/10">
                   {tag}
                 </span>
               ))}
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
              <span className="text-accent font-bold text-xl">
                {coach.professionalProfile?.hourlyRate}€ <span className="text-xs text-primary/50">/h</span>
              </span>
              
              {/* Bouton : Fond Crème */}
              <button 
                onClick={() => router.push(`/dashboard/marketplace/${coach.id}`)}
                className="bg-primary hover:bg-white text-background px-5 py-2 rounded-lg text-sm font-bold transition shadow-md transform active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}