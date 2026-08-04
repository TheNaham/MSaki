import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maxincome: {
          bg: "#F7F6F2",
          card: "#FFFFFF",
          line: "#E4E1D8",
          accent: "#0F6B4C",
          gold: "#B9924F",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
