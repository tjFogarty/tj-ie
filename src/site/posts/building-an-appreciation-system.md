---
title: "Building an Appreciation System"
description: "Using Google Sheets as a back-end, we can record likes on anything we want on a static site."
date: 2019-06-22T22:54:57+01:00
permalink: "/building-an-appreciation-system/"
layout: layouts/post.njk
tags:
  - javascript
---

I've wanted to get around to building a little system for "liking" or "hearting" a post. A may be a small side project, but it's also a chance to experiment with new things. I wanted to display the number of upvotes a post has and let someone upvote it themselves with a tap or a click.

A little while back I saw [Sheetson](https://sheetson.com/)  (_great_ name); it lets you manage a Google Sheet with a quick to learn api. The setup involves sharing edit access to a sheet with an address listed on the site, and once that's done you're good to begin. This seemed like the perfect tool to help with my project, as I'm working on a static site here. I could have gone with lambda functions, but this seemed a little neater, and everything could be kept client-side.

Note: Whenever I shared a sheet to that address I'd get an error email from Google saying it didn't exist, but rest assured it'll work when you make the api calls. Another thing that caught me was it wouldn't work unless there was already a row of data in there. So I first had to manually input some dummy data. Though don't rule out the possibility of me doing something stupid.

The first thing I needed to do was decide on the structure of my sheet. I only needed to record two bits of info: something to identify the page by (in this case it's the slug or path), and how many votes it has.

After this, the next step was to build out a few helpers to interact with the api. I wanted to do 3 things - get all the records, update a record, and create a new record. To do this I leveraged the `Request` and `fetch` api.

``` js
import { SHEET_NAME, SHEET_ID } from './constants'

const baseUrl = `https://api.sheetson.com/v1/sheets/${SHEET_NAME}`
const headers = new Headers({
  'X-Sheetson-Spreadsheet-Id': SHEET_ID,
  'Content-Type': 'application/json'
})

function request(path = '', method = 'GET', data) {
  return new Request(`${baseUrl}${path}`, { method, headers, body: JSON.stringify(data) })
}

export function fetchUpvotes() {
  return fetch(request('?limit=100'))
}

export function addUpvote({ rowIndex, votes }) {
  return fetch(request(`/${rowIndex}`, 'PUT', { votes }))
}

export function createNewRecord(url) {
  return fetch(request('/', 'POST', { url, votes: 1 }))
}
```

If you've ever used axios, and created an instance with it, then imagine this follows the same kind of idea. I created a new instance of the `Request` class, and wrapped it in a `fetch` for each of the other methods. To get them all, I appended a query string for the limit as by default it'll fetch 24. If you have more than 100 you'll need to paginate through the results.

The next step was to build it into the page. With the above code in place, you can make it your own in any JavaScript project, but since I'm running Svelte on my site already, I decided to run with that.

I'm using stores to hold my data like so:

``` js
import { writable, derived } from 'svelte/store'

export const records = writable([])

export const record = derived(records, $records => {
  return $records.find((rec) => rec.url === document.location.pathname)
})
```

The current record is derived from the existing state - it'll find the record with the pathname of the current page.

Next up is the component itself. The first thing to do is to get my imports and local variables in order:

``` js
import { onMount } from 'svelte'
import { records, record } from './stores'
import * as api from './api' // these are the functions created earlier

export let currentRecord // this will be the record for the page we're on
export let hasBeenClicked = false // we'll use this to change the appearance of the button they click
```

Next we need to subscribe, or listen, to `record` so we can assign it to `currentRecord` and use it in our code:

``` js
record.subscribe(value => {
  currentRecord = value
})
```

In the Svelte docs, it's recommended to fetch our data in `onMount` in the cases of server-side rendering. I'm not too concerned with that here, but I think it reads a bit more familar to other frameworks.

``` js
onMount(async () => {
  const response = await api.fetchUpvotes()
  const { results } = await response.json()
  records.set(results)
})
```

The last bit of code we need then is the click handler for the button:

``` js
function handleClickUpvote() {
  const { pathname } = document.location
  hasBeenClicked = true

  if (!currentRecord) {
    api.createNewRecord(pathname)
    return
  }

  const { rowIndex, votes } = currentRecord
  api.addUpvote({ rowIndex, votes: parseInt(votes, 10) + 1 })
}
```

In here, we check if there's an existing record. If there isn't we'll create a new one, which will give it a vote of `1`.
Otherwise, we update the existing one. I needed to do a `parseInt` on the vote count, as it was being returned as a string.

The last thing to do was to add the markup to the Svelte component. It's a little repetitive, but I wanted to make it so after the interaction it becomes a display. It also eagerly updates the vote, so while the request happens in the background, we'll assume it completes by showing the future value straight away.

``` html
{#if hasBeenClicked}
  <div class="c-upvote-button is-active">
    <svg class="c-upvote-button__icon">
      <use xlink:href="#heart"></use>
    </svg>
    <span>
      {#if currentRecord}
      {parseInt(currentRecord.votes, 10) + 1}
      {:else}
      1
      {/if}
    </span>
  </div>
{:else}
  <button
    on:click={handleClickUpvote}
    class="c-upvote-button"
    type="button"
    aria-label="Show your appreciation by tapping or clicking"
    title="Like this post"
  >
    <svg class="c-upvote-button__icon">
      <use xlink:href="#heart"></use>
    </svg>
    {#if currentRecord}
      <span>{currentRecord.votes}</span>
    {:else}
      <span>Be the first to like this!</span>
    {/if}
  </button>
{/if}
```

You can see the {{< external-link href="https://gist.github.com/tjFogarty/ce9c70599823bfc43e5d6eb688fda850" >}}full component code here.{{< / external-link >}}

All that's left is to kick it all off:

``` js
import Upvotes from './upvotes/Upvotes.svelte'
// ...
new Upvotes({
  target: document.querySelector('.js-upvotes') // empty div on the page that it'll render into
})
```

It was a fun Saturday afternoon project that I'm glad I made time for. If it doesn't get much usage, then I'll rebrand it so it's a thumbs down instead, If that gets more traction then I'll need to re-evaluate my life.
