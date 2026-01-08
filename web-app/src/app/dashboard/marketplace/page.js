'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Star, Search, MapPin, Filter, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const router = useRouter();
  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchCoaches = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      search: searchTerm,
      city: cityFilter,
      type: typeFilter
    }).toString();

    try {
      const res = await fetch(`${API_URL}/marketplace/search?${query}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      setCoaches(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoaches(); }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24"> {/* Padding ajusté pour mobile */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#EAE6DA]">Trouver un Expert</h1>

      {/* --- BARRE DE FILTRES RESPONSIVE --- */}
      <div className="bg-[#59647A] p-4 rounded-2xl mb-8 border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Recherche Texte */}
          <div className="flex-1 flex items-center bg-[#2F3A4A] rounded-xl px-4 border border-white/5 h-12">
            <Search className="text-[#EAE6DA]/50 min-w-[20px]" size={20} />
            <input 
              type="text" placeholder="Nom, Spécialité..." 
              className="bg-transparent border-none outline-none text-[#EAE6DA] px-3 w-full placeholder-[#EAE6DA]/30"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Ville */}
          <div className="flex-1 flex items-center bg-[#2F3A4A] rounded-xl px-4 border border-white/5 h-12">
            <MapPin className="text-[#EAE6DA]/50 min-w-[20px]" size={20} />
            <input 
              type="text" placeholder="Ville..." 
              className="bg-transparent border-none outline-none text-[#EAE6DA] px-3 w-full placeholder-[#EAE6DA]/30"
              value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>

          {/* Type & Bouton (Côte à côte sur mobile) */}
          <div className="flex gap-4">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#2F3A4A] text-[#EAE6DA] px-4 rounded-xl border border-white/5 outline-none cursor-pointer h-12 flex-1 md:flex-none"
            >
              <option value="">Tout type</option>
              <option value="REMOTE">📹 Visio</option>
              <option value="IN_PERSON">🏢 Cabinet</option>
            </select>

            <button onClick={fetchCoaches} className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 h-12 shadow-lg flex-1 md:flex-none">
              <Filter size={18}/> <span className="hidden md:inline">Filtrer</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="text-[#EAE6DA]/50 text-center py-10">Recherche des experts...</p>}

      {/* LISTE DES RÉSULTATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-[#59647A] rounded-2xl p-6 border border-white/5 hover:border-[#4ECDC4] transition shadow-lg flex flex-col group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#EAE6DA] rounded-full flex items-center justify-center text-2xl font-bold text-[#2F3A4A] shadow-md border-2 border-[#2F3A4A]">
                  {coach.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#EAE6DA] group-hover:text-[#4ECDC4] transition">{coach.username}</h3>
                  <p className="text-[#EAE6DA]/60 text-xs uppercase tracking-wide">{coach.professionalProfile?.title}</p>
                  <div className="flex items-center text-[#FFD93D] text-xs font-bold mt-1">
                    <Star size={12} className="fill-current mr-1"/> {coach.professionalProfile?.rating}
                  </div>
                </div>
             </div>
             
             <p className="text-[#EAE6DA]/80 text-sm mb-6 h-12 line-clamp-2 overflow-hidden leading-relaxed">
               {coach.professionalProfile?.bio}
             </p>

             <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[#4ECDC4] font-bold text-xl">
                  {coach.professionalProfile?.hourlyRate}€ <span className="text-xs text-[#EAE6DA]/50 font-normal">/h</span>
                </span>
                <button onClick={() => router.push(`/dashboard/marketplace/${coach.id}`)} className="bg-[#EAE6DA] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition flex items-center gap-2 shadow-md">
                  Voir Profil <ArrowRight size={16}/>
                </button>
             </div>
          </div>
        ))}
      </div>

      {!loading && coaches.length === 0 && (
        <div className="text-center py-20 bg-[#59647A]/20 rounded-2xl border border-dashed border-white/10">
           <User size={48} className="mx-auto text-[#EAE6DA]/20 mb-4"/>
           <p className="text-[#EAE6DA]/40">Aucun expert ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}