/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: { colors: {
      primary: '#1d4ed8',   // آبی رسمی
      secondary: '#f1f5f9', // خاکستری خیلی روشن
      accent: '#f59e0b',    // زرد پرانرژی
    },},
  },
  plugins: [],
}

