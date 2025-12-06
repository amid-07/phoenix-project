'use client';
import { useRouter } from 'next/navigation';

export default function CrisisPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center w-full max-w-3xl">
        <h1 className="text-6xl font-bold text-danger mb-8 tracking-widest">URGENCE</h1>
        <p className="text-2xl text-primary mb-12 font-light">
          Ne faites rien. Respirez.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface p-8 rounded-2xl border-2 border-danger/50 shadow-[0_0_30px_rgba(255,107,107,0.2)]">
            <h3 className="text-2xl font-bold text-accent mb-4">Technique 4-7-8</h3>
            <p className="text-gray-200 text-lg">Inspirez (4s)<br/>Bloquez (7s)<br/>Expirez (8s)</p>
          </div>
          <div className="bg-surface p-8 rounded-2xl border-2 border-danger/50 shadow-[0_0_30px_rgba(255,107,107,0.2)]">
            <h3 className="text-2xl font-bold text-warning mb-4">Choc Froid</h3>
            <p className="text-gray-200 text-lg">Buvez un grand verre d'eau glacée ou passez de l'eau froide sur votre visage.</p>
          </div>
        </div>

        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white underline text-lg"
        >
          Je me sens mieux, retour
        </button>
      </div>
    </div>
  );
}