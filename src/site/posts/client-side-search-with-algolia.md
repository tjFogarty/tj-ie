---
title: "Client-Side Search with Algolia"
description: "Adding client-side search with Algolia."
date: 2018-01-09T21:54:00+00:00
permalink: "/client-side-search-with-algolia/"
layout: layouts/post.njk
tags:
- javascript
---

I'm going to walk through creating a search feature using {% external-link "https://www.algolia.com/", "Algolia" %}. I'll be using some new features of JavaScript as well, such as async/await, but it can be accomplished just as well without it, and I'll offer up alternatives where it applies.

It's not going to be a magic bullet for everyone, but it's interesting to see how it works, and it can be a solution to add to your toolkit.

## What Do I Need?

- An Algolia account (there's a free tier, as long as you add their logo to your search area)
- Some content you want to be searchable
- A way add your records to an index (you can do this manually, use the API, or if you're using a CMS or a framework there are {% external-link "https://www.algolia.com/integrations", "plenty of solutions" %} readily available)

&quot;Record? Index? <em>What are you on about?</em>&quot; An index is something that holds the data you want to be searchable, and a record is a piece of that data. For example, you could have an index called &quot;posts&quot; that's made up of records of which each represents a  single post. Kinda like:

``` html
<ul data-index="posts"></ul>
    <li data-record="post">
        <h2>My Post Title</h2>
        Oh hey lorem ipsum, dolor sit amet consectetur? Haha, good one adipisicing elit...
    </li>
    <li data-record="post">
        ...
    </li>
    ...
</ul>
```

Or maybe I ruined it. Nam facilis doloribus? Essentially you can then tell Algolia which parts of your posts it can search on. This can be the title, some content, tags, categories etc&#8230; and you can weight them by importance. So a query matching one of your post titles would bump that result to the top over a match in the content of another post.
In the API section of the Algolia dashboard you'll find your Application ID, your Search-Only API Key, and your Admin API Key. If you're using a CMS or framework with an Algolia integration available, there will be spaces for you to enter these. You can also restrict HTTP referers to ensure search will only work on the domains of your choice.
<h2 id="the-code">The Code <a class="anchor" href="#the-code" title="The Code">#" %}</h2>
I'll be using the {% external-link "https://github.com/algolia/algoliasearch-client-javascript", "JavaScript search client" %}, and more specifically the lite client which limits the usage to search only, which will do the job. It'll also save on file size.

Let's install it:

``` bash
npm install algoliasearch --save
```

Next up we'll set up our search input:

``` html
<div class="c-search js-search-container"></div>
  <div class="c-search__inner">
    <label class="c-search__label" for="s">Search:</label>
    <input type="search" class="c-search__input js-search-input" id="s">
    <img src="/images/algolia.svg" class="c-search__credit">
    <div class="js-search-results c-search__results"></div>
  </div>
</div>
```

Those `.js-` prefixed classes will be our hooks. They're not for styling, so it makes the intentions clear when you're looking at the code that some JavaScript is at play here.

For the JavaScript, we'll grab the lite client, and scaffold out some code:

``` js
import algoliasearch from 'algoliasearch/lite'

export const Search = {
  trigger: document.querySelectorAll('.js-search'),
  input: document.querySelector('.js-search-input'),
  resultsContainer: document.querySelector('.js-search-results'),
  index: null,

  init() {
      // bind to `this` so we reference this object rather than the input when it's called
    this.performSearch = this.performSearch.bind(this)

        // supply our application id and search-only api key
    let client = algoliasearch('APPLICATION_ID', 'SEARCH_ONLY_API_KEY')

        // connect to our index
    this.index = client.initIndex('INDEX_NAME')

        // perform a live search as the user types into the input field
    this.input.addEventListener('keyup', this.performSearch)
  },

  async performSearch(event) {},

  displayResults(results) {},

  emptyResultContainer() {},

    // we'll build up the HTML to inject into the container here
  getResultLink(result) {},

  displayNoResults() {}
}
```

So we're grabbing our `.js-` prefixed elements here, and setting up the Algolia client with our credentials to prepare it for the search.
When they `keyup` event is triggered, it'll call the `performSearch` method. It's in here that the query to Algolia is made:

``` js
async performSearch(event) {
    let query = event.target.value

    try {
      let content = await this.index.search({ query })

      if (content.hits && content.hits.length) {
        this.displayResults(content.hits)
      } else {
        this.displayNoResults()
      }
    } catch (e) {
      console.log('Error performing search: ', e)
    }
}
```

I'm using async/await here, but you can use promises as well:

``` js
performSearch(event) {
    let query = event.target.value

    this.emptyResultContainer()

    this.index
      .search({ query })
      .then(content => {
        if (content.hits && content.hits.length) {
          this.displayResults(content.hits)
        } else {
          this.displayNoResults()
        }
      })
      .catch(e => {
        console.log('Error performing search: ', e)
      })
}
```

We're getting closer to displaying the results. To start with we'll outline how the flow works. If we have results, display them, otherwise we'll let the user know nothing was found. After this we'll see about constructing the search hits to inject into the results container:

``` js
displayResults(results) {
    results.forEach(result => {
      let resultLink = this.getResultLink(result)
      this.resultsContainer.appendChild(resultLink)
    })
},

emptyResultContainer() {
    while (this.resultsContainer.firstChild) {
     this.resultsContainer.removeChild(this.resultsContainer.firstChild)
    }
},

displayNoResults() {
    let title = document.createElement('h4')
    title.innerText = 'No results found'
    this.resultsContainer.appendChild(title)
}
```

In `displayResults` we're calling `getResultLink` which we'll use to append the the results container:

``` js
getResultLink(result) {
    let link = document.createElement('a')
    let title = document.createElement('h4')

    link.setAttribute('href', result.url)
    title.innerText = result.title

    link.appendChild(title)

    return link
}
```

And finally here's the snippet in it's entirety:

``` js
import algoliasearch from 'algoliasearch/lite'

export const Search = {
  trigger: document.querySelectorAll('.js-search'),
  input: document.querySelector('.js-search-input'),
  resultsContainer: document.querySelector('.js-search-results'),
  index: null,

  init() {
    this.performSearch = this.performSearch.bind(this)

    let client = algoliasearch('APPLICATION_ID', 'SEARCH_ONLY_API_KEY')

    this.index = client.initIndex('posts')

    this.input.addEventListener('keyup', this.performSearch)
  },

  performSearch(event) {
    let query = event.target.value
    this.emptyResultContainer()

    this.index
      .search({ query })
      .then(content => {
        if (content.hits && content.hits.length) {
          this.displayResults(content.hits)
        } else {
          this.displayNoResults()
        }
      })
      .catch(e => {
        console.log('Error performing search: ', e)
      })
  },

  displayResults(results) {
    results.forEach(result => {
      let resultLink = this.getResultLink(result)
      this.resultsContainer.appendChild(resultLink)
    })
  },

  emptyResultContainer() {
    while (this.resultsContainer.firstChild) {
      this.resultsContainer.removeChild(this.resultsContainer.firstChild)
    }
  },

  getResultLink(result) {
    let link = document.createElement('a')
    let title = document.createElement('h4')

    link.setAttribute('href', result.url)
    title.innerText = result.title

    link.appendChild(title)

    return link
  },

  displayNoResults() {
    let title = document.createElement('h4')
    title.innerText = 'No results found'
    this.resultsContainer.appendChild(title)
  }
}
```

With that, you can call `Search.init()` to kick it all off.

## Lost and Found

No longer do your quality posts need to be buried pages deep, never to be seen again. We've gone through using the lite client to save on file size, but you can use other full-fledged solutions for the framework of your choice for a more out-of-the-box experience.
