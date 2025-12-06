'use client';
import { useState } from 'react';
import { Save, BookOpen, Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  
  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const saveJournal = async () => {
    const userId = localStorage.getItem('userId');
    if (!content) return;
    
    await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // <--- FIX
    },
      body: JSON.stringify({ userId, content, mood })
    });
    alert("Pensée enregistrée avec succès.");
    setContent('');
  };

  const moods = [
    { level: 1, icon: CloudLightning, color: '#FF6B6B' },
    { level: 2, icon: CloudRain, color: '#FFA502' },
    { level: 3, icon: Cloud, color: '#CED6E0' },
    { level: 4, icon: Sun, color: '#4ECDC4' },
    { level: 5, icon: Sun, color: '#FFD93D' }, // Soleil brillant
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto text-[#EAE6DA]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FFD93D]/10 rounded-xl text-[#FFD93D]">
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mon Journal</h1>
          <p className="text-[#EAE6DA]/60">Déposez vos pensées, libérez votre esprit.</p>
        </div>
      </div>
      
      <div className="bg-[#59647A] p-8 rounded-2xl border border-white/10 shadow-xl">
        
        <label className="block text-[#EAE6DA]/80 mb-4 font-medium text-lg">Comment vous sentez-vous ?</label>
        
        <div className="flex gap-4 mb-8 bg-[#2F3A4A] p-4 rounded-xl w-fit border border-white/5">
          {moods.map((m) => (
            <button 
              key={m.level} 
              onClick={() => setMood(m.level)}
              className={`p-3 rounded-xl transition transform hover:scale-110 ${
                mood === m.level ? 'bg-white/10 ring-2 ring-[#EAE6DA]' : 'hover:bg-white/5'
              }`}
            >
              <m.icon size={32} color={m.color} fill={mood === m.level ? m.color : 'none'} />
            </button>
          ))}
        </div>

        <label className="block text-[#EAE6DA]/80 mb-2 font-medium text-lg">Vos réflexions du jour</label>
        <textarea 
          className="w-full h-64 bg-[#2F3A4A] border border-white/10 rounded-xl p-6 text-[#EAE6DA] text-lg focus:outline-none focus:border-[#EAE6DA]/50 placeholder-[#EAE6DA]/20 resize-none leading-relaxed shadow-inner"
          placeholder="Écrivez librement ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveJournal}
            className="bg-[#EAE6DA] text-[#2F3A4A] px-8 py-3 rounded-xl font-bold hover:bg-white transition flex items-center gap-2 shadow-lg shadow-white/10"
          >
            <Save size={20} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}