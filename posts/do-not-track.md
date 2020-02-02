---
title: "Do Not Track"
description: "How to use window.doNotTrack to decide when to use tracking."
date: 2018-04-15T13:01:00+01:00
permalink: "/do-not-track/"
layout: layouts/post.njk
tags:
- javascript
- analytics
---

When I first began writing posts for my own website, I was keen to get an insight into how people were finding my blog, what pages were most popular, and generally nerding out with the real-time dashboard in Google Analytics to see visitors from different parts of the world.

Those things definitely still interest me, but over time I haven't really used any of the information I get in a meaningful way. I imagine for other sites it's more useful, especially if you need to run some ads, or it's part of your income or a service you offer and you want to see if users are hitting any issues. That's super important stuff, and I don't see a problem with it. The way it looks to be going now, however, is that it's becoming more of an opt-in experience rather than one of opt-out.

This is a pretty small site, and since it's developer-focused I'm imagining a good number of visitors have some sort of ad blocker enabled. I have one myself, and sure I'll disable it for sites I trust, but for the most part it's left on by default. I've been recently toying with the idea of removing tracking altogether for my site in it's current state, but first I wanted to see if there was any middle-ground to explore. Enter `navigator.doNotTrack`.

---

I found {% external-link "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack", "some docs on MDN" %} describing how it can be used, and there's a difference in behaviour across browsers. It seems by default in Chrome and Safari, the value is `null`, whereas in Firefox it's `"unspecified"`. If you call `navigator.doNotTrack` and it returns a string value of `"1"`, then it means the request prefers no tracking. I'm going to be leaning more towards an opt-in approach, however if it returns `null` then I'll enable Google Analytics. You can find this option in your browser settings. In Safari it's under Privacy, and in Chrome and Firefox you can search your settings for 'do not track'.

Here's how I'm checking at the moment:

``` js
function hasDoNotTrackEnabled() {
  let doNotTrack = navigator.doNotTrack

  // some browsers have this in the window object
  if ('doNotTrack' in window) {
    doNotTrack = window.doNotTrack
  }

  // if it isn't specified, let's not assume
  if (doNotTrack === 'unspecified') return true

  return doNotTrack === '1'
}
```

It would be nice if it always had a value like Firefox does, but I'm gonna roll with this for now. Chances are it'll completely disable tracking for Firefox users, and enable it for Chrome and Safari users if they don't say otherwise which kinda circumvents the opt-in approach. Short of removing analytics altogether I think this is an OK approach for now.

I'm using the {% external-link "https://www.npmjs.com/package/ga-lite", "ga-lite package" %} to bundle everything so I have cleaner control over how tracking works.


``` js
import galite from 'ga-lite'
import { env, hasDoNotTrackEnabled } from './utils'

export const Tracking = {
  gaTrackingId: 'UA-XXXXXXX-X',
  shouldTrack: env() === 'production' && !hasDoNotTrackEnabled(),

  setup() {
    if (!this.shouldTrack) return

    galite('create', this.gaTrackingId, 'auto')
  },

  sendPageView() {
    if (!this.shouldTrack) return

    galite('send', 'pageview')
  }
}
```

The `env()` call is a utility function I can use so I don't run it when developing locally.

So now when I call `Tracking.setup()` and `Tracking.sendPageView()`, it'll do it based on the result of the `hasDoNotTrackEnabled` function.

I'll keep this going for a while, and probably end up removing tracking altogether at some stage. Just to re-iterate though, I have no problem with sites using some form of tracking. This is more of a personal decision. It'd be nice if it got to a stage where something like Carbon Ads would be needed to help pay for hosting, and I'd reconsider then if I needed to get a rough estimation of traffic. At the end of the day it's a tool to be used, and we shouldn't be shamed out of taking advantage of it (provided it's not for nefarious reasons, of course).
