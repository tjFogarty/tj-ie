---
title: "Building My Site Part II: Setup"
description: "Setting up my new website with Craft CMS."
date: 2018-01-07T14:53:00+00:00
permalink: "/building-my-site-part-ii-setup/"
layout: layouts/post.njk
tags:
- cms
- craft
- twig
---

In the [first part](/building-my-site-part-i-decisions/) of this series I talked about the decisions that led to using the likes of Craft and Laravel Mix. So now it's time to get it all up and running.

## Craft

At the moment, while Craft is in it's release candidate stage, it's only available as a [Composer](https://getcomposer.org/) package. This is set to change once it's ready for a wider release.

I'm using [Valet](https://github.com/laravel/valet) for local development, but you can use whatever suits your workflow provided it meets the requirements, with the main ones being PHP >;= 7 and either MySQL 5.5+ or PostgreSQL 9.5+. It's worth looking at the [full list of requirements](https://github.com/craftcms/docs/blob/master/en/requirements.md) to see what PHP extensions are required as well.

To get a starter project installed, you can run:

``` bash
composer create-project -s RC craftcms/craft PATH_TO_YOUR_PROJECT
```
And within your new project you'll find the file `.env.example` which you can rename to `.env`. This is where you'll fill in your database details, along with any other secrets you want to keep from prying eyes. (If this is going in a git repo, make sure you add `.env` to your `.gitignore`.)

Finally, then, visiting your new site will prompt the installation wizard to begin which you can follow through to install Craft.

### Plugins

Already, Craft 3&#160;[has quite a collection of great plugins](https://plugins.craftcms.com/) and I wasted no time in going through them. To be honest, I only had a few ideas of the things I needed, the rest fell into my life as I figured they'd be nice to have.

- [Contact Form](https://github.com/craftcms/contact-form) - &quot;Add a simple contact form to your Craft CMS site&quot;
- [HTTP2 Server Push](https://github.com/sjelfull/craft3-http2serverpush) - &quot;Automatically add HTTP2 Link headers for CSS, JS and image assets.&quot;
- [Typogrify](https://github.com/nystudio107/craft3-typogrify) - &quot;Typogrify prettifies your web typography by preventing ugly quotes and &#8216;widows' and more&quot;
- [Mix](https://github.com/mister-bk/craft-plugin-mix) - &quot;Helper plugin for Laravel Mix in Craft CMS templates.&quot;
- [Doxter](https://github.com/selvinortiz/craft-plugin-doxter) - &quot;Markdown Editor &amp; Parser for Craft 3.&quot;
- [Redirect Manager](https://github.com/Dolphiq/craft3-plugin-redirect) - &quot;Manage 301 and 302 redirects with an easy to use user interface.&quot;
- [Mailgun](https://github.com/craftcms/mailgun) - &quot;Mailgun integration for Craft CMS.&quot;
- [Pic Puller](https://github.com/jmx2inc/picpuller-for-craft3) - &quot;Integrate Instagram into Craft CMS.&quot;
- [Scout](https://github.com/Rias500/craft3-scout) - &quot;Craft Scout provides a simple solution for adding full-text search to your entries. Scout will automatically keep your search indexes in sync with your entries.&quot;

### Entries and Templates

For the most basic setup, I needed a way to create and display posts. To get started, I went to `Settings >; Sections` and created a new section called `Posts`. The section type was left as `Channel` and I updated the Entry URI Format to `{slug}` and the template to `posts/_entry`.

Next, I needed to create a field for this section to store my post content. Back we go to settings and then `Fields` to click `New Field`. I gave it the name of `Post Content` which generated the handle `postContent` which I'll use in the templates to get the content. After this, I set the field type as `Doxster` to use Markdown.</p>
<p>Finally, I go back to `Settings >; Sections` and add an entry type to Posts. From here I used the drag and drop editor to assign my `postContent` field to the section.</p>
<p>After adding some posts from my old setup, it was then time to dig into the template. Remember when I added the `posts/_entry` information to the template field for the section? Craft maps this to your templates directory, so creating the folder `posts` and the template `_entry.twig` inside it will work to display a single post. At it's most basic, it looks like this:

``` twig
{% raw %}
{% extends 'layouts/default' %}

{% block content %}
  <article>
    <h1>{{ entry.title | typogrify }}</h1>

    <time datetime="{{ entry.postDate.date }}">{{ entry.postDate | date('d M Y') }}</time>

      {{ entry.postContent | typogrify }}
  </article>
{% endblock %}
{% endraw %}
```

The `layouts/default` file is essentially our `html`, `head` and `body` tags which surround our post template. Within the body, you'll have `{% block content %}{% endblock %}` which will signal to Twig to drop the above in that spot.

Next up, I needed to create a listing of those posts on my homepage, so I created the file `index.twig` in the root of the templates folder and added the following:

``` twig
{% raw %}
{% extends 'layouts/default' %}

{% block content %}

  {% paginate craft.entries.section('posts').limit(6) as pageInfo, pageEntries %}

  <ul>
  {% for entry in pageEntries %}
    -
          <h2>
            <a href="/{{ post.slug }}">{{ post.title | typogrify }}</a>
          </h2>
          <time datetime="{{ post.postDate.date }}">{{ post.postDate | date('d M Y') }}</time>

          <p>
                {{ post.postContent | striptags | slice(0, 360) | raw }}&amphellip
          </p>

  {% endfor %}
  </ul>

  {% if pageInfo.prevUrl %}
        <a href="{{ pageInfo.prevUrl }}">Previous Page</a>
  {% endif %}

  {% if pageInfo.nextUrl %}
        <a href="{{ pageInfo.nextUrl }}">Next Page</a>
  {% endif %}

{% endblock %}
{% endraw %}
```

I added in some filters like `striptags`, `slice` and `raw` for the post preview to display a little excerpt from the post content. With that, the basic site was up and running.

### Laravel Mix

Alright, the data is flowing through the templates like the life-blood that it is. Next I needed to inject some styling into the site, peppered with some JavaScript for a few cool interactive features.

You could argue that for something simple, webpack just isn't needed, and you'd be absolutely right. There's nothing wrong with a single CSS file and a few script tags since that's what it all boils down to anyway. I wanted to use some features of JavaScript that needed something extra for them to work across multiple browsers. I felt it would be conducive to a more scalable codebase when things get tacked-on down the line. I could be wrong, but I'm willing to give it a go.

Laravel Mix makes it easy to get started in any web project, as seen in the [installation docs](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/installation.md) it's not just for Laravel.

For example, if I want to have my JavaScript &amp; Less transpiled I can do the following in my `webpack.mix.js` file:

``` js
const mix = require('laravel-mix')

mix
  .setPublicPath('web/')
    .js('web/src/js/main.js', 'assets/js')
    .less('web/src/less/app.less', 'assets/css')
```

It kinda reminds me of Gulp a little bit, and you can always extend it further with plugins or other configuration options.

With that, I can run `npm run watch` to watch my files for changes. In my deployment script I have `npm run production` for an optimised build.

## Just Keep Swimming

So with that, I had a Craft installation set up with my posts, templates were set up to display them, and I had a build process for my assets.

There's still more to do, such as fine-tuning for performance, which I'll cover in a later article. For now though, we have a pretty good start!

[Read Part III: Fine Tuning](/building-my-site-part-iii-fine-tuning/)
