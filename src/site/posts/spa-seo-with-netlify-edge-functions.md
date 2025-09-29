---
title: "Single Page Application SEO with Edge Functions"
description: "How to use Netlify Edge Functions to enhance your single-page application SEO."
date: 2025-09-29T11:00:00.000+01:00
permalink: "/spa-seo-with-netlify-edge-functions/"
coverPreview: edge-seo.png
cover: "https://tj.ie/assets/images/edge-seo.png"
layout: layouts/post.njk
tags:
  - seo
  - spa
  - javascript
---

Since I’ve been working on [Swatcher](https://swatcher.ie), I’ve struggled with the idea of SEO. From my experience, Google does crawl pages on a SPA successfully, but occasionally I find it won’t capture some meta tags. Perhaps that’s due to a delay in rendering when we update the meta tags on the client side. I also don’t know how other search engines handle SPAs.

With that in mind, I wanted to provide the proper meta tags ahead of time, and potentially open the door to something closer to server-side rendering.

## Edge Functions

With Netlify, we have access to [Edge Functions](https://docs.netlify.com/build/edge-functions/overview/). These are distributed globally and help ensure that users from anywhere in the world receive a quick response.

In my case, I wanted to inject meta tags for paint information. So to start, I created a function in `netlify/edge-functions/paint.ts`.

Next, in `netlify.toml`, I added the following to ensure any paint detail pages get routed to this function:

``` toml
[[edge_functions]]
  function = "paint"
  path = "/paint/*"
```

For easier modification of HTML, I installed [cheerio](https://github.com/cheeriojs/cheerio).

With those in place, here’s a basic idea of how the function looks:

``` ts
import * as cheerio from 'cheerio';

export default async (request: Request) => {
  try {
    const url = new URL(request.url);
    const paintId = url.pathname.split('/').pop();

    if (!paintId) {
      return new Response('Bad Request...', {
        status: 400,
      });
    }

    const paint = /* get paint details */

    if (!paint) {
      return new Response(
        'Not Found...',
        {
          status: 404,
        },
      );
    }

    const baseUrl = `${url.protocol}//${url.host}/index.html`;

    const htmlResponse = await fetch(baseUrl);
    const html = await htmlResponse.text();
    const $ = cheerio.load(html);

    const title = `${paint.name} by ${paint.brand} | Swatcher`;
    const description = `Explore ${paint.name} by ${paint.brand}...`;
    const themeColor = paint.hex;

    const themeMetaTag = `<meta name="theme-color" content="${themeColor}" />`;
    $('head').find('meta[name="theme-color"]').remove();
    $('head').append(themeMetaTag);

    const titleTag = `<title>${title}</title>`;
    $('head').find('title').remove();
    $('head').append(titleTag);

    const metaTag = `<meta name="description" content="${description}" />`;
    $('head').find('meta[name="description"]').remove();
    $('head').append(metaTag);

    return new Response($.html(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new Response(
      `Edge function error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      },
    );
  }
};

```

Once deployed, and I visit a paint detail page, I can see that the HTML now contains the desired meta tags from the server.

## Going Further

This is a simple example, but you could go further by making any data requests here as well. You can inject a script into your HTML with pre-fetched data, allowing the page to appear to load instantly.

