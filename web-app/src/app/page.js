'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ⚠️ LOCALHOST
  const API_URL = process.env.NEXT_PUBLIC_API_URL; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const data = await response.json();

      if (data && data.id) {
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        router.push('/dashboard');
      } else {
        setError(data.message || "Identifiants incorrects.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-primary">
      
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-2xl border border-white/10">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-widest">TAFSUT</h1>
          <p className="text-primary/70">Retrouvez la lumière.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-primary/80 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/50">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="exemple@email.com"
                className="w-full pl-10 p-3 rounded-xl bg-background border border-white/10 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition placeholder-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 mb-2">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/50">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 p-3 rounded-xl bg-background border border-white/10 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition placeholder-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-white text-background font-bold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Se connecter <ArrowRight size={20} /></>}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-primary/60">
          Pas encore membre ?{' '}
          <span className="text-white font-bold cursor-pointer hover:underline" onClick={() => alert("Utilisez l'app mobile pour vous inscrire.")}>
            S'inscrire
          </span>
        </p>

      </div>
    </div>
  );
}