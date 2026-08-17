/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f0d",
        card: "#111a14",
        primary: "#00e676",
        secondary: "#69f0ae",
        warning: "#ff6d00",
        textPrimary: "#e8f5e9",
        textSecondary: "#a5d6a7",
      },
      borderRadius: {
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
