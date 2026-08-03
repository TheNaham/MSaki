import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mahb: {
          gray: "#E6E4E0",
          red: "#F7D6D5",
          orange: "#F9E0C8",
          yellow: "#FBF0C4",
          green: "#DCEED2",
          blue: "#D6E8F5",
          navy: "#D8DCF0",
          purple: "#E7DBF2",
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
