
import typography  from '@tailwindcss/typography';

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#06060A",
        "bg-elevated": "#0C0C12",
        panel: "#111118",
        panel2: "#18181F",
        border: "rgba(255, 255, 255, 0.06)",
        text: "#F0F0F5",
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.55)",
          foreground: "rgba(255, 255, 255, 0.35)"
        },
        accent: "#00D4FF",
        primary: "#3B82F6",
        ai: "#00D4FF",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        secondary: "#7C3AED",
        background: "#06060A"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { xl: "14px", "2xl": "18px" },
      boxShadow: {
        glow: "0 0 40px rgba(0, 212, 255, 0.15), 0 0 80px rgba(0, 212, 255, 0.05)",
        "glow-strong": "0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.15)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.4)"
      }
    }
  },
  plugins: [typography]
};
