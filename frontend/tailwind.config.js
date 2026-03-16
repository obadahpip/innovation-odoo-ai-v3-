/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#714B67',
          'purple-dark': '#5a3a52',
          'purple-light': '#8a6380',
        }
      }
    },
  },
  plugins: [],
}
