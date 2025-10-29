/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twilight: "#0d1117",
        amber: "#ffb347",
        sage: "#a3b18a",
        gold: "#ffd166",
        cream: "#fefae0",
      },
    },
  },
  plugins: [],
};

