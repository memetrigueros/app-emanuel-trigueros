import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#047857",
          hover: "#065f46",
        },
        secondary: {
          DEFAULT: "#1f2937",
          hover: "#111827",
        },
        accent: "#d4af37",
        textPrimary: "#ffffff",
        borderPrimary: "#374151",
        badge: "#dc2626",
      },
    },
  },
  plugins: [],
};

export default config;