---
title: "DIY RSS Feed Reader"
description: "Building your own Feed Reader with Vue.js and Node"
date: 2018-02-12T15:44:00+00:00
permalink: "/diy-rss-feed-reader/"
layout: layouts/post.njk
tags:
- javascript
- vue
---

There’s a whole heap of services and apps out there for collating your own personalised list of RSS feeds, and discovering new ones. They all work pretty well, and I’d happily recommend a good few of them.

However, I’m a simple guy with simple needs. So simple in fact, that I figured I’d build my own. I know how that comes across, and the more I re-type and re-read that line the more I hate myself, but I don’t need a lot of features; I want to have a list of feeds, a list of articles for a feed, and a view for a single article. I don’t need a ‘save for later’ feature; I can use Instapaper for that. I don’t need a way to share them; I can use something like Buffer. I want to read a thing, that’s all.

## Feed Me

I like JavaScript, and having a JSON object with data in it that I can iterate over is ideal. How do I get that JSON, though? After a couple of keystrokes on NPM I found [rss-parser](https://www.npmjs.com/package/rss-parser). It does exactly what I was looking for; you pass a URL to a feed, and get JSON back.

This is too straight-forward, though. How do I overcomplicate this?

I created a little project that uses [Express](https://expressjs.com/) to respond to a GET request which returns my feed data.

``` js
const express = require('express');
const Parser = require('rss-parser');
const PORT = process.env.PORT || 5000;

const FEED_LIST = [
  'https://css-tricks.com/feed/',
  'https://codepen.io/posts/feed',
  'https://blog.safia.rocks/rss',
  'https://hnrss.org/frontpage',
  'https://tj.ie/feed.rss',
  'http://github-trends.ryotarai.info/rss/github_trends_javascript_daily.rss'
];

let app = express();

app
  .get('/', (req, res) => {
    let parser = new Parser();

    const feedRequests = FEED_LIST.map(feed => {
      return parser.parseURL(feed);
    })

    Promise.all(feedRequests).then(response => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      // res.setHeader('Access-Control-Allow-Origin', 'some-domain-to-allow.com');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.json(response);
    })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
```

Running `node index.js` and visiting `http://localhost:5000` in your browser then should return a bounty of data.

You could do this with any language you fancy. You might already have a hosting plan where you can fire up a PHP script to do the same thing. For me, I chose [Heroku](https://ww.heroku.com) because of their free plan and integration with GitHub. It suits me to add a feed to the list by updating an array letting Heroku deploy it.

## Heroku

To get going with Heroku I needed to do a few things:

- Sign up for the free plan
- Create a new Node.js app from their dashboard
- Finally, from their dashboard, enable GitHub integration and select the repo and branch I wanted and enable automatic deploys

Next was some configuration — I needed to tell Heroku how to run the app.

To specify what command to run (in this case `node index.js`), I created a new file called `Procfile` in the root of my project. This file contains some process types, and there’s a few, but in this case we only need the `web` process type to fire up our little Express app. So with that, our `Procfile` looks exactly like this:

```
web: node index.js
```

The final piece was to create an `app.json` file. This acts as a sort of description of our app. In this case, it’s a name, description and what docker image to use. The docker image will contain the environment of our app, in this case it’s Node.js.

``` json
{
  "name": "Feeds App",
  "description": "Returns RSS feeds in JSON",
  "image": "heroku/nodejs"
}
```

After pushing your changes, you should see from the dashboard that your app is deploying, and when it’s ready clicking on `Open App` in the top-right corner of your dashboard opens it up in a new tab.

On the free plan, the app will softly fall asleep if there’s been no traffic to it for 30 minutes. It’ll wake up again on the next visit, but it’ll just take a few moments before you get a response while it fumbles for the alarm clock to turn it off, or maybe burst it off a wall.

## Front-end

So this is where it gets far less specific. The means are there to get the data, now it’s a matter of how to display it. For me, I used Vue and hosted it using [CodePen Projects](https://codepen.io/pro/projects). You can have a look at [the source](https://github.com/tjFogarty/feeds-app-fe) and [the demo](https://codepen.io/tjFogarty/project/full/ZPqnVe/) if you’re interested. I mostly work with React, so any chance I get to use Vue I usually take it.

It was a pretty fun weekend project and it gave me the chance to play with some technologies that I otherwise wouldn’t get to use. I treat these projects like a playground for some interesting tech I want to learn while also solving a problem for myself. I wanted an RSS reader that I could tinker with, so now it’s there. I’ll probably keep iterating on it, but it raised an interesting thought for me: I spend my life building things for clients to solve their problems. Why not build something for myself, and sort my own stuff out?
