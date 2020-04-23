module.exports = {
  theme: {
    fontFamily: {
      sans: ['"Source Sans Pro"', 'system-ui', '-apple-system', '"Segoe UI"', '"Roboto"', '"Ubuntu"', '"Cantarell"', '"Noto Sans"', 'sans-serif']
    },
    extend: {
      colors: {
        accent: '#c54545'
      }
    }
  },
  variants: {},
  verticalRhythm: {
    defaultLineHeight: 'loose',
    fontCapHeight: {
      // Calculated using https://codepen.io/sebdesign/pen/EKmbGL?editors=0011
      'default': 0.705,
      'Source Sans Pro': 0.66
    },
    height: 0.5 // Vertical rhythm in rems
  },
  plugins: [
    require('tailwind-vertical-rhythm')
  ]
}
