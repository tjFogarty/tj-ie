---
title: "Popover API"
description: "For many years, we had to do this manually or rely on third-party solutions. Now, though, it's a different world. In this post we'll take a quick look at how it works with a demo."
date: 2024-01-07T13:00:00+00:00
permalink: "/popover-api/"
layout: layouts/post.njk
styles: popover.css
script: popover.js
coverPreview: popover-expanded.png
cover: "https://tj.ie/assets/images/popover-expanded.png"
tags:
- html
---

Back in the days of jQuery plugins and JavaScript files spanning hundreds (sometimes thousands) of lines, Popovers were just another problem we had to solve by employing either third-party solutions or, if you were feeling adventurous, you would code by hand.

During those times, things like accessibility were an afterthought; you only wanted to check off an item in a long list of requirements and move on to the next item, like a carousel or an accordion list. If there was enough time in the day, you might test on IE7 to make sure everything worked as expected or save that for the end.

We no longer have to take years off our lives to do this, thanks to modern-day innovations. The problem has been solved.

Introducing the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API). A way in which you can quickly drop in a popover. You can programmatically handle interactions with JavaScript if you wish or forego JS entirely and rely solely on HTML. What? Just HTML?

Let's take a look at this declarative approach using HTML and a small helping of CSS:

```html
<button type="button" popovertarget="menu">Toggle the popover</button>
<div id="menu" popover>
    Popover Content
</div>
```

```css
[popover] {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 200px;
    margin-left: -150px;
    text-align: center;
}

::backdrop {
    background-color: rgba(0, 0, 0, 0.3);
}
```

The default behaviour is to toggle the popover when you perform actions. For example, clicking the backdrop or hitting escape will dismiss the popover. The focus is then returned to the button. Have a try:


<div class="c-demo">
    <div class="popover-html">
    <button type="button" popovertarget="menu">Toggle the popover</button>
    <div id="menu" popover>Popover content</div>
    </div>
    <p class="popover-not-supported">Sorry, but support for the popover api has not landed for your browser yet.</p>
</div>

Here's what it looks like when VoiceOver is turned on:

<img src="/assets/images/popover-collapsed.png" alt="VoiceOver dialog declaring the popover as collapsed when popover is closed" />

<img src="/assets/images/popover-expanded.png" alt="VoiceOver dialog declaring the popover as expanded when popover is activated" />

Currently, support is ok, but we're waiting on Firefox to ship support in stable. This is a barebones example, but I'm excited to add this to my toolbelt and see where it will fit in a production environment.
