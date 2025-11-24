/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        surface: '#1a1f3a',
        primary: '#6366f1',
        secondary: '#a855f7',
      },
    },
  },
  plugins: [],
}
