---
title: "Building a full-screen overlay"
description: "A JavaScript approach to a full-screen overlay"
date: 2015-04-06T00:00:00+01:00
permalink: "/building-a-full-screen-overlay/"
layout: layouts/post.njk
tags:
- javascript
- css
---

I’m currently working on a project that requires a full-screen overlay for various components - I’m going to share what I have at the moment, though I’m sure it can be refined.

DISCLAIMER: I’m not a mad bastard when it comes to JavaScript. I’m still learning.

I’m using the incredible <a target="_blank" rel="noopener noreferrer" href="http://greensock.com/gsap">GSAP</a> library for animating the various parts, and I’ve found that once you get into it, it’s an invaluable tool.
It also plays nicely with `jQuery.animate()` via a <a target="_blank" rel="noopener noreferrer" href="http://greensock.com/jquery-gsap-plugin">plugin</a> if you’re so inclined.

<a target="_blank" rel="noopener noreferrer" href="http://jquery.com/">jQuery</a> is being used as well, though you can easily use something like <a target="_blank" rel="noopener noreferrer" href="http://zeptojs.com/">Zepto</a> or anything else you fancy.

The Overlay object is going to work as follows:

- `var overlay = new Overlay();` - this instantiates the object, but doesn’t create it in the DOM.
- `overlay.create();` - we then create an empty div in the page.
- `overlay.show();` - this animates it in.
- `overlay.hide();` - does what you imagine.
- `overlay.destroy();` - removes it from the DOM.

‘Mon!

``` js
  var Overlay = (function() {
  var $body = $(‘body’); // We need to put the overlay somewhere

    // We can modify this to accept an object instead of setting everything here, but this works fine for now
  function Overlay() {
    this.assignClass = ‘c-overlay’;
    this.el = false; // check if it exists
    this.animate = {
      duration: 0.3,

      visible: {
        display: ‘block’,
        autoAlpha: 0.7,
        ease: Power3.easeInOut
      },

      hidden: {
        display: ‘none’,
        autoAlpha: 0,
        ease: Power3.easeInOut
      }
    };
  }

  return Overlay;
})();
```

This is the start of our overlay. It’s basically just some configuration, and it can be modified to accept an object as an argument so we can specify what we want the properties to be. For the moment, however, this’ll work fine to get us up and running.

Grand job, so let’s add it to the DOM when we call `create()`.

``` js
Overlay.prototype.create = function() {
  var self = this;

  this.el = $(‘&lt;div/&gt;’, {
    ‘class’: this.assignClass
  }).appendTo($body);

  $(this.el).on(‘click’, function() {
      self.hide();
  });
};
```

We’re also binding a click event in here that hides the overlay once clicked.

Now we’re going to show it using `TweenLite` from GSAP. We’re going to pass in parts of the animate object we created earlier, and we’re going to pass these into a `fromTo()` method.

``` js
Overlay.prototype.show = function() {
  $body.addClass(‘prevent-overflow’);
  TweenLite.fromTo(this.el, this.animate.duration, this.animate.hidden, this.animate.visible);
};
```

That extra class is just a helper, and not necessary. It just prevents scrolling when the overlay is active.

You’ll notice as well that the animate object specifies that we’re animating from `display: block;` to `display: none;`. These properties will be applied once the other properties have been animated. In this case we’re animating `opacity` using `autoAlpha`.

The difference between `opacity` and `autoAlpha` is as follows, found on <a target="_blank" rel="noopener noreferrer" href="https://greensock.com/get-started-js">Getting Started with GSAP</a>:
the same thing as “opacity” except that when the value hits “0”, the “visibility” property will be set to “hidden” in order to improve browser rendering performance and prevent clicks/interactivity on the target. When the value is anything other than 0, “visibility” will be set to “visible”.

Hiding it is going to be the same idea as showing it. We’re just going to swap some of the arguments around:

``` js
Overlay.prototype.hide = function() {
  $body.removeClass(‘prevent-overflow’);
  TweenLite.fromTo(this.el, this.animate.duration, this.animate.visible, this.animate.hidden);
};
```

Finally, we need a method for destroying it.

``` js
Overlay.prototype.destroy = function() {
  $body.removeClass(‘prevent-overflow’);
  $(this.el).remove();
  this.el = false;
};
```

<p data-height="268" data-theme-id="0" data-slug-hash="ByeQMR" data-default-tab="result" data-user="tjFogarty" class="codepen">See the Pen <a href="http://codepen.io/tjFogarty/pen/ByeQMR/">Full-screen overlay</a> by T.J. Fogarty (<a href="http://codepen.io/tjFogarty">@tjFogarty</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

It’s not the most incredible thing you’ve ever seen, but if you have modules that need an overlay, it’s easy to just drop this in for re-use.
