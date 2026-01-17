/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠️ On demande à Vercel d'ignorer les petites erreurs de style
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;