/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#c30005',
        'secondary': '#d26e4b',
        'bgPrimary': '#1f2028',
      },
      boxShadow: {
        'shadowPrimary': '0 2px 3px -2px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.24)',
        'shadowHover': '0 4px 10px -4px rgba(0,0,0,0.16), 0 4px 10px rgba(0,0,0,0.23)',
        'shadowAuth': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'shadowAccount': '0 15px 30px 0 rgba(0, 0, 0, 0.2)',
        'shadowSearch': 'inset 0 -1.4em 1em 0 rgba(0,0,0,0.02)'
      },
      animation: {
        'showSignUp': 'show 0.6s',
      },
    }
  },
  plugins: [],
}
