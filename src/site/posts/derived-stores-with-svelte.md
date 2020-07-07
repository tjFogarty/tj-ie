---
title: "Derived Stores With Svelte"
description: "Getting up to speed with derived stores in Svelte and how they compare to something like computed properties in Vue."
date: 2019-05-15T11:25:16+01:00
permalink: "/derived-stores-with-svelte/"
layout: layouts/post.njk
tags:
  - javascript
---

{% external-link "https://svelte.dev/", "Svelte" %} has been getting a lot of attention recently, and rightly so. If you've used the likes of Vue or React in the past then Svelte won't be a million miles away. I recommend following {% external-link "https://svelte.dev/tutorial/basics", "their interactive tutorial" %} if you're interested.

Coming from a Vue background, one feature I love is computed properties. If you want to store some sort of value that depends on the reactive state, but you don't want to manually update it when state changes, this is where they come in. For example, a `greeting` property could return something like `"Hello, ${this.name}!"`. Vue knows to update `greeting` whenever `name` changes.

Svelte offers a similar solution in what it calls derived stores. To show how this works, I created a small app that takes a JSON feed and lets us filter it. The feed contains a list of jobs, and I want to be able to search by job title, and only show remote jobs via a checkbox.

The initial stores would be as follows:

``` js
import { writable } from 'svelte/store'

export const jobs = writable([])
export const searchTerm = writable('')
export const remoteOnly = writable(false)
```

At some stage, when the app is ready, the `jobs` store is populated with an array of jobs from the feed. When I type in the search input the `searchTerm` store is updated, and when I toggle the remote-only checkbox, the `remoteOnly` store is toggled.

Ideally what I'd like to do is avoid editing the `jobs` store. I'd like to keep the original list untouched so I can return to the original state.

This is where I can use derived stores. First I need to import it by updating the top-level import statement:

``` js
import { writable, derived } from 'svelte/store'
```

Now I can declare my derived store.

``` js
export const filteredJobs = derived(
  [jobs, remoteOnly, searchTerm],
  ([$jobs, $remoteOnly, $searchTerm]) => {
    return $jobs
  }
)
```

The first argument is the store or stores, I wish to derive from. You only need to pass an array if you wish to use more than one. The second argument here is the callback, which gets passed the stores we asked for. At the moment we're returning the original `jobs` store untouched. Let's create a function to show only the remote jobs:

``` js
function filterByRemote(jobs, remoteOnly) {
  if (!remoteOnly) return jobs

  return jobs.filter(job => !job.location)
}

export const filteredJobs = derived(
  [jobs, remoteOnly, searchTerm],
  ([$jobs, $remoteOnly, $searchTerm]) => {
    return filterByRemote($jobs, $remoteOnly)
  }
)
```

A remote job here is any job that doesn't have a location set. If `remoteOnly` is set to `false` we'll return the jobs array early.

A similar approach is taken for the search term. It's not the most robust of searches, but it does the job:

``` js
function filterByRemote(jobs, remoteOnly) {
  if (!remoteOnly) return jobs

  return jobs.filter(job => !job.location)
}

function filterBySearchTerm(jobs, searchTerm) {
  if (!searchTerm) return jobs

  return jobs.filter(job => {
    const title = job.title.toLowerCase().replace('-', ' ')
    const formattedTerm = searchTerm.toLowerCase().trim()

    return title.includes(formattedTerm)
  })
}

export const filteredJobs = derived(
  [jobs, remoteOnly, searchTerm],
  ([$jobs, $remoteOnly, $searchTerm]) => {
    return filterBySearchTerm(filterByRemote($jobs, $remoteOnly), $searchTerm)
  }
)
```

If we work from the inside-out, we'll see `filterByRemote` returns an array of jobs, which then becomes the first argument in the call to `filterBySearchTerm`.

That's my first experience with Svelte. Hopefully not the last as it's a refreshing take on what I've been doing previously.

<a href="https://codepen.io/tjFogarty/project/details/XqqnVO" class="c-btn c-btn-primary--inverted" target="_blank" rel="noopener noreferrer">See the demo</a>
<a href="https://github.com/tjFogarty/codepen-job-board-svelte" class="c-btn c-btn-primary" target="_blank" rel="noopener noreferrer">View the source</a>
