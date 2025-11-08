import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(200, 94%, 13%)",
        foreground: "hsl(222.2, 84%, 4.9%)"
      }
    }
  },
  plugins: []
};
export default config;
