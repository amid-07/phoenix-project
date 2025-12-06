/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#2F3A4A", // Bleu Ardoise Foncé (Fond)
        surface: "#59647A",    // Bleu Gris (Cartes)
        primary: "#EAE6DA",    // Crème (Texte / Boutons importants)
        
        // Couleurs fonctionnelles
        accent: "#4ECDC4",     // Vert
        danger: "#FF6B6B",     // Rouge
        warning: "#FFD93D",    // Jaune
      },
    },
  },
  plugins: [],
};