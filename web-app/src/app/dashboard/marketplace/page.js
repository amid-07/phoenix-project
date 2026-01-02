'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Star, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${API_URL}/marketplace/coaches`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(res => res.json()).then(data => { setCoaches(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-[#EAE6DA]">Experts Disponibles</h1>
      <p className="text-[#B0BCC9] mb-8">Trouvez le professionnel qui vous correspond.</p>

      {loading && <div className="animate-pulse text-[#EAE6DA]/50">Chargement...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-[#59647A] rounded-2xl p-6 border border-white/5 hover:border-[#4ECDC4]/50 transition shadow-lg group flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#EAE6DA] rounded-full flex items-center justify-center text-xl font-bold text-[#2F3A4A]">
                {coach.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#EAE6DA] group-hover:text-[#4ECDC4] transition">{coach.username}</h3>
                <p className="text-[#B0BCC9] text-xs uppercase tracking-wide">{coach.professionalProfile?.title}</p>
              </div>
            </div>
            
            <p className="text-[#EAE6DA]/80 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
              {coach.professionalProfile?.bio}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-[#FFD93D] font-bold flex items-center gap-1">
                <Star size={16} fill="currentColor"/> {coach.professionalProfile?.rating}
              </span>
              <button onClick={() => router.push(`/dashboard/marketplace/${coach.id}`)} className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#2F3A4A] px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2">
                Voir <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}