const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const htmlmin = require('html-minifier')
const CleanCSS = require('clean-css')
const Image = require("@11ty/eleventy-img")

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/site/assets');
  eleventyConfig.addWatchTarget('./tailwind.config.js');

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

  async function photoThumbnailShortcode(
    src,
    alt = '',
    sizes = '(min-width: 800px) 225px, 100vw',
  ) {
    const metadata = await Image(`./src/site/assets/photos/${src}`, {
      widths: [250, 400],
      urlPath: '/assets/photos/',
      outputDir: './_site/assets/photos/',
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

  async function photoShortcode(
    src,
    alt = '',
    sizes = '(min-width: 1140px) 1140px, 100vw',
  ) {
    const metadata = await Image(`./src/site/assets/photos/${src}`, {
      widths: [600, 800, 1000, 1500],
      urlPath: '/assets/photos/',
      outputDir: './_site/assets/photos/',
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
  eleventyConfig.addNunjucksAsyncShortcode('photo', photoThumbnailShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('photolarge', photoShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);

  eleventyConfig.addNunjucksGlobal("socials", [
    { link: 'https://twitter.com/tj_fogarty', label: 'Twitter', icon: 'twitter' },
    { link: 'https://codepen.io/tjFogarty', label: 'CodePen', icon: 'codepen' },
    { link: 'https://github.com/tjFogarty/', label: 'GitHub', icon: 'github' },
    { link: 'https://www.linkedin.com/in/fogartytj/', label: 'LinkedIn', icon: 'linkedin' },
    { link: '/index.xml', label: 'RSS', icon: 'rss' }
  ]);

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk')

  eleventyConfig.addFilter('readableDate', dateObj => {
    return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  })

  eleventyConfig.addFilter('year', dateObj => {
    return dateObj.toLocaleDateString('en-GB', { year: 'numeric' });
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return dateObj.toISOString().split('T')[0];
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

  eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

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
