import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Georgia", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        open: ["'Open Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
