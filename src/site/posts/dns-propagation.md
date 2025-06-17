---
title: "DNS Propagation"
description: "The weight of waiting."
date: 2024-08-07T13:01:00+01:00
permalink: "/dns-propagation/"
layout: layouts/post.njk
---

When I used to work with clients in agencies, waiting for the DNS to propagate was the norm, and you managed client expectations accordingly.

"Yes, it could be minutes, hours, or longer."

If it was a straight website swap without touching hosting, it was fine, but a new domain and new hosting took some planning to ensure things went smoothly on the day.

For my own site, I wanted to move away from Netlify, so I had to go back to my domain registrar and remove the name servers, but also add some new DNS records to point to the new location and keep my emails working.

Emails were fine, but the website kept showing the old site on my laptop. No matter how many times I flushed the DNS cache or restarted it.

After some digging, I found something for Chromium browsers (I'm on Vivaldi, so change the URL as you see fit):

``` url
vivaldi://net-internals/#dns
```

Hitting "Clear host cache" instantly did the trick. Good to know.
