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
        rose: {
          50: "#FFF5F7",
          100: "#FFE0E8",
          200: "#FFD6E0",
          300: "#FFB8C8",
          400: "#FF8FAB",
          500: "#FF6B8A",
        },
        serenity: {
          50: "#F0F9FF",
          100: "#D6F0FC",
          200: "#C5E8F7",
          300: "#A3D8F0",
          400: "#7CC5E8",
          500: "#5AB0DB",
        },
        lilac: {
          50: "#F8F4FC",
          100: "#EDE0F5",
          200: "#E8D5F5",
          300: "#D4B0EB",
          400: "#BF8FE0",
          500: "#A86AD4",
        },
        mint: {
          50: "#F2FBF2",
          100: "#DCF0DC",
          200: "#C8E6C9",
          300: "#A8D8A8",
          400: "#81C784",
          500: "#66BB6A",
        },
        cream: "#FEF9F5",
        paper: "#FFFDFC",
      },
      fontFamily: {
        sans: ["Quicksand", "system-ui", "sans-serif"],
        script: ["Dancing Script", "cursive"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
