const purgecss = require('@fullhuman/postcss-purgecss')
const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  require('postcss-import'),
  require('tailwindcss'),
  require('postcss-preset-env')({
    browsers: 'last 2 versions'
  })
]

if (!isDev) {
  plugins.push(require('cssnano')({
    preset: 'default',
  }));
  plugins.push(purgecss({
    content: ['./posts/**/*.md', './_includes/**/*.*', './about/index.md', './*.njk'],
    variables: false,
    defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
  }));
}

module.exports = {
  plugins
}
