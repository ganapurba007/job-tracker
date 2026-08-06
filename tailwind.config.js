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
        'primary-dark': '#224248',
        'primary': '#325E6A',
        'accent-teal': '#44A1A4',
        'accent-orange': '#FF9A00',
      },
    },
  },
  plugins: [],
}
