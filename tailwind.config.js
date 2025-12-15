/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#dfe9ff',
          200: '#bcd6ff',
          300: '#92bdff',
          400: '#5f9eff',
          500: '#2563eb',
          600: '#1e40af',
          700: '#17337f',
          800: '#10264f',
          900: '#0b172c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card-lg': '0 8px 30px rgba(2,6,23,0.12)'
      }
    },
  },
  plugins: [],
}