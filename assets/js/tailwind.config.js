/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/components/*.html", "./assets/js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          gold: '#D4AF37',
          dark: '#0A0A0A',
          light: '#FAFAFA'
        }
      }
    }
  },
  plugins: [],
}
