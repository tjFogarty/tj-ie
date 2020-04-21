const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      browsers: 'last 2 versions',
      autoprefixer: { grid: true }
    }),
    purgecss({
      content: ['./posts/**/*.md', './_includes/**/*.*', './about/index.md', './*.njk'],
      variables: false
    }),
    require('cssnano')({
      preset: 'default',
    })
  ]
}
