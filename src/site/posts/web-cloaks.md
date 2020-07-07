---
title: "Web Cloaks"
description: "A few observations on techniques that are used to disguise a problem with a website."
date: 2019-05-19T19:47:18+01:00
permalink: "/web-cloaks/"
layout: layouts/post.njk
---

Over the years I've noticed a few things that have been used to cover over issues with a website. I've done a few of these myself due to design requests, time restraints, client feedback/requests, and just not knowing any better. I'm not saying anyone who does these doesn't know what they're doing - we can't always know the reasons, so it's better to assume good intent.

## Loading Screens

In the days of Flash, you'd have a pretty sweet loading screen. These days loading screens are usually reserved for games or large interactive experiences that require all assets to be loaded in order to give the right experience.

When I see this for websites it sets off some alarm bells. It might be based on waiting for images or fonts to load. I've seen other times where it's determined by a `setTimeout` that hopes everything will be ready by the time it fires the callback. It might solve the issue of layout jumping around as images load in, or preventing invisible text and changing fonts.

I remember doing this with Typekit. I could hook into `wf-loading` and wait for `wf-active` or `wf-inactive` to reveal everything. It needlessly blocked content from being viewed, and if you wanted it to be seamless on load, you'd have to hide everything by default and depend on JavaScript. Then you'd need to make sure it worked without JS as well. I still see sites today that do this, and when you disable JS all you get is a white page. It's frustrating because you know all the content and images have loaded behind this curtain.

Usually we can show a website straight away. The text content is usually immediately available, so why not hand it over? Instead we make the user wait for something they might not care about.

Thankfully these days we can start to take advantage of {% external-link "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display", "font display" %} and even {% external-link "https://css-tricks.com/native-lazy-loading/", "native lazy loading" %}.

## Background Image Misuse

There's something I've noticed that has carried over from the Internet Explorer support days. The `background-size` rule has useful properties like `cover` and `contain`. It lets us set a background image and be confident that it will `cover` the entire container, or fit itself to avoid cropping at any size.

While this is incredibly useful, it's not so great for it to be used instead of a regular image tag. For one, if you want to make the image as responsive as possible you're limited to media queries to swap them out. This isn't great when tied into a CMS. Secondly, you're essentially rendering an empty div with no context for screen readers in case the image pertains to the content.

These days we can use the {% external-link "https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit", "object-fit" %} property. With this we can use the image tag along with the `srcset` attribute, or inside a `picture` element.

## Responsive

Sometimes "responsive" only relates to the screen-width. Everything collapses into a single column and that's the end of it. I remember working in an agency many years ago and I tried to convince the managers to try a mobile-first approach with an upcoming smaller project to see how it went. After hearing the sales pitch they said "Ok, brilliant! Can we develop the desktop version at the same time?" With that, we went desktop-first as the client only ever saw desktop designs.

I'm saying this because a responsive website isn't truly responsive for reasons listed above, and many others. The end-user might not notice anything if they're on a decent phone with a fast connection. This is especially true of showing the work to clients - if we're getting feedback off them then it's usually the restrictions of _their_ hardware that we optimise for, and for the most part they have decent specs. We also fall into the trap of making a website for them, rather than their users.

---

I was originally going to do this about cut-corners, but I want to think the people doing this are operating within constraints, and doing the best they can. "Cloaks" seem like necessary evils we sometimes do to get something over the line. They'll always exist in one form or another, but thankfully the gaps in the web platform are getting smaller, and eventually, such problems will be universally solved.
