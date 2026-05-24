import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C89B3C",
          dark: "#8F6A1F"
        },
        ink: "#1A1A1A",
        paper: "#FAF7F0",
        denim: "#2F4858",
        clay: "clay"
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"]
      }
    }
  },
  plugins: []
} satisfies Config;
