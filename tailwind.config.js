
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        panel: "#111113",
        panel2: "#18181B",
        border: "rgba(255, 255, 255, 0.1)",
        text: "#FFFFFF",
        muted: "rgba(255, 255, 255, 0.6)",
        accent: "#22D3EE",
        primary: "#3B82F6",
        ai: "#22D3EE",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      borderRadius: { xl: "14px", "2xl": "18px" },
      boxShadow: {
        glow: "0 0 0 1px rgba(94,234,212,0.25), 0 0 20px rgba(94,234,212,0.10)",
        card: "0 0 0 1px rgba(35,40,51,1), 0 8px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: [typography]
};
