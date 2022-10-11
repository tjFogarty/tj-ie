---
title: "Autogenerate Post Thumbnails"
description: "Writing a script to automatically create post thumbnails"
date: 2022-09-19T10:23:00+01:00
permalink: "/autogenerate-post-thumbnails/"
eleventyExcludeFromCollections: true
layout: layouts/post.njk
---

I put together a local system to generate thumbnails for my posts. No modern tooling, just some old fashioned scripting.

## Generating Data

The first thing I to do is to find all the markdown files for my site, and parse the frontmatter for the title and slug. The title will be displayed in the thumbnail, and the slug will be used as an identifier to name the output file. So we'll have an array of these:

``` js
{
  title: 'Autogenerate Post Thumbnails',
  slug: 'autogenerate-post-thumbnails'
}
```



<img src="/assets/social/autogenerate-post-thumbnails.png" alt="Post thumbnail preview" lazy />