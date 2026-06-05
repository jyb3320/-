import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        line: "#e5e7eb",
        paper: "#ffffff",
        muted: "#f7f7f5",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
