'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Star, Search, MapPin, Video, Filter, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ÉTATS DES FILTRES
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // '' | 'REMOTE' | 'IN_PERSON'

  const router = useRouter();
  const API_URL = "http://localhost:3000";

  // Fonction de recherche dynamique
  const fetchCoaches = async () => {
    setLoading(true);
    // Construction de l'URL avec les paramètres
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

  // On lance la recherche au chargement et quand on clique sur "Filtrer"
  useEffect(() => { fetchCoaches(); }, []); 

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#EAE6DA]">Trouver un Expert</h1>

      {/* --- BARRE DE FILTRES --- */}
      <div className="bg-[#59647A] p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 border border-white/10 shadow-lg">
        
        {/* Recherche Texte */}
        <div className="flex-1 flex items-center bg-[#2F3A4A] rounded-xl px-4 border border-white/5">
          <Search className="text-[#EAE6DA]/50" size={20} />
          <input 
            type="text" placeholder="Nom, Spécialité..." 
            className="bg-transparent border-none outline-none text-[#EAE6DA] p-3 w-full placeholder-[#EAE6DA]/30"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Ville */}
        <div className="flex-1 flex items-center bg-[#2F3A4A] rounded-xl px-4 border border-white/5">
          <MapPin className="text-[#EAE6DA]/50" size={20} />
          <input 
            type="text" placeholder="Ville (ex: Casablanca)" 
            className="bg-transparent border-none outline-none text-[#EAE6DA] p-3 w-full placeholder-[#EAE6DA]/30"
            value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>

        {/* Type */}
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#2F3A4A] text-[#EAE6DA] p-3 rounded-xl border border-white/5 outline-none cursor-pointer"
        >
          <option value="">Tout type</option>
          <option value="REMOTE">📹 En Visio</option>
          <option value="IN_PERSON">🏢 En Cabinet</option>
        </select>

        {/* Bouton Rechercher */}
        <button onClick={fetchCoaches} className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
          <Filter size={18}/> Filtrer
        </button>
      </div>

      {loading && <p className="text-[#EAE6DA]/50 text-center">Recherche en cours...</p>}

      {/* LISTE DES RÉSULTATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-[#59647A] rounded-2xl p-6 border border-white/5 hover:border-[#4ECDC4] transition shadow-lg flex flex-col group">
             {/* ... (Le code de la carte reste identique à ce que vous aviez) ... */}
             {/* Je remets le début pour contexte */}
             <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#EAE6DA] rounded-full flex items-center justify-center text-2xl font-bold text-[#2F3A4A]">
                  {coach.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#EAE6DA]">{coach.username}</h3>
                  <p className="text-[#EAE6DA]/60 text-sm">{coach.professionalProfile?.title}</p>
                </div>
             </div>
             <p className="text-[#EAE6DA]/80 text-sm mb-6 h-12 line-clamp-2 overflow-hidden">{coach.professionalProfile?.bio}</p>
             
             <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[#4ECDC4] font-bold text-lg">{coach.professionalProfile?.hourlyRate}€/h</span>
                <button onClick={() => router.push(`/dashboard/marketplace/${coach.id}`)} className="bg-[#EAE6DA] text-[#2F3A4A] px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition">Voir Profil</button>
             </div>
          </div>
        ))}
      </div>
      {!loading && coaches.length === 0 && <p className="text-center text-[#EAE6DA]/40 mt-10">Aucun expert ne correspond à votre recherche.</p>}
    </div>
  );
}