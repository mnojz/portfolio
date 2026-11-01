import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        moss: {
          50: "#f4f9f4",
          100: "#e6f2e6",
          200: "#cee5cf",
          300: "#a6d1a8",
          400: "#76b579",
          500: "#529856",
          600: "#3d7a41",
          700: "#326135",
          800: "#2a4d2c",
          900: "#234025",
        },
        parchment: {
          50: "#FCFAF7",
          100: "#F7F3EC",
          200: "#EFE8DC",
          300: "#E3D7C3",
          400: "#D4C2A5",
          500: "#C0AA88",
          600: "#A9926E",
          700: "#8C7756",
          800: "#705E44",
          900: "#5B4D38",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
      },
    },
  },
  plugins: [],
};
export default config;
