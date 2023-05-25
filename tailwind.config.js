/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.njk', './src/**/*.md', './src/**/*.js'],
  theme: {
    fontFamily: {
      sans: ['"Source Sans 3"', 'sans-serif'],
    },
    container: {
      center: true,
      screens: {
        'sm': '100%',
        'md': '100%',
        'lg': '1024px',
        'xl': '1140px',
      },
      padding: '2rem',
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

