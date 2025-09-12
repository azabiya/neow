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
        'neow-blue': '#00C2FF',
        'neow-dark': '#1A1A1A',
        'neow-gray': '#F2F2F2',
        'neow-gray-dark': '#A9A9A9',
        'neow-green': '#10B981',
      },
    },
  },
  plugins: [],
}