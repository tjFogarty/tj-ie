const purgecss = require('@fullhuman/postcss-purgecss')
const mode = process.env.ELEVENTY_ENV || 'development'
const isDev = mode === 'development'

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
    content: ['./src/site/posts/**/*.md', './src/site/_includes/**/*.*', './src/site/about/index.md', './src/**/*.njk'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  }));
}

module.exports = {
  plugins
}
