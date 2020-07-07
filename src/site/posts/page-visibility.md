---
title: "Page Visibility API"
date: 2018-02-23T11:07:00+00:00
permalink: "/page-visibility-api/"
layout: layouts/post.njk
tags:
- javascript
---

The Page Visibility API lets you detect when a page is visible or in focus for a user. The page is deemed no longer visible if they switch to another tab or when the window is minimized.

So what is it good for? The {% external-link "https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API", "MDN Docs" %} do a great job of explaining this API and its potential uses. For example, you could use it to pause a video or a game, or hold off on any background requests you might be making.

My cases are far less noble and exciting. Yes, I'm using it to show an emoji in the document title. Go ahead, switch to a different tab. Do come back though. Please. The link to the MDN Docs gives an example of how to implement the API, along with affordances for older browsers that support a vendor prefixed version. I'm going to outline a barebones script for my implementation.


``` js
const PageVisibility = {
  asleepEmoji: '💤',
  originalTitle: document.title, // [1]

  init() {
    if (typeof document.hidden === 'undefined') return // [2]

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this) // [3]

    document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
  },

  handleVisibilityChange() {
    let title = this.originalTitle

    if (document.hidden) {
      title = `${this.asleepEmoji} ${title}`
    }

    document.title = title
  }
}
```

After calling `PageVisibility.init()` you're good to go.

[1] We're storing the original copy of the document title so we can revert back to it once the page is visible again.

[2] We do a rudimentary check for modern support for this feature. You can check out the MDN link above for the vendor prefixed version.

[3] Binding the lexical scope of `this`. It means when I call `this` it'll refer to the PageVisibility object I created rather than `document`.

