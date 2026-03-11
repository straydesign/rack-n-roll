import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        charcoal: "#1A1A1A",
        green: {
          DEFAULT: "#1A7A3A",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
          950: "#052e16",
        },
        darkgreen: "#145C2C",
        amber: {
          DEFAULT: "#C4841D",
          400: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        aurora: "aurora-shift 60s linear infinite",
      },
      keyframes: {
        "aurora-shift": {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
