/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#c30005',
        'secondary': '#d26e4b'
      },
      boxShadow: {
        'shadowPrimary': 'inset 0 0 0 100px rgba(0,0,0,0.2)',
      }
    }
  },
  plugins: [],
}

