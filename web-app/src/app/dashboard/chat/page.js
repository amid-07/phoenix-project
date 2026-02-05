'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Salam, je suis Tafsut. Je suis là si tu as besoin de parler ou de reconstruire quelque chose. Je t'écoute.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input;
    const userMsg = { id: Date.now(), text: userMsgText, sender: 'user' };
    
    // 1. Sauvegarder l'historique ACTUEL (avant d'ajouter le nouveau message)
    const historyToSend = messages.map(m => ({
      text: m.text,
      sender: m.sender === 'ai' ? 'model' : 'user'
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai-coach/chat`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
        },
        // 2. Envoyer le message ET l'historique
        body: JSON.stringify({ 
          message: userMsgText,
          history: historyToSend 
        })
      });
      
      const data = await response.json();
      const aiMsg = { id: Date.now() + 1, text: data.text, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Problème de connexion, vérifie ton réseau khoya/khti.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-[#2F3A4A] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
      {/* HEADER */}
      <div className="bg-[#59647A] p-4 flex items-center gap-4 border-b border-white/10 shadow-md">
        <div className="relative">
           <div className="w-12 h-12 bg-[#EAE6DA] rounded-full flex items-center justify-center text-[#2F3A4A]">
             <Bot size={28} />
           </div>
           <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ECDC4] border-2 border-[#59647A] rounded-full animate-pulse"></span>
        </div>
        <div>
          <h2 className="font-bold text-xl text-[#EAE6DA]">TAFSUT Companion</h2>
          <p className="text-xs text-[#EAE6DA]/60 flex items-center gap-1">
            <Sparkles size={12} className="text-[#FFD93D]"/> IA Thérapeutique Active
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 bg-[#252E3E] overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-auto ${msg.sender === 'user' ? 'bg-[#4ECDC4] text-[#2F3A4A]' : 'bg-[#EAE6DA] text-[#2F3A4A]'}`}>
                {msg.sender === 'user' ? <User size={16}/> : <Bot size={16}/>}
              </div>
              <div className={`p-4 rounded-2xl text-sm md:text-base ${
                msg.sender === 'user' 
                  ? 'bg-[#4ECDC4] text-[#2F3A4A] rounded-br-none' 
                  : 'bg-[#59647A] text-[#EAE6DA] rounded-bl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start ml-11">
             <div className="bg-[#59647A] p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EAE6DA]/50 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#EAE6DA]/50 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-[#EAE6DA]/50 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="bg-[#2F3A4A] p-4 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            className="w-full bg-[#1E1E2E] text-[#EAE6DA] pl-6 pr-14 py-4 rounded-full border border-white/10 focus:outline-none focus:border-[#4ECDC4]"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="absolute right-2 p-2.5 bg-[#EAE6DA] text-[#2F3A4A] rounded-full hover:bg-[#4ECDC4] transition disabled:opacity-50"
          >
            {!loading ? <Send size={20} /> : <RefreshCw size={20} className="animate-spin"/>}
          </button>
        </div>
      </form>
    </div>
  );
}