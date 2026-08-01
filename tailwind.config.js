/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0b1220',
        accent: '#61dafb',
      },
    },
  },
  plugins: [],
};
