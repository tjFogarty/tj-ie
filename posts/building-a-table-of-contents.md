---
title: "Building a Table of Contents with the Intersection Observer API"
date: 2018-09-08T11:31:17+01:00
description: "How to build a live-updating table of contents using Intersection Observer."
permalink: "/building-a-table-of-contents/"
layout: layouts/post.njk
tags:
  - javascript
---

While planning out an upcoming post, I noticed there was quite a lot of content to cover with no easy way to navigate it. So, rather than actually write the post, I went off on a tangent and built a table of contents component. Great, back to writing... ah it'd be nice if it followed the user scrolling down the page. OK, done. Wait, it would be cool if I could highlight the currently active section...

What I ended up with is by no means perfect; it doesn't highlight correctly when scrolling up until you reach a new heading. However, I think it does a decent job for now without using JavaScript to wrap each section in an identifiable container, and I can always improve it, or remove it entirely if it's not fit for purpose.

## Setup

I'm using Hugo to generate my site which comes with a useful tag to automatically create a table of contents. This works by finding all the headings, assigning them an id, and generating a list of links.

``` go
{% raw %}{{ .TableOfContents }}{% endraw %}
```

To begin with, we need a document with some headings. These headings should have an id so we can use anchor tags to jump to that section of the document. We also need a list of links with the `href` pointing to each heading. The idea is that the basic functionality works without JavaScript enabled.

``` html
<div>
  <aside>
    <p>Table of Contents</p>

    <ul>
      <li>
        <a href="#first-heading">First Heading</a>
      </li>
      <li>
        <a href="#second-heading">Second Heading</a>

        <ul>
          <li>
            <a href="#third-heading">Third Heading</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <article>
    <h1>Article Title</h1>

    ...

    <h2 id="first-heading">First Heading</h2>
    ...
    <h2 id="second-heading">Second Heading</h2>
    ...
    <h3 id="second-heading">Third Heading</h3>
    ... and so on
  </article>
</aside>

```

The lists in the navigation are nested to reflect the hierarchy of the content. A h3 lives within the section defined by a h2, a h4 by a h3 etc...

## Writing the JavaScript Object

I'm sure you clever folks can make a cleaner job of this. I opted to avoid any plugins in an effort to learn more about what's going on, as well as keep the bundle size of my scripts down. That means there's no fallback support for browsers that don't support the Intersection Observer API. As of this writing, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility" target="_blank" rel="noopener noreferrer">that means Internet Explorer</a>.

The first step I figured was to collect the list of links and headings in an article. I did this wrapped in an object to try and organise the code.

``` js
const TableOfContents = {
  container: document.querySelector('.js-toc'), // this is the container for our links
  links: null,
  headings: null,

  init() {
    this.findLinksAndHeadings()
  },

  findLinksAndHeadings() {
    this.links = [...this.container.querySelectorAll('a')]
    this.headings = this.links.map(link => {
      let id = link.getAttribute('href')
      return document.querySelector(id)
    })
  }
}
```

The reason I'm destructuring into an array here: `this.links = [...this.container.querySelectorAll('a')]` is because `querySelectorAll` will return a Node List as opposed to an array which we can call `filter`, `forEach`, `map` etc... on.

Then I `map` over the links, find the `href` and use that to collect the heading it links to.

### Intersection Observer

Before we got the Intersection Observer API, we would have attached an event listener to the window object on scroll. Then we'd check the current scroll position of the page, and measure it against the `offsetTop` of the element we wanted to check was in view. We could still do this, but scrolling can be expensive unless we debounce the listener. In any case, we'd be reaching into the DOM to pull out values, manually check them, and carry on.

With this API, we can minimize the effort required by learning a slightly different way of approaching the detection of elements in the viewport.

Let's take a look at a stripped back example that I've copied from the MDN link above:

``` js
let options = {
  root: document.querySelector('#article'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options)
```

From MDN:

>#### root
>The element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null.
>#### rootMargin
>Margin around the root. Can have values similar to the CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the root element's bounding box before computing intersections. Defaults to all zeros.
>#### threshold
>Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5. If you want the callback run every time visibility passes another 25%, you would specify the array [0, 0.25, 0.5, 0.75, 1]. The default is 0 (meaning as soon as even one pixel is visible, the callback will be run). A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.

With that information, I used the following options:

``` js
{
  rootMargin: '0px',
  threshold: 1
}
```

I left out `root` as I wanted it to default to the browser viewport. I didn't need anything extra from `rootMargin`, and `threshold` made sense to activate for when 100% of the element is visible.

For the observer itself, I needed to write a function for the callback, and watch the headings for when they become visible.

``` js
this.observer = new IntersectionObserver(
  this.handleObserver,
  this.intersectionOptions
)

this.headings.forEach(heading => {
  this.observer.observe(heading)
})

handleObserver(entries, observer) {
  entries.forEach(entry => {
    let href = `#${entry.target.getAttribute('id')}`
    let link = this.links.find(l => l.getAttribute('href') === href)

    if (entry.isIntersecting && entry.intersectionRatio === 1) {
      link.classList.add('is-visible')
      this.previousSection = entry.target.getAttribute('id') // I'll tell you in a minute
    } else {
      link.classList.remove('is-visible')
    }

    this.highlightFirstActive() // in a minute I said
  })
}
```

So I create the observer, observe each heading, and check if any heading is in view. If it's in view, I give it a class, of `is-visible`, otherwise, I remove it. Scrolling up and down the page now I can see, via classes on the links, which headings are currently in view. Now to style the most appropriate one.

### Finding the Active Section

This was a _really_ fun one. It's my fault for skipping breakfast that it took so long to figure this out. While multiple headings might be visible at once, I only wanted the first available one to show an active state. That's straightforward enough with `document.querySelector` which will return the first match it finds. The problem I was having was that as soon as the heading went out of view, the active style would be removed even though I was in that relevant section of the document.

The breakthrough moment was keeping track of the previously active section. With this, I could say "OK, if there's nothing active at the moment, default to the most recently active section." That's what `this.previousSection` is doing for us.

``` js
highlightFirstActive() {
  let firstVisibleLink = this.container.querySelector('.is-visible')

  this.links.forEach(link => {
    link.classList.remove('is-active')
  })

  if (firstVisibleLink) {
    firstVisibleLink.classList.add('is-active')
  }

  if (!firstVisibleLink && this.previousSection) {
    this.container.querySelector(
      `a[href="#${this.previousSection}"]`
    ).classList.add('is-active')
  }
}
```

I'm grabbing the first visible link, then removing all other `is-active` classes. After this, I check if we actually have a visible section (we might be in between sections with no headings visible). If we find one, great; add the class and bail. If we don't find one, and we have a previous section, then that's what we highlight instead.


## Demo

<p data-height="500" data-theme-id="light" data-slug-hash="yxPdqe" data-default-tab="result" data-user="tjFogarty" data-pen-title="Scroll spy table of contents" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/tjFogarty/pen/yxPdqe/">Scroll spy table of contents</a> by T.J. Fogarty (<a href="https://codepen.io/tjFogarty">@tjFogarty</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## That's It So Far

I would be lying if I said this was well-thought out. It was a tangent within a tangent. I spent more time on this post than I did writing the code, and I'm sure there are things I've missed that could greatly simplify it. Give me a shout if you spot anything and I'll make amendments.

In the final version, I also introduced smooth scrolling to items provided the user doesn't mind by checking for the `prefers-reduced-motion` media query.
