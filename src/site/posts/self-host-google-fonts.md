---
title: "Self-Host Google Fonts"
description: "Self-hosting Google Fonts gives you more control over performance and loading of your fonts."
date: 2019-06-09T13:17:24+01:00
permalink: "/self-host-google-fonts/"
layout: layouts/post.njk
---

A tool I use a lot is {% external-link "https://google-webfonts-helper.herokuapp.com/fonts", "Google Webfonts Helper" %}. I download the fonts and host them myself, which I kinda like cause I have more control over the files. Part of my webpack setup involves creating a service worker, so it's minimal effort to add them in there.

I was doing this before Google allowed you to use `font-display`, so there was that advantage for a while.

I can use `rel="preload"` as well to help speed things up:

``` html
<link rel="preload" href="/fonts/pt-sans-v10-latin-regular.woff2" as="font" crossorigin>
<link rel="preload" href="/fonts/pt-serif-v10-latin-700.woff2" as="font" crossorigin>
<link rel="preload" href="/fonts/pt-serif-v10-latin-regular.woff2" as="font" crossorigin>
```

10/10 from me. {% external-link "https://github.com/majodev/google-webfonts-helper", "You can see the source and contribute on GitHub." %}
