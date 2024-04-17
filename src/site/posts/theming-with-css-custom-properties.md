---
title: "Theming with CSS Custom Properties"
date: 2018-03-02T16:20:00+00:00
permalink: "/theming-with-css-custom-properties/"
layout: layouts/post.njk
tags:
  - css
  - craft
  - twig
---

I remember scoffing at the thoughts of variables in CSS. "Haha. Oh internet, we have Sass!" Alas, I was a fool. Now it's getting to the stage where I might say "Haha. Oh internet, we have CSS!" when faced with the option of using a pre-processor. There's still a few things I use pre-processors or post-processors for such as nesting and splitting files, but beyond that I'd be just as happy using vanilla CSS.

I'm going to be showing the code used on this site at the moment, one difference being the name of some of the custom properties, but beyond that it's the same. As I'm using Craft, I'll be explaining this with the Twig templating language. If you use WordPress you can do this with PHP or Twig (which [I wrote an article about](https://css-tricks.com/timber-and-twig-reignited-my-love-for-wordpress/) if you're interested), but the idea can be applied anywhere from server-side rendering to JavaScript in the client.

## The CSS

To create a custom property, we can use the `:root` selector and pass it properties that begin with `--`. This tells the browser that they're custom properties and the values can be whatever we want. In this case we're using colours.

We're going to delcare two colours; primary and secondary. The `c` prefix here is more of a visual cue to let us know these are colours should we need reminding:


``` css
:root {
  --c-primary: #7B296E;
  --c-secondary: #AFA73A;
}
```

I like to keep these at the top of a file where I make base styles such as on the `body` tag, but I might end up moving them to their own file in the future if it gets a bit unwieldly. In any case they're set now and we can use them by calling the `var()` function and passing one of these property names:


``` css
a {
  color: var(--c-primary);
}

a:hover {
  color: var(--c-secondary);
}
```

By using these, the project becomes instantly themeable. I'm sure more consideration needs to be taken with bigger projects; maybe you don't want all of them to change, or have more control over what gets updated. In this case you can create new custom properties based on existing ones:


``` css
:root {
  --c-primary: #7B296E;
  --c-secondary: #AFA73A;
  --c-hero-title: var(--c-primary);
}
```

This way we can re-use existing values without duplication, but also target specific ones in certain cases if we need to.

## The Templates

In my case, I'm selecting a random theme on every page load, so it makes more sense for me to have everything related to the theming in Twig files. Otherwise if I scoped my themes in CSS to a class I'd have to update the Twig file and the CSS when a new one gets added or removed. If you're making a theme selector then it can be neccessary if they change based on a class getting added to an element in the DOM. To each their own really, we just want to build cool stuff.

In our default Twig layout file, I've updated the opening `html` tag to this:

``` html
{% raw %}
<html lang="en" {% include 'components/_style-switcher' %}>
{% endraw %}
```

This will inline some CSS to override the original variables. So what's in `_style-switcher.twig`?

``` twig
{% raw %}
{% set themes = [
  {
    'primary': '#ff3b3f',
    'secondary': '#fcd200'
  },
  {
    'primary': '#7B296E',
    'secondary': '#AFA73A'
  },
  {
    'primary': '#02847F',
    'secondary': '#D99104'
  },
  {
    'primary': '#75003E',
    'secondary': '#8B8F00'
  },
  {
    'primary': '#8F0000',
    'secondary': '#005656'
  }
] %}

{% set theme = random(themes) %}
style="--c-primary: {{ theme['primary'] }}; --c-secondary: {{ theme['secondary'] }};"
{% endraw %}
```

It's an array of objects, each one containing a primary and secondary key. `{% raw %}{% set theme = random(themes) %}{% endraw %}` will select a random item from the array which we can then use to set the value of the variable. In this approach it won't set a unique one every single time, such is the nature of random I guess. So you could refresh the page a few times before a new one is chosen.

One approach to avoid this might be to set a cookie with the name of the chosen theme. On the next page load you could check if the new randomly chosen one is the same as the one in the cookie. If so, try again, and repeat until you have a new one, and set that in the cookie.

If you're using JavaScript, you can use the following to update custom properties:


``` js
document.querySelector('html').style.setProperty('--c-primary', 'purple');
```

## Conclusion

There's a range of ways you can approach this, and the easiest in some cases might be to do this with JavaScript if you don't have access to the server code side of things. Custom Properties absolutely opens up a world of dynamicism on the web, and you can do a whole lot more than theme with them. I usually pick a new feature such as this and try apply it to my own work, be it existing or new, to have a play with it. And what's code if it's not playful at times?
