
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthProvider } from "@/hooks/useAuth";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
