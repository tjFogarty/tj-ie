const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.njk', './src/**/*.md', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)'
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
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addBase }) {
      addBase({
        ':root': {
          '--color-primary': '#ff5470',
          '--color-secondary': '#3b3c36',
          '--color-tertiary': '#c4c3d0',
        }
      })
    })
  ]
}

