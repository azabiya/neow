/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'bebas': ['"Bebas Neue"'],
        'days': ['"Days One"', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary': '#FCAE06',
        'brand-red': '#FF5A5A',
        'brand-red-hover': '#E04A4A',
        'brand-dark': '#1A1A1A',
        'brand-gray': '#F2F2F2',
        'brand-gray-dark': '#A9A9A9',
        'brand-green': '#10B981',
      },
    },
  },
  plugins: [],
}