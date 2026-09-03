---
title: "Swatcher 2.0"
description: "Swatcher has been rebuilt with lessons learned."
date: 2026-09-03T10:00:00.000+01:00
permalink: "/swatcher-v2/"
coverPreview: swatcher-v2.png
cover: "https://tj.ie/assets/images/swatcher-v2.png"
layout: layouts/post.njk
tags:
  - ai
  - laravel
---

When [Swatcher](https://swatcher.ie) was first released, it was a fairly simple concept - pull together paints from different brands available in Ireland, and explore them from one place. Add some colour generation from prompts and match them to real paints.

I wasn't expecting it to take off, but it did. It was both exciting and nerve-wracking.

It was strung together with tape, connecting different parts. There was Firebase for authentication and storing user data, Netlify for hosting, with serverless functions to handle things like server-side rendering for SEO, and JSON files of paint data that had to be manually updated and pushed live.

I thought I was doing something useful by breaking out the paint data into its own separate API. Now the paint data had to be shared between that and the front-end to generate the sitemaps. I did this to myself.

Fun started to become a chore, and I wasn’t enjoying being in maintenance mode when I could have been exploring more ideas and iterating on something without fear of it crumbling.

---

Over the last little while, I’ve been working on a rebuild. Something a bit more sturdy and future-proof.

Last year I built an app for my wife and used Laravel hosted on Laravel Cloud. It’s been easy enough to keep going and improving thanks to everything living in one place. Plus tests. Lots of tests. The luxury of working with a real database and migrations meant I wasn’t worrying about everything falling apart with one misstep. 

So I took the same approach here. Swatcher 2.0 is now live and has a bunch of affordances baked in. The big one being I have an admin dashboard to upload paint data, which gets persisted to the database. No more placing files in the right place with the right name. It’s a quick job that I don’t mind doing now.

I’m still using Vue on the front-end, but with Inertia and SSR for SEO.

Give it a spin and let me know what you think. 


