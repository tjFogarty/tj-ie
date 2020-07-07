---
title: "Upgrading to webpack 4"
description: "Moving from Laravel Mix to webpack 4, and the performance benefits."
date: 2018-05-12T21:48:00+01:00
permalink: "/upgrading-to-webpack-4/"
layout: layouts/post.njk
tags:
- javascript
---

It's no big secret that I love {% external-link "https://github.com/JeffreyWay/laravel-mix/", "Laravel Mix" %}. It's handy enough to throw into most projects, and I had been using it with WordPress sites for a long while as it made onboarding new devs a lot easier. Babel and Sass? Done.

``` js
mix.js('src/app.js', 'dist/').sass('src/app.scss', 'dist/');
```

It abstracts away all the webpack wizardry so you can spend less time setting up. It's an amazing tool and I have no problem recommending it to people. You can inject your own configuration if you need to extend it as well so you're not locked out of anything.

On the flipside I'm a divil for tinkering, so a one-liner is not conducive to my mischief. After seeing the victories achieved by the webpack team on version 4 I was eager to explore it, plus Laravel Mix is on webpack 3 ({% external-link "https://github.com/JeffreyWay/laravel-mix/pull/1495", "soon to be version 4 by the looks of it" %}).

Here's the list of things I needed to do:

- Transpile my JS
- Handle styles written in Less
- Use PostCSS for Tailwind
- Output styles to a separate file
- Generate a service worker
- Minify assets for production

## Setup

The start of my config loads the packages I need, and I capture the mode we're in (development or production). I'll then use this mode later to update the config with any production-specific actions. For context, `webpack.config.js` sits at the root of my project, with source files and final assets living in a `web` folder.


``` js
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')

let env = process.env.NODE_ENV
let isDev = env === 'development'
```

## General Configuration

### JavaScript

This part took a bit of tweaking to get my paths right for code splitting and correctly loading chunks from the correct url, but in the end I settled on:


``` js
const WEBPACK_CONFIG = {
  mode: env, // development or production
  entry: {
    main: './web/src/js/main.js'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'web'),
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunks/[name].js'
  }
}
```

I needed to set the `publicPath` to `/` so the chunks would load correctly, but beyond that there's enough there to handle everything else.

### Styles

Styles took a bit of playing around with, turns out I'm a fool and didn't read the instructions on where to place the `less-loader` plugin. I got there in the end though, so the updated config looks like this:


``` js
const WEBPACK_CONFIG = {
  mode: env,
  entry: {
    main: './web/src/js/main.js',
    styles: './web/src/less/app.less'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'web'),
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunks/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/app.css'
    })
  ]
}
```

I updated the `entry` object for my styles, and added rules for dealing with `less` files. Finally I added the `MiniCssExtractPlugin` to point the output into my assets folder.

#### Tailwind

To get Tailwind working I added a `postcss.config.js` file to my project containing:

``` js
module.exports = {
  plugins: [require('tailwindcss')('./tailwind.js')]
}
```

The `tailwind.js` reference being my configuration file.

### Miscellaneous

Another thing I wanted to do was clear out the assets folder on each run in case I added some extra files, like unnamed chunks so I didn't have a folder full of `1..n.js` files.

For that I appended the following to the plugins array:


``` js
new CleanWebpackPlugin(['web/assets'])
```

## Production-only

### Minify

I only wanted to minify in production, so with that I added a condition to append to the webpack if it wasn't in development mode:


``` js
// `isDev` is set up earlier to check if process.env.NODE_ENV === 'development'
if (!isDev) {
  WEBPACK_CONFIG.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}
```

### Service Worker

I'll be honest, this is something that I still need to work on if I want to go full on PWA. I'm using {% external-link "https://github.com/GoogleChrome/workbox", "Workbox" %} to help with this.

So still inside the `if (!isDev)` block I added:


``` js
WEBPACK_CONFIG.plugins.push(
  new workboxPlugin.InjectManifest({
    swSrc: './web/src/js/sw.js',
    swDest: 'sw.js'
  })
)
```

This compiles the service worker from this file:


``` js
workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
)

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources'
  })
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)
```

This caches images, JavaScript, and CSS. I really need to read up more on it.

## Wha' Happen?

In the end, running `npm run dev` went from taking 6 seconds to 2.5 seconds, and `npm run production` dropped from 14 seconds to 4. Absolutely fantastic gains there, and a testament to the fine work those smart folks do working on webpack. This was more of a learning experience to get closer to the metal as it were, and I'll continue tweaking and breaking things because it's my site. Better I do it here than at work. I'll only have myself to answer to, and I'm my own harshest critic.

You find the final file in {% external-link "https://github.com/tjFogarty/personal-site/blob/d78ab16e826a36dcd8fee28bf81f33acc417e529/webpack.config.js", "my repo for this site" %}.
