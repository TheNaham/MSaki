import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mi: {
          navy: "#0B1F3A",
          navy2: "#122A4C",
          line: "#DADFE6",
          ink: "#0B1F3A",
          muted: "#5B6779",
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
