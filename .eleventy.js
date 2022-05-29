const { DateTime } = require('luxon')
const fs = require('fs')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const htmlmin = require('html-minifier')
const CleanCSS = require('clean-css')
const Image = require("@11ty/eleventy-img")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginNavigation)

  eleventyConfig.setLiquidOptions({ strictFilters: false })
  eleventyConfig.setLiquidOptions({ dynamicPartials: false })

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles
  })

  eleventyConfig.addShortcode('external-link', function (href, content) {
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

  async function imageShortcode(
    src,
    alt = '',
    sizes = '(min-width: 922px) 900px, 100vw',
    widths = [400, 600, 700, 800, 900, 1000]
  ) {
    const metadata = await Image(`./src/site/assets/images/${src}`, {
      widths,
      urlPath: '/assets/images/',
      outputDir: './_site/assets/images/',
    });

    const attrs = {
      alt,
      sizes,
      loading: 'lazy',
      decoding: 'async',
    }

    return Image.generateHTML(metadata, attrs, {
      whitespaceMode: "inline"
    });
  }
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk')

  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy')
  })

  eleventyConfig.addFilter('year', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy')
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  eleventyConfig.addCollection('tagList', require('./src/site/_11ty/getTagList'))

  eleventyConfig.addPassthroughCopy('./src/site/assets')
  eleventyConfig.addPassthroughCopy('./src/site/fonts')
  eleventyConfig.addPassthroughCopy('./src/site/favicon.ico')
  eleventyConfig.addPassthroughCopy('./src/site/robots.txt')
  eleventyConfig.addPassthroughCopy('./src/site/keybase.txt')
  eleventyConfig.addPassthroughCopy('./src/site/googlea2c3a0ad5b2401f7.html')

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: `
        <span aria-label="Jump to heading">#</span>
      `,
      placement: 'before',
      class: 'direct-link',
    }),
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

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
