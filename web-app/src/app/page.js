'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sur Vercel, ça prendra la variable d'environnement.
  // En local, ça prendra localhost:3000.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 👇 C'EST CETTE LIGNE QUI DÉBLOQUE VERCEL/NGROK 👇
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ 
          email: email.toLowerCase(), 
          password: password 
        }),
      });

      const data = await response.json();

      if (data && data.id) {
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        router.push('/dashboard');
      } else {
        setError(data.message || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2F3A4A] p-4 text-[#EAE6DA]">
      
      <div className="w-full max-w-md bg-[#59647A] p-8 rounded-2xl shadow-2xl border border-white/10">
        
      <div className="text-center mb-8 flex flex-col items-center">
          {/* NOUVEAU LOGO ICI */}
          <div className="mb-4 drop-shadow-lg">
            <Image 
              src="/logo.png" 
              alt="Logo Tafut" 
              width={100} 
              height={100} 
              className="rounded-full bg-[#EAE6DA] p-1" // Petit fond crème pour qu'il ressorte bien
            />
          </div>
          <h1 className="text-3xl font-bold text-[#EAE6DA] mb-2 tracking-widest">TAFSUT</h1>
          <p className="text-[#EAE6DA]/70">Retrouvez la lumière.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-[#EAE6DA]/80 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#EAE6DA]/50">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="exemple@email.com"
                className="w-full pl-10 p-3 rounded-xl bg-[#2F3A4A] border border-white/10 text-[#EAE6DA] focus:outline-none focus:border-[#EAE6DA] focus:ring-1 focus:ring-[#EAE6DA] transition placeholder-[#EAE6DA]/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAE6DA]/80 mb-2">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#EAE6DA]/50">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 p-3 rounded-xl bg-[#2F3A4A] border border-white/10 text-[#EAE6DA] focus:outline-none focus:border-[#EAE6DA] focus:ring-1 focus:ring-[#EAE6DA] transition placeholder-[#EAE6DA]/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#EAE6DA] hover:bg-white text-[#2F3A4A] font-bold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Se connecter <ArrowRight size={20} /></>}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-[#EAE6DA]/60">
  Pas encore membre ?{' '}
  <span className="text-white font-bold cursor-pointer hover:underline" onClick={() => router.push('/signup')}>
    S'inscrire
  </span>
</p>

      </div>
    </div>
  );
}