---
title: "Image Parallax and Blur with Tornis"
description: "Using the Tornis library to create a parallax and blur effect on a cover image while scrolling."
date: 2019-05-28T11:19:05+01:00
permalink: "/image-parallax-and-blur-with-tornis/"
layout: layouts/post.njk
tags:
  - javascript
---

**Update:** Probably best to leave out the blur for larger things, as it _destroys_ performance on Firefox. The transform still works well.

I updated my site recently and wanted to put a bit more focus on images. To do that, I included a space for cover images in articles. They take up a chunk of the top of the page, and I'll probably re-think this approach at some stage. Maybe I'll overlay the title and description over the image...

I wanted to include a bit of pizazz, and the image was the prime candidate. That's when I remembered {% external-link "https://tornis.robbowen.digital/", "Tornis" %}, a library that lets you respond to changes in the viewport. I wanted it for the scroll position monitoring, and while I can add an event listener to `window` and do the same thing, I'm thinking of a few other use-cases for this library, so I figured why not give it a go.

Here's a stripped down version of the code I used on my site. In reality, I'm checking for the existence of the cover image before kicking anything off. I followed the examples on the Tornis site to get here.

``` js
const { watchViewport } = tornis
const coverImage = document.querySelector('.js-cover-image')

const updateValues = ({ scroll }) => {
  if (scroll.changed) {
      let scrollOffset = scroll.top / coverImage.clientHeight

      scrollOffset = scrollOffset < 0 ? 0 : scrollOffset
      scrollOffset = scrollOffset > 1 ? 1 : scrollOffset
      document.body.style.setProperty('--scrollY', scrollOffset)
    }
}

watchViewport(updateValues)
```

I'm checking to see if we've scrolled past the cover image and setting a value between 0 and 1 in the `scrollY` custom property. With this custom property, I'm setting the `filter` and `transform` property of the custom image.

I'm also using `position: sticky` so the image travels down the page with us.

``` css
.cover-image {
  position: sticky;
  top: 0;
  height: 240px;
  overflow: hidden;
  filter: blur(calc(var(--scrollY) * 10px));
  transform: translate(0, calc(var(--scrollY) * -30px));
}
```

For the blur, I'm multiplying `scrollY` by 10 pixels. So when `scrollY` is `0.3` that'll evaluate to a `3px` blur. The transform behaves in the same fashion so that it slowly crawls in the opposite direction of the scroll.

You can probably think of more creative uses, for example, the amazing forest scrolling on the Tornis homepage.

<p class="codepen" data-height="474" data-theme-id="dark" data-default-tab="result" data-user="tjFogarty" data-slug-hash="qGyqwa" style="height: 474px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Tornis Parallax and Blur Demo">
  <span>See the Pen <a href="https://codepen.io/tjFogarty/pen/qGyqwa/">
  Tornis Parallax and Blur Demo</a> by T.J. Fogarty (<a href="https://codepen.io/tjFogarty">@tjFogarty</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
