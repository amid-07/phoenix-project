'use client';
import { useState, useEffect } from 'react';
import { Save, BookOpen, Sun, CloudRain, CloudLightning, Calendar } from 'lucide-react';

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ URL API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // --- CHARGEMENT HISTORIQUE ---
  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`${API_URL}/journal/${userId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      setHistory(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, []);

  // --- SAUVEGARDE ---
  const saveJournal = async () => {
    const userId = localStorage.getItem('userId');
    if (!content.trim()) return;
    
    await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'ngrok-skip-browser-warning': 'true' 
      },
      body: JSON.stringify({ userId, content, mood })
    });
    alert("Pensée enregistrée.");
    setContent('');
    fetchHistory(); // Rafraîchir la liste
  };

  // Configuration des humeurs
  const moods = [
    { level: 1, icon: CloudLightning, color: '#FF6B6B' },
    { level: 2, icon: CloudRain, color: '#FFA502' },
    { level: 3, icon: Sun, color: '#CED6E0' },
    { level: 4, icon: Sun, color: '#4ECDC4' },
    { level: 5, icon: Sun, color: '#FFD93D' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#EAE6DA]">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FFD93D]/10 rounded-xl text-[#FFD93D]"><BookOpen size={32} /></div>
        <div>
          <h1 className="text-3xl font-bold">Journal de Bord</h1>
          <p className="text-[#EAE6DA]/60">Vos pensées sont en sécurité ici.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 shadow-xl h-fit">
          <label className="block text-[#EAE6DA] mb-4 font-bold text-lg">Météo intérieure</label>
          
          <div className="flex gap-3 mb-8 bg-[#2F3A4A] p-4 rounded-xl w-fit border border-white/5">
            {moods.map((m) => {
              const Icon = m.icon; // On récupère l'icône
              return (
                <button 
                  key={m.level} 
                  onClick={() => setMood(m.level)} 
                  className={`p-2 rounded-lg transition hover:bg-white/10 ${mood === m.level ? 'bg-white/20 ring-1 ring-[#EAE6DA]' : ''}`}
                >
                  <Icon size={28} color={m.color} />
                </button>
              );
            })}
          </div>

          <label className="block text-[#EAE6DA] mb-2 font-bold text-lg">Vos réflexions</label>
          <textarea 
            className="w-full h-48 bg-[#2F3A4A] border border-white/10 rounded-xl p-4 text-[#EAE6DA] focus:outline-none focus:border-[#4ECDC4] placeholder-[#B0BCC9]/30 resize-none leading-relaxed text-lg"
            placeholder="Comment s'est passée votre journée ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button onClick={saveJournal} className="bg-[#EAE6DA] text-[#2F3A4A] px-8 py-3 rounded-xl font-bold hover:bg-white transition flex items-center gap-2 shadow-lg">
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </div>

        {/* --- COLONNE DROITE : HISTORIQUE --- */}
        <div className="bg-[#59647A]/50 p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar size={20}/> Historique</h2>
           
           {loading && <p className="opacity-50">Chargement...</p>}
           
           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
             {history.map((entry) => {
               // ✅ CORRECTION ICI : On trouve l'objet mood correspondant
               const moodObj = moods.find(m => m.level === entry.mood);
               // On récupère le composant Icône (avec une majuscule)
               const MoodIcon = moodObj ? moodObj.icon : Sun; 
               const moodColor = moodObj ? moodObj.color : '#FFF';

               return (
                 <div key={entry.id} className="bg-[#2F3A4A] p-5 rounded-xl border border-white/5 hover:border-white/20 transition group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-[#EAE6DA]/50 uppercase tracking-widest">
                         {new Date(entry.createdAt).toLocaleDateString()}
                       </span>
                       {/* Affichage de l'icône corrigé */}
                       <MoodIcon size={18} color={moodColor} />
                    </div>
                    <p className="text-[#EAE6DA]/90 leading-relaxed text-sm whitespace-pre-wrap">{entry.content}</p>
                 </div>
               );
             })}

             {!loading && history.length === 0 && (
               <div className="text-center py-10 opacity-40 italic border-2 border-dashed border-white/10 rounded-xl">
                 Votre histoire commence aujourd'hui.
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}