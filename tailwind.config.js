/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0F172A',
        'primary': '#1E293B',
        'accent-teal': '#0D9488',
        'accent-orange': '#EA580C',
      },
    },
  },
  plugins: [],
}
