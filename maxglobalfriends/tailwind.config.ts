import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mgf: {
          blue: "#0A66C2",
          blue2: "#004182",
          ink: "#1B1F23",
          line: "#DCE6F1",
          muted: "#5E6B7A",
          bg: "#F3F6F8",
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
