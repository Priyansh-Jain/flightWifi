import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        verdictFast: "#0f7a3d",
        verdictOk: "#1a5fb4",
        verdictPart: "#9a6400",
        verdictNone: "#b3261e"
      }
    }
  },
  plugins: []
} satisfies Config;
