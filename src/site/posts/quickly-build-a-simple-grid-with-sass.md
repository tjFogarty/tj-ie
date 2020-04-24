---
title: "Quickly build a simple grid with Sass"
date: 2015-03-17T00:00:00+00:00
permalink: "/quickly-build-a-simple-grid-with-sass/"
layout: layouts/post.njk
tags:
  - css
---

<p>All you need are some variables and loops. Granted, some may argue for readability, but as long as what you're doing is well documented, it can save you a lot of time. Especially if you want to add/remove breakpoints.</p>
<p>The end result should be a simple class list that is responsible for the width of your column. I'm using a seperate class to take care of floats and padding.</p>
<p>For my purposes, I'm using `.layout__item` and `.g-1-12`, `.g-2-12`&#8230; etc</p>
<p>`.layout__item` will contain the following:</p>

``` css
.layout__item {
    padding-left: 15px;
    padding-right: 15px;
    float: left;
}
```

<hr />
<p>Starting off, I need a formula for calculating width based off a fraction of how many columns I want. </p>
<p>Say I wanted a column to extend 4/12 of the page, I'd use:</p>
<p>`(4 / 12) * 100%` </p>
<p>In Sass, this would return 33.33333%. Happy days, so let's  keep that in a function.</p>

``` scss
@function percentage-width($span, $columns) {
  @return ($span / $columns) * 100%;
}
```

I'm then going to keep my colums in a variable.

``` scss
$grid-column: 12;
```

Next, I'm going to use a for loop to iterate through my number of columns, and use the `percentage-width` function.

``` scss
@for $i from 1 through $grid-columns {
  .u-#{$i}-#{$grid-columns} {
    width: percentage-width($i, $grid-columns);
  }
}
```

This yields the following:

``` css
.u-1-12 {
  width: 8.33333%; }

.u-2-12 {
  width: 16.66667%; }

.u-3-12 {
  width: 25%; }
```

etc...

---

So what about breakpoints? The above example would surely serve well as a mobile-first starting point.

Let's throw in another variable, a map:

``` scss
$grid-breakpoints: (
  medium: 768px,
  large: 960px
);
```

We can use the above loop again, but modify it slightly to include medium and large in the class name.

``` scss
// Loop breakpoints to generate screen-specific grids
@each $key, $val in $grid-breakpoints {
  @media (min-width: #{$val}) {
    @for $i from 1 through $grid-columns {
      .u-#{$i}-#{$grid-columns}--#{$key} {
        width: percentage-width($i, $grid-columns);
      }
    }
  }
}
```

It's the same loop, but repeated for every breakpoint defined in `$grid-breakpoints`, resulting in:

``` css
@media (min-width: 768px) {
  .u-1-12--medium {
    width: 8.33333%; }
  .u-2-12--medium {
    width: 16.66667%; }
```

And so on.

You can grab the source and see a small example below.

<p data-height="268" data-theme-id="0" data-slug-hash="KwrRex" data-default-tab="result" data-user="tjFogarty" class="codepen">See the Pen <a href="http://codepen.io/tjFogarty/pen/KwrRex/">Simple grid with Sass</a> by T.J. Fogarty (<a href="http://codepen.io/tjFogarty">@tjFogarty</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
