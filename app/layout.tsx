import React from 'react';
import "./globals.css";
import { Inter,Space_Grotesk,JetBrains_Mono } from 'next/font/google';
import { ToastContainer } from '@/components/ui/Toast';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';

// Font configuration
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
    default: "NomosX — The Autonomous Think Tank",
    template: "%s | NomosX"
  },
  description: "8 AI researchers analyze 250M+ academic publications and deliver source-grounded strategic analysis in 60 seconds. From research to strategic decision.",
  keywords: ["think tank", "AI", "artificial intelligence", "academic research", "strategic analysis", "decision intelligence", "autonomous research"],
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
    locale: 'en_US',
    siteName: 'NomosX',
    title: 'NomosX — The Autonomous Think Tank',
    description: '8 AI researchers analyze 250M+ academic publications and deliver source-grounded strategic analysis in 60 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NomosX — The Autonomous Think Tank',
    description: '8 AI researchers analyze 250M+ academic publications and deliver source-grounded strategic analysis in 60 seconds.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
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
