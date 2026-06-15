import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        charcoal: "#0F172A",
        brandBlue: "#1E40AF",
        gold: "#F59E0B",
        goldLight: "#FDE68A",
        offwhite: "#FAFAFA",
        teal: "#14B8A6",
        vault: {
          950: "#050810",
          900: "#0a0e1a",
          800: "#111827",
        },
        cyanGlow: "#22D3EE",
        violetGlow: "#A78BFA",
        emeraldGlow: "#34D399",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "vault-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.15), transparent), linear-gradient(180deg, #0a0e1a 0%, #050810 100%)",
        "trade-gradient":
          "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(245,158,11,0.14), transparent), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(34,211,238,0.06), transparent), linear-gradient(180deg, #0a0e1a 0%, #050810 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;