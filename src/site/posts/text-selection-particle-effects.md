---
title: "Text Selection Particle Effects"
description: "Creating particle effects based on text selection using the Web Animations API."
date: 2020-03-22T9:09:24+01:00
permalink: "/text-selection-particle-effects/"
cover_image: text-selection-particles.jpg
tags:
  - javascript
  - css
layout: layouts/post.njk
script: particles.js
styles: particles.css
---

After reading {% external-link "https://css-tricks.com/playing-with-particles-using-the-web-animations-api/", "Playing With Particles Using the Web Animations API" %} I wondered if it would be possible to create particle effects based on the user selecting text.

You could whip up something quick by listening for a `mousedown` event and adding the particles based on the mouse position. It looks cool, but I wasn't too happy because it doesn't look as neat, and it doesn't work if you're doing selection with the keyboard.

There are two events we need to make this work:

- `selectstart`
- `selectionchange`

`selectstart` is needed to reset our initial `top` position. We use this to check if we're moving up or down in our selection. Once a selection is finished, and we start again, and the value can be reset.

`selectionchange` is fired any time our selection changes, and we'll use this to generate our coordinates for our particles. This is where most of the work is done.

Here's how it goes:

1. We start selecting some text, and `selectstart` is fired, where we reset our initial `top` value to `null`
2. `selectionchange` is then fired where get the current selection using `window.getSelection()`
3. With this, we get the range of text using `selection.getRangeAt(0)`, followed by the bounds using `range.getClientRects()`
4. The bounds now contain a `DOMRectList` with our selections, and we're only interested in the first and last item in this list
5. If our initial `top` value isn't set (as it's been reset by `selectstart`) then we assign it to the `top` value of the first `DOMRect` item in the list
6. We check if the `left` value has changed in the most recent `DOMRect` item in the list
7. We check if we're moving up or down the page with our selection
8. If we're moving down, we use the most recent `DOMRect` in the list, otherwise, we use the first
9. If we're moving left, our `x` position will be the `left` value, otherwise, we'll use `right`
10. Our `y` value will be the `y` value of our chosen bounds, plus the height of the selection so the particles appear below the text

Thanks to {% external-link "https://twitter.com/Mamboleoo", "Louis Hoebregts" %} for a great article. I had a bunch of fun and confusion getting this to work, but it was a welcome distraction.

<p class="codepen" data-height="565" data-theme-id="light" data-default-tab="result" data-user="tjFogarty" data-slug-hash="mdJKNZM" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Particle Effects on Text Selection">
  <span>See the Pen <a href="https://codepen.io/tjFogarty/pen/mdJKNZM">
  Particle Effects on Text Selection</a> by T.J. Fogarty (<a href="https://codepen.io/tjFogarty">@tjFogarty</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
