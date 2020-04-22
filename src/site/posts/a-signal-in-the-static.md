---
title: "A Signal in the Static"
description: "Moving from Craft CMS to Hugo and Netlify"
date: 2018-08-19T16:28:24+01:00
permalink: "/a-signal-in-the-static/"
tags:
  - cms
  - javascript
  - php
  - craft
layout: layouts/post.njk
---

About a year ago I set out to rebuild my site, and being reared on PHP I opted to go for Craft CMS while it was in beta. I figured it'd be interesting to learn it while it was still in development, and maybe create my own plugins.

Haha. Jokes. I did not. I tried, though, but never really needed anything extra.

I was also using Laravel Forge to automatically deploy whenever I pushed any changes to the master branch. To this day it's still a nice approach, but there's a lot of moving parts. I have a repo, a server that needs to be looked after (like when I updated PHP and broke everything), a database that needs to be backed up, and a CMS with some plugins that need to be kept up to date. Granted, I could not have touched it after day 1 and it would still work just the same, but that's not me. If it ain't broke, go fix it.

That's where the allure of a static site generator comes in. As far as the site goes, everything is in one place. Content lives in Markdown files which makes things pretty portable. I landed on using <a href="https://gohugo.io/" rel="noopener noreferrer" target="_blank">Hugo</a> after seeing some recommendations for it, and in about a day I had my entire site copied over, including CSS and JS. To copy the content I took advantage of the <a href="https://github.com/craftcms/element-api" rel="noopener noreferrer" target="_blank">Element API</a> plugin for Craft to get a JSON object of all my posts. The config file for the plugin looked like this:

``` php
<?php

use craft\elements\Entry;
use craft\helpers\UrlHelper;

return [
  'endpoints' => [
    'posts.json' => [
      'elementType' => Entry::class,
      'criteria' => ['section' => 'posts'],
      'transformer' => function(Entry $entry) {
        return [
          'title' => $entry->title,
          'url' => $entry->url,
          'date_published' => $entry->postDate->format(\DateTime::ATOM),
          'slug' => $entry->slug,
          'body' => $entry->postContent,
          'categories' => $entry->categories->all()
        ];
      },
    ]
  ]
];
```

So when it hit `https://my-site.com/posts.json` it returned everything I needed. I saved this to a file to quickly generate markdown versions like so:

``` js
const posts = require('./data.json')
const fs = require('fs')

function buildCategory({ title }) {
  return `- ${title}`
}

function buildFrontMatter(post) {
  return `---
title: "${post.title.replace(/"/g, '\'')}"
date: ${post.date_published}
draft: false
categories: \n${post.categories.map(buildCategory).join(`\n`)}
---`
}

posts.data.forEach(post => {
  let content = `${buildFrontMatter(post)}\n${post.body}`

  fs.writeFile(`../path/to/final/content/posts/${post.slug}.md`, content, err => {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
})
```

I needed to run `sudo node index.js` on that as it needed to create files, but I didn't have to touch the generated markdown files once they were in the right folder.

Once that was done, I skipped on over to <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify</a> and hooked it up. I needed to do some configuration before everything would work. Mainly this was down to my assets living in a theme which was in a subfolder. To let Netlify know about it, I had to create a new `package.json` in the root with a `build` command that did the following:

``` toml
[build]
publish = "public"
command = "hugo --minify && npm run build"
```

Then the build command in my root `package.json` dug into the folder it needed and ran some more commands:

``` json
"scripts": {
  "build": "cd ./themes/nua && npm install && npm run production"
}
```

After that, it was smooth sailing. Limerick just won the All-Ireland senior hurling final so I'm gonna grab a beer. That makes two victories today. Cheers, agus Luimneach Abú!!!
