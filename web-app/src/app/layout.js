import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TAFSUT",
  description: "Votre lumière vers le rétablissement",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        {/* 2. Ajoutez le script Umami ici */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="8e4cd25e-2791-4e6d-abcc-58ee21ebfa1e"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
