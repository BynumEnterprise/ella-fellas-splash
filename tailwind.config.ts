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
          // Darkened from #8F6A1F (4.3:1 on tinted cards) to pass WCAG AA everywhere.
          dark: "#7D5C14"
        },
        ink: "#1A1A1A",
        paper: "#FAF7F0",
        denim: "#2F4858",
        clay: "#A14A30"
      },
      // a11y (WCAG AA 4.5:1): brand gold #C89B3C is only 2.4:1 on paper and
      // 3.75:1 on denim, so gold TEXT resolves per surface through a CSS var set
      // in app/globals.css: bronze #7D5C14 on light surfaces (5.7:1 on paper),
      // light gold #DCB560 inside .bg-denim / .bg-ink / .on-dark (4.9:1 on
      // denim). bg-primary / border-primary / fill-primary keep the brand gold.
      textColor: {
        primary: {
          DEFAULT: "rgb(var(--ef-gold-text) / <alpha-value>)"
        }
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
