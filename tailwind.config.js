module.exports = {
  theme: {
    fontFamily: {
      sans: ['"Source Sans", sans-serif'],
      serif: ['"Georgia", serif']
    },
    extend: {
      colors: {
        // accent: '#c54545'
        accent: {
          100: '#FBE6F2',
          200: '#F5BFDF',
          300: '#EF99CC',
          400: '#E24DA6',
          500: '#D60080',
          600: '#C10073',
          700: '#80004D',
          800: '#60003A',
          900: '#400026',
        },
      }
    }
  },
  variants: {},
  verticalRhythm: {
    defaultLineHeight: 'loose',
    fontCapHeight: {
      // Calculated using https://codepen.io/sebdesign/pen/EKmbGL?editors=0011
      'default': 0.705,
      'Source Sans': 0.66
    },
    height: 0.5 // Vertical rhythm in rems
  },
  plugins: [
    require('tailwind-vertical-rhythm')
  ]
}
