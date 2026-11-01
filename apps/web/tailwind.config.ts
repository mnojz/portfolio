import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: "#f3f8f3",
          100: "#e3f0e3",
          200: "#c7e1c8",
          300: "#9ec9a0",
          400: "#70aa74",
          500: "#4e8e52",
          600: "#3d7340",
          700: "#325c35",
          800: "#2b4a2d",
          900: "#243d26",
          950: "#0f2011",
        },
        parchment: {
          50: "#faf8f4",
          100: "#f5f0e6",
          200: "#ebe1cc",
          300: "#dfcfa9",
          400: "#d1ba83",
          500: "#c3a562",
          600: "#b49052",
          700: "#967543",
          800: "#7b5f39",
          900: "#654e31",
          950: "#382917",
        },
        wood: {
          light: "#A0714E",
          DEFAULT: "#7A4E2B",
          dark: "#523218",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        cottage: "0 10px 25px -5px rgba(43, 74, 45, 0.2), 0 8px 10px -6px rgba(43, 74, 45, 0.15)",
        parchment: "0 12px 30px -10px rgba(82, 50, 24, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;

