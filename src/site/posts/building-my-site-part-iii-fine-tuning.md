---
title: "Building My Site Part III: Fine Tuning"
description: "Final tweaks and performance improvements for my website."
date: 2018-01-08T15:57:00+00:00
permalink: "/building-my-site-part-iii-fine-tuning/"
layout: layouts/post.njk
tags:
- javascript
- css
---

After [making some decisions](/building-my-site-part-i-decisions/) and [implementing them](/building-my-site-part-ii-setup), it's now time to tidy a few things up and improve on performance. I'm going to talk about the ways in which I've improved the loading of fonts, CSS and JavaScript.

## Fonts

I previously read an article called {% external-link "https://www.zachleat.com/web/23-minutes/", "23 Minutes of Work for Better Font Loading" %} and it's a brilliant piece of work outlining the ways in which font loading can be improved. I didn't follow <em>every</em> step, but the two I implemented really made a difference:

First, preloading the web fonts by putting these tags into the `<head>` of my site:

``` html
<link rel="preload" href="/fonts/raleway.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/playfair.woff2" as="font" type="font/woff2" crossorigin>
```

Secondly, adding those fonts to my service worker using the {% external-link "https://github.com/goldhand/sw-precache-webpack-plugin", "SW Precache Webpack Plugin" %}.

## CSS

I opted to use the {% external-link "https://tailwindcss.com/", "Tailwind CSS Framework" %} to style my site. I found it a great way to throw a bunch of classes on my elements to rapidly style them, and abstract them out into their own classes once I was happy with them.

If you have a look around, you might notice that there isn't a whole lot of style here. That may change in the future, but it also reminded me of {% external-link "https://csswizardry.com/", "Harry Roberts'" %} website where he inlined his styles within the `<head>` of his site rather than using a `<link>` tag.

Fair enough, but there's a lot of CSS being pulled in with Tailwind that wouldn't make sense to include. I'd only be needlessly increasing the weight of my page. Thankfully the author of this framework {% external-link "https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css-with-purgecss", "has a solution!" %} {% external-link "https://github.com/FullHuman/purgecss", "PurgeCSS" %} to the rescue:

``` js
// webpack.mix.js file
const mix = require('laravel-mix')
const tailwindcss = require('tailwindcss')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')

// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g)
  }
}

if (mix.inProduction()) {
  mix.webpackConfig(
      plugins: [
        new PurgecssPlugin({
          // Specify the locations of any files you want to scan for class names.
          paths: glob.sync([
            path.join(__dirname, 'templates/**/*.twig'),
            path.join(__dirname, 'web/assets/**/*.js')
          ]),
          extractors: [
            {
              extractor: TailwindExtractor,

              // Specify the file extensions to include when scanning for
              // class names.
              extensions: ['html', 'js', 'php', 'twig']
            }
          ]
        })
      ]
  )
}
```

This scans through template and JavaScript files, and strips out any classes that are not being used.

In `layouts/default.twig` I inline it using the Craft Mix plugin:

``` twig
{{ mix('/assets/css/app.css', true, true) | raw }}
```

## JavaScript

There's some JavaScript on my site that isn't required to be loaded with every single page, those being {% external-link "https://highlightjs.org/", "highlight.js" %} and {% external-link "https://github.com/algolia/algoliasearch-client-javascript", "Algolia Search" %}. Not every page requires syntax highlighting, and not everyone will click the search icon, so I needed a way to only load them when it was necessary. I did this with {% external-link "https://github.com/algolia/algoliasearch-client-javascript", "Dynamic Imports" %} and some tweaking of my `webpack.mix.js` file.

When I was first using it, the chunks that were created were either dropped into the wrong directory, or the path they were loaded from were incorrect. Here's what I added to my configuration to correct it:

``` js
mix.webpackConfig({
  output: {
    path: path.resolve(__dirname, 'web'),
    publicPath: '/',
    chunkFilename: 'assets/js/chunks/[name].js'
  }
})
```

Let's look at syntax highlighting first. I wanted to check if a page had code on it, and load the library in if it did.

``` js
if (document.querySelector('pre')) {
    try {
      let hljs = await System.import(
        /* webpackChunkName: "hljs" */ 'highlight.js'
      )
      hljs.initHighlightingOnLoad()
    } catch (e) {
      console.log('Error loading highlight.js', e)
    }
}
```

Using the comment `/* webpackChunkName: "hljs" */` I could specify the name of the generated file. Otherwise you'd end up with files called `0.js`, `1.js` etc&#8230;
Next up is the search. I've stripped out most of the interaction code here, and left in the loading of the required library:

``` js
import { env } from './utils'

export const Search = {
  trigger: document.querySelectorAll('.js-search'),
  index: null,

  init() {
    this.handleTriggerClick = this.handleTriggerClick.bind(this)

    this.trigger.forEach(trigger => {
      trigger.addEventListener('click', this.handleTriggerClick)
    })
  },

  handleTriggerClick(e) {
    e.preventDefault()
    this.loadSearchClient()
  },

  async loadSearchClient() {
    try {
      let algoliasearch = await System.import(
        /* webpackChunkName: "search" */ 'algoliasearch/lite'
      )

      let client = algoliasearch(
        'applicationId',
        'apiKey'
      )
      this.index = client.initIndex(
        env() === 'development' ? 'dev_posts' : 'prod_posts'
      )
    } catch (e) {
      console.log('Error loading search client', e)
    }
  }
}
```

I have an index for my local development version, and the production version. I have a function called `env` which helps me with which environment I'm in:

``` js
export const env = () => {
  return process && process.env && process.env.NODE_ENV
    ? process.env.NODE_ENV
    : null
}
```

## Is it finished?

After all this, I have a deployment script that runs `npm run production` which minifies my assets, generates a service worker, and strips out unused CSS classes. Coupled with the font loading techniques I have a zippy little site.

There's more I can do, however. Maybe there are smaller libraries out there that I can swap in, or some optimisations I can make to my artisanal, hand-rolled code. I could add the JavaScript to the service worker, though I have cache-invalidation trust issues that I need to work through first.

Until then, you can see the {% external-link "https://github.com/tjFogarty/personal-site", "source code for this site" %} as it stands today.
