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
        green: "#1A7A3A",
        darkgreen: "#145C2C",
        amber: "#C4841D",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
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
