const { DateTime } = require('luxon')
const fs = require('fs')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const htmlmin = require('html-minifier')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.addShortcode('external-link', function(href, content) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${content}</a>`
  })

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
    }

    return content
  })

  eleventyConfig.addShortcode("cloudinary", function(
    src,
    alt,
    sizes = '(min-width: 922px) 900px, 100vw',
    srcsetWidths = [400, 600, 700, 800, 900, 1000],
    defaultWidth = 600,
  ) {
    const baseUrl = 'https://res.cloudinary.com/dab4jaczr'
    const srcs = srcsetWidths.map(w => {
      return `${baseUrl}/image/upload/w_${w},f_auto,q_auto/v1536498344/${src} ${w}w`
    }).join(', ')
    return `<img
        src="${baseUrl}/image/upload/w_${defaultWidth},f_auto,q_auto/v1536498344/${src}"
        sizes="${sizes}"
        srcset="${srcs}"
        alt="${alt}"
        loading="auto"
      />
    `
  })

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('dd LLL yyyy')
  })

  eleventyConfig.addFilter('year', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy')
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd')
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if( n < 0 ) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  eleventyConfig.addCollection('tagList', require('./src/site/_11ty/getTagList'))

  eleventyConfig.addPassthroughCopy('./src/site/assets')
  eleventyConfig.addPassthroughCopy('./src/site/favicon.ico')
  eleventyConfig.addPassthroughCopy('./robots.txt')
  eleventyConfig.addPassthroughCopy('./keybase.txt')
  eleventyConfig.addPassthroughCopy('./googlea2c3a0ad5b2401f7.html')
  // eleventyConfig.addPassthroughCopy('sw.js')
  // eleventyConfig.addPassthroughCopy('sw.js.map')
  // eleventyConfig.addPassthroughCopy('workbox-*')

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

  // Browsersync Overrides
  // eleventyConfig.setBrowserSyncConfig({
  //   callbacks: {
  //     ready: function(err, browserSync) {
  //       const content_404 = fs.readFileSync('_site/404.html')

  //       browserSync.addMiddleware('*', (req, res) => {
  //         // Provides the 404 content without redirect.
  //         res.write(content_404)
  //         res.end()
  //       })
  //     },
  //   },
  //   ui: false,
  //   ghostMode: false
  // })

  return {
    templateFormats: [
      'md',
      'njk',
      'html',
      'liquid'
    ],
    passthroughFileCopy: true,
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: 'src/site',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  }
}
