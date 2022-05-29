---
title: "HTML Imports & Component-Driven Development"
slug: "html-imports-component-driven-development"
description: "Playing around with HTML Imports before deprecation, pining for a native, relatively hassle-free way of building a component library."
date: 2018-09-15T22:17:21+01:00
permalink: "/html-imports-component-driven-development/"
layout: layouts/post.njk
tags:
  - javascript
  - experiment
---

__Update__: As linked in the article, HTML Imports are being removed from Chrome in favour of other alternatives. This is more of an experiment to look at how a modern take on an old way of doing things might look like in as simple a way as possible without the reliance on too many external tools.

I was thinking about the process of building a site today vs maybe 8 years ago. When WordPress was called for, I'd usually build the site from start to finish within WordPress. You wouldn't see any CSS for a little while as custom post types needed creating, content needed to be sourced, and plugins needed to be installed. The whole front-end was mashed up with this configuration, and nothing was really finished until the site was live.

Now, I didn't know a whole lot 8 years ago, so looking back there are ways it could have been done better. If I could go back, I'd probably build a static site first with all the parts, then port that over to WordPress when it was ready. It might be me, but I find not having to think about a CMS while doing initial front-end work very liberating. I don't want to troubleshoot why a template is breaking when I want to focus on styling. It's too easy for me to go off on a tangent and fiddle with PHP because I just thought of a better way to do something.

Years later, this idea of focusing on the right things at the right time became, for me at least, encapsulated with {% external-link "http://atomicdesign.bradfrost.com/", "Atomic Design" %}, so I want to take this moment to thank Brad Frost for preserving the few remaining brain cells I have left. I used tools like {% external-link "https://patternlab.io/", "Pattern Lab" %}, and {% external-link "https://fractal.build/", "Fractal" %} which really opened my eyes to the benefits of focusing on one thing at a time.

Working on a team and incorporating these tools caused trouble at times. When I wanted to introduce this notion of building a project from components, everyone had to be on the same page, and have a solid understanding of the tools we were using. Technical bugs arose from misconfigured environments or an unmet expectation, and when you're moving fast with multiple projects, it can be a momentum-killer.

In many cases, I see nothing wrong with setting up a local PHP server in a directory with `php -S localhost:8080`, and setting up individual files for components and using `include` to pull them into a template. Not all projects demand a batteries-included pattern library that can be exhibited to a client. Sometimes they don't care as long as the project gets done on time and within budget. It'd be nice sometimes to surprise a client with such a powerful resource packaged up in Pattern Lab, but when it's not called for we still get that nice component-y feeling from a smattering of PHP calls to other files. The developer still gets to focus on one thing at a time.

## HTML Imports

I was wondering if there's any way we can replicate this in the browser without relying on external libraries. Maybe it's something that could be done with the tools we have today without depending too much on JavaScript to make a bunch of AJAX calls. That's when I was reminded of HTML Imports. I wonder how far along that is now...

{% image "html-import-support.png", "HTML Import support" %}

Well, {% external-link "https://caniuse.com/#search=html%20imports", "at the moment it's not great" %}. Mozilla have {% external-link "https://hacks.mozilla.org/2015/06/the-state-of-web-components/", "published their thoughts on supporting it" %}.

> At Mozilla we want to explore how importing custom element definitions can align with upcoming ES6 module APIs. We’d be prepared to implement if/when they appear to enable developers to do stuff they can’t already do.

{% external-link "https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/h-JwMiPUnuU/sl79aLoLBQAJ", "Chrome will be deprecating the current implementation soon as well" %}.

Still, though, I wanted to try to replicate that process of having components and including them where I needed them, without requiring a developer to know the ins-and-outs so they can focus on coding.

### Importing HTML

Given I have an `index.html`, a folder for partials (think a header and a footer which may be made up of components), and a folder for components, I want to load them, and inject them into the page. The first thing to do is register them in the `<head>` of my document with `<link rel="import">`.

``` html
<link rel="import" id="site-header" href="partials/site-header.html">
<link rel="import" id="primary-nav" href="components/navigation/primary-nav.html">
```

The ID is important for referencing the imports in order to inject them into the page. So how do we reference those imports? I'm going to use a data attribute to define this.

``` html
<div data-import="site-header"></div>
```

Inside my site header, I'm also referencing the primary nav.

``` html
<header>
  <div>
    <span>Logo</span>
    <div data-import="primary-nav"></div>
  </div>
</header>
```

### JavaScript

We need some JavaScript to get the ball rolling. We need to find the imports, grab their content, and replace instances of `[data-import]` with their respective content. To be fair, it's not an awful lot of code, which was a nice surprise.

1. Get the import id to identify where to import into our document later on
2. Grab the contents of the import. Since it'll include the body tag, we want to get everything inside that instead.
3. Find the spots to put it in.
4. Loop through each `data-import` and replace it with the contents.

For step 4, I'm using `content.clondNode(true)` rather than passing `content`. I'm doing this because if there's more than one instance on the page, it'll only show the import in the last place it was referenced, essentially moving it around. By using `cloneDeep`, and passing `true` to include the children, we're copying it into every place it's being referenced.

``` js
let imports = document.querySelectorAll('link[rel="import"]')

imports.forEach(htmlImport => {
  let id = htmlImport.getAttribute('id'), // [1]
      content = htmlImport.import.querySelector('body *'), // [2]
      domTemplate = document.querySelectorAll(`[data-import="${id}"]`) // [3]

  domTemplate.forEach(el => {
    el.parentNode.replaceChild(content.cloneNode(true), el) // [4]
  })
});
```

I thought this was a fun little experiment, and it would be really cool to see this factor into the tooling of creating websites in the future. That's if the support is there. Otherwise, there are custom elements to look into, or I'm happy sticking with a static-like setup with PHP.

{% external-link "https://htmlimports.tj.ie", "See the demo" %}

{% external-link "https://github.com/tjFogarty/html-imports/", "View the source" %}
