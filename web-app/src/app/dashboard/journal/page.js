'use client';
import { useState, useEffect } from 'react';
import { Save, BookOpen, Calendar, Zap, Frown, Meh, Smile, AlertCircle, CheckCircle2, History } from 'lucide-react';

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // --- Chargement Historique ---
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

  // --- Sauvegarde ---
  const saveJournal = async () => {
    const userId = localStorage.getItem('userId');
    if (!content.trim()) return;
    
    await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ userId, content, mood })
    });
    alert("Votre réflexion a été enregistrée.");
    setContent('');
    fetchHistory();
  };

  // --- NOUVELLE ÉCHELLE D'HUMEUR (PRO) ---
  const moodScale = [
    { level: 1, label: "Difficile", icon: AlertCircle, color: "#FF6B6B" }, // Rouge
    { level: 2, label: "Basse", icon: Frown, color: "#FFA502" },           // Orange
    { level: 3, label: "Stable", icon: Meh, color: "#B0BCC9" },            // Gris
    { level: 4, label: "Positive", icon: Smile, color: "#4ECDC4" },        // Vert
    { level: 5, label: "Forte", icon: Zap, color: "#FFD93D" },             // Or (Énergie)
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-[#EAE6DA] font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#59647A]/30 rounded-2xl text-[#EAE6DA] border border-white/10">
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal de Bord</h1>
          <p className="text-[#B0BCC9] text-sm">Espace d'introspection sécurisé.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : ZONE D'ÉCRITURE (7 colonnes sur PC, 12 sur mobile) --- */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#59647A] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
            
            {/* Sélecteur d'Humeur */}
            <label className="block text-[#B0BCC9] text-xs font-bold uppercase tracking-widest mb-4">État d'esprit actuel</label>
            <div className="grid grid-cols-5 gap-2 mb-8 bg-[#2F3A4A] p-2 rounded-2xl border border-white/5">
              {moodScale.map((m) => {
                const Icon = m.icon;
                const isActive = mood === m.level;
                return (
                  <button 
                    key={m.level} 
                    onClick={() => setMood(m.level)} 
                    className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-white/10 shadow-lg scale-105' : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Icon size={24} color={isActive ? m.color : '#B0BCC9'} fill={isActive && m.level === 5 ? m.color : 'none'} />
                    <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Zone Texte */}
            <label className="block text-[#B0BCC9] text-xs font-bold uppercase tracking-widest mb-4">Vos réflexions</label>
            <div className="relative">
              <textarea 
                className="w-full h-64 bg-[#2F3A4A] border border-white/10 rounded-2xl p-6 text-[#EAE6DA] text-lg focus:outline-none focus:border-[#4ECDC4]/50 focus:ring-1 focus:ring-[#4ECDC4]/50 placeholder-[#B0BCC9]/20 resize-none leading-relaxed shadow-inner"
                placeholder="Écrivez ce qui vous traverse l'esprit..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-xs text-[#B0BCC9]/40">
                {content.length} caractères
              </div>
            </div>
            
            {/* Bouton */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={saveJournal}
                disabled={!content.trim()}
                className="bg-[#EAE6DA] text-[#2F3A4A] px-8 py-3.5 rounded-xl font-bold hover:bg-white transition flex items-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : HISTORIQUE (5 colonnes sur PC, 12 sur mobile) --- */}
        <div className="lg:col-span-5">
           <div className="bg-[#59647A]/30 backdrop-blur-md p-6 rounded-3xl border border-white/5 h-full max-h-[800px] flex flex-col">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#EAE6DA]">
               <History size={20} className="text-[#4ECDC4]"/> Historique
             </h2>
             
             {loading && <p className="text-center opacity-50">Chargement...</p>}
             
             <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
               {history.map((entry) => {
                 const moodObj = moodScale.find(m => m.level === entry.mood) || moodScale[2];
                 const MoodIcon = moodObj.icon;
                 
                 return (
                   <div key={entry.id} className="bg-[#2F3A4A] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition group shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-2">
                           <Calendar size={12} className="text-[#B0BCC9]"/>
                           <span className="text-xs font-bold text-[#B0BCC9] uppercase tracking-wide">
                             {new Date(entry.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                         <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg">
                           <MoodIcon size={14} color={moodObj.color} />
                           <span className="text-[10px] font-bold" style={{color: moodObj.color}}>{moodObj.label}</span>
                         </div>
                      </div>
                      <p className="text-[#EAE6DA]/90 leading-relaxed text-sm whitespace-pre-wrap font-light">
                        {entry.content}
                      </p>
                   </div>
                 );
               })}
               {!loading && history.length === 0 && (
                 <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                   <p className="text-[#B0BCC9]/50 italic">Aucune entrée pour le moment.</p>
                 </div>
               )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}