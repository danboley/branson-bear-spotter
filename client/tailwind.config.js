/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        main: "#84a650",
        secondary: "#cb9b4d",
        text: {
          dark: "#000000",
          light: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
