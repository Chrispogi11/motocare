/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Chillax', 'sans-serif'],
        body: ['Switzer', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          light: '#4ade80',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
      },
    },
  },
  plugins: [],
};
