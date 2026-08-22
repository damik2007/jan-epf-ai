import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sovereign: {
          darkest: "#001226",
          navy: "#002147",
          light: "#0A3161",
          accent: "#1A4B8C",
        },
        saffron: {
          DEFAULT: "#FF9933",
          light: "#FFB366",
          dark: "#E67E17",
        },
        samriddhi: {
          gold: "#D4AF37",
          light: "#FDF4DC",
          bright: "#F59E0B",
        },
        epf: {
          green: "#10B981",
          emerald: "#059669",
          slate: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        }
      },
      fontSize: {
        "senior-base": "1.125rem",
        "senior-lg": "1.35rem",
        "senior-xl": "1.65rem",
        "senior-2xl": "2.1rem",
      }
    },
  },
  plugins: [],
};
export default config;
