'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis l'IA TAFUT. Je suis là pour t'écouter et te soutenir.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ⚠️ UTILISEZ LOCALHOST POUR LE WEB
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai-coach/chat`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // <--- FIX
        },
        body: JSON.stringify({ message: userMsg.text })
      });
      
      const data = await response.json();
      
      // Si l'IA renvoie le message d'erreur générique, on l'affiche quand même
      const aiMsg = { id: Date.now() + 1, text: data.text, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, text: "Erreur de connexion avec le serveur.", sender: 'ai' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto">
      
      {/* En-tête du Chat */}
      <div className="bg-surface p-4 rounded-t-2xl border-b border-gray-600 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-background">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg text-primary">Coach TAFUT</h2>
          <p className="text-xs text-accent flex items-center gap-1">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span> En ligne
          </p>
        </div>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 bg-background/50 overflow-y-auto p-6 space-y-4 border-x border-gray-700">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-primary text-background font-medium rounded-br-none' // User: Crème texte foncé
                : 'bg-surface text-white rounded-bl-none' // IA: Bleu gris texte blanc
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface p-4 rounded-2xl rounded-bl-none text-gray-300 italic flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin"/> TAFUT réfléchit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Barre de saisie */}
      <form onSubmit={sendMessage} className="bg-surface p-4 rounded-b-2xl border-t border-gray-600 flex gap-4 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 bg-background text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border border-transparent placeholder-gray-500"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-primary text-background p-3 rounded-xl hover:bg-white transition disabled:opacity-50 font-bold"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}