---
title: "Building My Site Part I: Decisions"
description: "Building my website with Craft CMS."
date: 2018-01-06T23:04:00+00:00
permalink: "/building-my-site-part-i-decisions/"
layout: layouts/post.njk
tags:
  - craft
  - webpack
---

Making decisions can be an arduous task. With the blitz of build-tools and boilerplates it can be surprisingly complex to arrive at a well-informed selection of technologies. It seems like the more you know, the less you do.

With that, here's what I ended up with, and why.

## Results

- {% external-link "https://craftcms.com/3", "Craft CMS" %}
- {% external-link "https://github.com/JeffreyWay/laravel-mix/","Laravel Mix" %}
- {% external-link "https://www.digitalocean.com/", "Digital Ocean" %}
- {% external-link "https://forge.laravel.com/", "Laravel Forge" %}

## CMS

### Some History

Before all this I had a self-hosted version of {% external-link "https://ghost.org/", "Ghost" %}. It's a deadly platform and incredibly easy to get up and running with. After a while I decided to move to a hosted version with them when I had less time for maintenance. It was less for me to think about. It also meant I couldn't break the server which happens when I start tinkering too much. I could rest easy knowing these folks had it all sorted.

When I had a bit more time, I moved to {% external-link "https://pages.github.com/", "GitHub Pages" %} to have a bit more control over the build. I really liked the idea of being able to make theme-related changes that take effect with a single `git push`.

Not long after, I started to long for a bit more control over the functionality not only afforded by the front-end, but by what happens behind the curtain as well.

### Headless CMS

This is the new cool kid on the block, and I wanted to see what it was all about. After looking through a few options, I had a go of {% external-link "https://www.contentful.com/", "Contentful" %}. I had a blog prototype set up pretty quickly with Vue.js as a single page application. It was pretty nifty if I do say so myself. I gave myself a pat on the back and thought &quot;yep, this is it&quot;.

After about 20 minutes, however, I realised I needed server-side rendering to make it more accessible. I wanted to get the ball rolling quickly, and this was something that I felt would be a bit of a time sink. I scrapped it and decided to keep moving.

### Craft

I've worked a lot with PHP-based projects including WordPress, ExpressionEngine and Laravel. I wanted to use something that I was familiar with in order to extend it with any custom functionality I might need/want. The Twig templating language is also something I'm quite fond of when it {% external-link "https://css-tricks.com/timber-and-twig-reignited-my-love-for-wordpress/", "completely changed how I worked with WordPress" %} Lucky for me, this is where Craft came in.

I've used it before, and really liked how straight-forward it was to get going with. I thought about using WordPress, and while I still have great time for it, I wanted to explore something different.

Craft is also nearing it's release of version 3, so I figured it was a good time to get back into it and see what's changed since I last used it. Spoiler: it's looking pretty frickin' good. They also have {% external-link "https://craftcms.com/pricing", "a generous pricing plan" %} for personal use: it's free!

With that I pulled down the latest version of V3 that was available and started porting my posts over.

## Laravel Mix

Again, familiarity. Laravel Mix wraps itself around webpack like a blanket with a high thread count, and gives you a dead-simple way to get up and running quickly. If you need to dig deeper you can extend the configuration to suit your needs.

It was recently updated to include async/await straight out of the box, which is one less thing to hack about. I like not having to think sometimes, even if that saves me manually adding a dependency and updating a dotfile.

## Hosting

I stated earlier that I have a tendency to break things when I have the terminal open in front of me. Time progressed and since then I've learned enough to be dangerous. I signed back up with Digital Ocean because this time I had a secret weapon &#8212; Laravel Forge.

Forge is suitable for any PHP project, and provisions a server with a few clicks. It also lets me watch a branch on a repo and can deploy any time a push is detected. It'll run a script as well, which means I can run things like `npm run production` to create a production build of my assets.

## Here We Are

This has led to the site you're currently on today. I can't say it will always be this way, but for now I'm really happy with the end-result. You might notice the common theme of familiarity with these decisions. That was something that occurred after the ideas had settled. I wanted a solid base to work from, something that I had initial experience with to get something up and running quickly. Who's to say I won't end up with a headless CMS? Maybe when I learn more about server-side rendering I'll pick up where I left off. Until then, I have more reasons than ever to keep tinkering and exploring what else I can do with this setup.

[Read Part II: Setup](/building-my-site-part-ii-setup/)
