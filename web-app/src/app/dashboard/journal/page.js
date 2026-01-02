'use client';
import { useState } from 'react';
import { Save, BookOpen, Cloud, Sun } from 'lucide-react';

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const saveJournal = async () => {
    const userId = localStorage.getItem('userId');
    await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ userId, content, mood })
    });
    alert("Enregistré !");
    setContent('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-[#EAE6DA]">Journal de Bord</h1>
      <p className="text-[#B0BCC9] mb-8">Un espace sûr pour vos pensées.</p>
      
      <div className="bg-[#59647A] p-8 rounded-2xl border border-white/5 shadow-xl">
        <label className="block text-[#EAE6DA] mb-4 font-bold">Humeur du jour</label>
        <div className="flex gap-3 mb-8 bg-[#2F3A4A] p-4 rounded-xl w-fit border border-white/5">
          {[1,2,3,4,5].map((m) => (
            <button key={m} onClick={() => setMood(m)} className={`p-2 rounded-lg transition hover:bg-white/10 ${mood === m ? 'bg-white/20 ring-1 ring-[#EAE6DA]' : ''}`}>
              <Sun size={28} className={m < 3 ? "text-[#FF6B6B]" : m === 3 ? "text-[#B0BCC9]" : "text-[#FFD93D]"} />
            </button>
          ))}
        </div>

        <label className="block text-[#EAE6DA] mb-2 font-bold">Vos réflexions</label>
        <textarea 
          className="w-full h-48 bg-[#2F3A4A] border border-white/10 rounded-xl p-4 text-[#EAE6DA] focus:outline-none focus:border-[#4ECDC4] placeholder-[#B0BCC9]/30 resize-none leading-relaxed"
          placeholder="Comment vous sentez-vous vraiment ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-6 flex justify-end">
          <button onClick={saveJournal} className="bg-[#EAE6DA] text-[#2F3A4A] px-8 py-3 rounded-xl font-bold hover:bg-white transition flex items-center gap-2">
            <Save size={18} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}