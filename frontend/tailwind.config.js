/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0e1726",
        elevated: "#16202f",
        card: "#1a2436",
        chip: "#1e2a3d",
        border: "#232f42",
        accent: "#17c9a3",
        "accent-dark": "#0fa889",
        dim: "#8b96a8",
        dimmer: "#5f6b7d",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
