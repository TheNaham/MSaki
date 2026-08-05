import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        se: {
          charcoal: "#14181F",
          panel: "#1D222B",
          line: "#333B48",
          gold: "#C9A24B",
          ink: "#EDEFF3",
          muted: "#9AA3B2",
          good: "#4C9A6B",
          risky: "#C25B4A",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        serif: ["'Noto Serif KR'", "'Playfair Display'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
