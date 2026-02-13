import React from 'react';
import "./globals.css";
import { Inter,Space_Grotesk,JetBrains_Mono } from 'next/font/google';
import { ToastContainer } from '@/components/ui/Toast';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';

// Configuration des polices
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-secondary',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "NomosX — Think Tank Agentique",
    template: "%s | NomosX"
  },
  description: "10 agents IA analysent 28M+ publications académiques et génèrent des analyses multi-perspectives en 60 secondes. De la recherche à la décision stratégique.",
  keywords: ["think tank", "IA", "intelligence artificielle", "recherche académique", "analyse stratégique", "aide à la décision"],
  authors: [{ name: "NomosX" }],
  creator: "NomosX",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'NomosX',
    title: 'NomosX — The Autonomous Think Tank',
    description: '10 AI agents analyze 28M+ academic publications and generate multi-perspective analyses in 60 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NomosX — The Autonomous Think Tank',
    description: '10 AI agents analyze 28M+ academic publications and generate multi-perspective analyses in 60 seconds.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-primary">
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
