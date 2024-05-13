---
title: "Using the Least Amount of JavaScript"
description: "Applying minimal JavaScript by resorting to less than standard ways of doing things."
date: 2024-02-20T15:13:04.000+01:00
permalink: "/minimal-javascript/"
coverPreview: minimal-js.png
cover: "https://tj.ie/assets/images/minimal-js.png"
tags:
  - html
  - javascript
layout: layouts/post.njk
---

I have started building a very simple RSS reader for myself. I can add feeds and read posts. It runs locally for now using Laravel and SQLite.

What was originally entirely built with Web Components backed by a couple of PHP and JSON files has turned into something else. I overdid it by relying on JavaScript (Web Components), but that was an effort to learn more about them. I'm glad I did.

Now, I've gone the other way. I like Laravel, so I'm using that. I've removed all the Web Components and resorted to Blade templates to output HTML from the server.

The basic setup is this - a list of feeds on the left, and clicking them reveals a list of posts on the right.

<img src="/assets/images/rss-preview.png" alt="Preview of the application with a list of feeds on the left and posts belonging to the selected feed on the right." />

When I click on a post, I use the [Popover API](/popover-api/) to show it.

<img src="/assets/images/show-post.gif" alt="Animated gif of clicking on a post and displaying its contents in a popover dialog" />

This is looking pretty good, but I hit a hurdle. How do I mark it as read once I view it? I could have a form you manually interact with, but I'd rather mark it as read once you view it. Sounds like a job for JavaScript...

Honestly, I don't feel like what I ended up with is "right", but it's a fun little idea. If this were going out to the world, I would reconsider this approach, but for my curiosity, here's what I did.

## An image is a request, too

Remember Tracking Pixels? I'm most familiar with them from emails that load a hidden 1x1 image to track you. This would ping back to the server and log some information about you.

So, I added an `img` tag with the `src` of `/post/{id}/read` to the popover. Next, I added the `loading="lazy"` attribute to the image. This means it would only try to "load" the image when the popover opened. I then added an empty `alt` for good measure because it's the right thing to do.

It works! Opening a popover will trigger the request since the "image" is visible. The server handles the rest, so the post won't be in the unread list the next time I load the page.

---

I'll carry on playing around with this. I'll try to build everything without JavaScript; then, I'll return and add enhancements to improve the UX. It's fun coming up with little hacks like this, like the good old days.
