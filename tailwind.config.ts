import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atlas PMO Redesign — warm executive palette (docs/design/Atlas-PMO-Redesign.dc.html)
        emerald: {
          DEFAULT: "#1C7A56",
          deep: "#166647",
          soft: "#E7F1EC",
          tint: "#BCD6CB",
        },
        navy: {
          DEFAULT: "#17293D", // ink / headings / dark chips
          deep: "#0E2033", // sidebar background
          border: "#1D3349", // sidebar hairlines
          active: "#1A3450", // sidebar active item
          light: "#22374F",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#D9B23A",
          soft: "#F5EFDC",
          text: "#8A6D1C",
        },
        ink: "#17293D",
        muted: {
          DEFAULT: "#7A8699",
          dark: "#66707F",
          light: "#97A1B0",
        },
        offwhite: "#F6F4F0", // page background
        surface: "#FAF8F4", // inset tiles / hover rows
        track: "#EFECE5", // progress tracks / donut track
        line: {
          DEFAULT: "#E9E4DB", // card borders
          soft: "#F0EDE6", // inner row dividers
          input: "#E1DBD0", // input & ghost-button borders
        },
        // Semantic RAG status
        health: {
          green: "#1C7A56",
          amber: "#B07E14",
          amberdot: "#C9A227",
          red: "#BE3E32",
          redtext: "#A33228",
        },
      },
      fontFamily: {
        // Single professional UI family across the whole app (Inter).
        head: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "10px",
        lg: "14px", // cards per redesign
        xl: "20px",
      },
      boxShadow: {
        // Redesign: flat cards (border only); shadow reserved for hover lift.
        card: "none",
        hover: "0 2px 12px rgba(23,41,61,0.06)",
        sm: "0 1px 2px rgba(23,41,61,0.08)",
        DEFAULT: "0 10px 30px rgba(23,41,61,0.10)",
      },
      backgroundImage: {
        "grad-brand":
          "linear-gradient(135deg,#1C7A56 0%,#166647 45%,#0E2033 100%)",
        "grad-gold": "linear-gradient(135deg,#D9B23A 0%,#C9A227 100%)",
        "grad-navy": "linear-gradient(160deg,#0E2033 0%,#0E2033 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
