---
title: "IE11 Placeholder Transition Issue"
description: "A combination of autoprefixer and transitions styles broke an input in IE11."
date: 2020-05-07T11:00:00+00:00
permalink: "/ie11-placeholder-transition-issue/"
layout: layouts/post.njk
tags:
- css
---

I hit an issue recently in IE11 where an input wasn't visible until it was focused. There was a really nice transition in place of when the input is focused, it expands and the placeholder fades in after a short delay.

For some reason, in IE11, the input wasn't visible until it was focused.

The rule was essentially something like this:

``` css
input::placeholder {
  opacity: 0;
  transition: opacity ease 0.2s;
}

input:focus::placeholder {
  opacity: 1;
}
```

This works as expected in modern browsers, but autoprefixer generates the following as well:

``` css
input:ms-input-placeholder {
  /* same as above */
}
```

The opacity rule was applied to the input itself, and so it wasn't visible. I tried adding a comment telling autoprefixer to ignore it, but we're locked on an older version that doesn't have that capability. So what now?

Turns out it's a small change. We swap `opacity` for `color`.

``` css
input::placeholder {
  color: transparent;
  transition: color ease 0.2s;
}

input:focus::placeholder {
  color: #a9a9a9;
}
```

I haven't worked with IE11 in a few years, but it was a fun one to chase down. I made a demo on CodePen to test it out.

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="tjFogarty" data-slug-hash="5e40ec0db99d981980aa855e44eb9cb4" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="IE11 Placeholder Transition Issue">
  <span>See the Pen <a href="https://codepen.io/tjFogarty/pen/5e40ec0db99d981980aa855e44eb9cb4">
  IE11 Placeholder Transition Issue</a> by T.J. Fogarty (<a href="https://codepen.io/tjFogarty">@tjFogarty</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
