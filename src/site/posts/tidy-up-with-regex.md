---
title: "Tidy Up with Regex"
description: "Using regex to quickly tidy up all the areas in my site where I'm using a shortcode instead of markdown links."
date: 2024-04-17T12:20:38.000+01:00
permalink: "/tidy-up-with-regex/"
layout: layouts/post.njk
coverPreview: regex.png
cover: "https://tj.ie/assets/images/regex.png"
tags:
- regex
---

Something had been bugging me for a while; I had a legacy shortcode that would render external links, when really I wanted to use markdown to improve portability. Hundreds of instances lurked within dozens of markdown files, waiting for the day where I update my site and they all break.

I've also changed my position on external links. I want to let the user and browser decide on how links should behave. It's none of my business what you prefer, so have at it.

Turns out, it was a relatively straight forward process. Using VS Code, I used the following find and replace:

Find:

``` bash
{% raw %}
\{% external-link "(.*?)", "(.*?)" %\}
{% endraw %}
```

Replace:

``` bash
[$2]($1)
```

I say _relatively_ straight forward, but really it was a lot of searching and refining. At the end of it all, the meaning of the regex has floated out of my head. I suppose that's how it's meant to be. It's the same with markdown links. Circle then square, right? Or is it square then... maybe I'll just make a shortcode.
