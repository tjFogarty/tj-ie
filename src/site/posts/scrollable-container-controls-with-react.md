---
title: "Scrollable Container Controls with React"
description: "Managing a scrollable container with React by adding button controls, and seeing when they should be enabled or disabled."
date: 2019-05-03T19:15:42+01:00
permalink: "/scrollable-container-controls-with-react/"
layout: layouts/post.njk
coverPreview: "react-scroll.png"
tags:
  - javascript
  - react
---

__Update__: If you would like to use Hooks instead, I've posted an updated version of the code here: [Scrollable Container Controls with React Hooks](/scrollable-container-controls-with-react-hooks/)

The below still serves as an explanation of the code, and so still has value if you're interested to learn more about it.

---

I recently had to solve an issue: A container has a list of items which can be scrolled horizontally. However, it is not obvious you can scroll if a scrollbar isn't visible. This is the case sometimes depending on OS and user preferences.

The agreed solution was to add some buttons to let the user know there's more content available. Clicking these buttons would scroll either backwards or forwards. Seems straight-forward enough, though there were some things to consider:

- We need to know if there is overflow on a given container.
- A button should be disabled if there isn't any more content to scroll left or right to.
- We should re-evaluate if there's overflow and if we can scroll whenever a new item is added or removed.

For the purposes of showing how I ended up with a solution, I won't be doing the following:

- Writing optimised code - I don't want to go off on a tangent and refactor with hooks, or HoCs. This demo exists in a world where it'll only be used in one place, ever.
- Nice styles.

Also, a chunk of this isn't really React-specific. You could take the DOM parts out and drop them into any other setup that you'd like. My use-case just happened to `require('react')`.

<iframe
  src="https://codesandbox.io/embed/github/tjFogarty/scrollable-container-react/tree/master/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FScrollableContainer.js&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="scrollable-container"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Setup

If you don't want to go through the initial setup on your own machine you can use [CodeSandbox](https://codesandbox.io/s/) and select the React preset.

I'm going to work off of a fresh install of [Create React App](https://github.com/facebook/create-react-app) by typing the following into my terminal:

``` bash
npx create-react-app scrollable-container
```

If you're unfamiliar with `npx`, you can [read the announcement.](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) It'll do a bunch of interesting things, but for our use case it'll let us use <abbr title="Create React App">CRA</abbr> without installing it globally first.

Once that's done, I'll `cd` into my new project directory and run `npm start`, or `yarn start` which will give us a development server on `localhost:3000` by default. Next, I'll clear out bits of `src/App.js` that I don't need so I'm left with this:

``` js
import React from 'react';

function App() {
  return (
    <div className="App">

    </div>
  );
}

export default App;
```

I'm then going to delete `src/App.css` and update `src/index.css` for some initial styles.

``` css
*, *:before, *:after {
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

I'm setting the `body` to `display: flex` because I plan on having only one node in there, so this is more of a convenience to centre it in the page.

In the last part of the setup, we'll create the component where all the interesting stuff is going to happen. I'm going to call it `ScrollableContainer` in a new `components` folder in the `src` directory. I'll also add some styles.

``` js
import React, { PureComponent } from 'react'
import debounce from 'lodash.debounce'

export default class ScrollableContainer extends PureComponent {
  constructor() {
    super()

    this.state = {
      items: [...Array(7).keys()],
      hasOverflow: false,
      canScrollLeft: false,
      canScrollRight: false
    }

    this.handleClickAddItem = this.handleClickAddItem.bind(this)
    this.handleClickRemoveItem = this.handleClickRemoveItem.bind(this)

    this.checkForOverflow = this.checkForOverflow.bind(this)
    this.checkForScrollPosition = this.checkForScrollPosition.bind(this)

    this.debounceCheckForOverflow = debounce(this.checkForOverflow, 1000)
    this.debounceCheckForScrollPosition = debounce(
      this.checkForScrollPosition,
      200
    )

    this.container = null
  }

  checkForScrollPosition() {}

  checkForOverflow() {}

  handleClickAddItem() {
    this.setState(state => {
      return {
        items: [...state.items, state.items.length]
      }
    })
  }

  handleClickRemoveItem() {
    this.setState(state => {
      return {
        items: state.items.slice(0, -1)
      }
    })
  }

  buildItems() {
    return this.state.items.map(item => {
      return (
        <li className="item" key={item}>
          {item + 1}
        </li>
      )
    })
  }

  buildControls() {
    return (
      <div className="item-controls">
        <button type="button">Previous</button>

        <button type="button" onClick={this.handleClickAddItem}>
          Add Item
        </button>

        <button type="button" onClick={this.handleClickRemoveItem}>
          Remove Item
        </button>

        <button type="button">Next</button>
      </div>
    )
  }

  render() {
    return (
      <>
        <ul
          className="item-container"
          ref={node => {
            this.container = node
          }}
        >
          {this.buildItems()}
        </ul>
        {this.buildControls()}
      </>
    )
  }
}
```

``` css
.App {
  max-width: 500px;
}

.item-container {
  display: flex;
  overflow-x: scroll;
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  padding: 30px;
  margin-right: 2px;
  background-color: coral;
  flex-shrink: 0;
}

.item-controls {
  text-align: center;
}
```

That's a fair sized chunk of code. We've started installing `lodash.debounce` with `npm install lodash.debounce` in order to ease up on the DOM events we'll be hooking into, which are bound in the constructor.

The rest of the code displays the items and is responsible for adding, and removing items. We also capture a reference to the container, which we will call via `this.container`.

Next up, we'll start filling in the stubs.

## Check for Overflow

To check for an overflow, we'll need to check the width of the container vs its scroll width. We can do that, and set the result as follows in the `checkForOverflow` method:

``` js
checkForOverflow() {
  const { scrollWidth, clientWidth } = this.container
  const hasOverflow = scrollWidth > clientWidth

  this.setState({ hasOverflow })
}
```

Nothing will happen until we call that method, and there's a couple of ways we'll do it.

First up we'll add a `componentDidMount` method, and we can do the following:

``` js
componentDidMount() {
  this.checkForOverflow()
}
```

However, you'll only see the state change `hasOverflow` if the initial count of items warrants an overflow. If you change `items: [...Array(7).keys()]` to `items: [...Array(15).keys()]` then you should see the state change in React Dev Tools when the component mounts.

If we leave it back at 7 though, we'll need to consider when someone adds or removes an item. This is where the `componentDidUpdate` lifecycle method comes in. We can check if the length of the previous items array is different from the current one.

``` js
componentDidUpdate(prevProps, prevState) {
  if (prevState.items.length !== this.state.items.length) {
    this.checkForOverflow()
  }
}
```

Try adding and removing items now, and you'll see `hasOverflow` changing.
There are some things you can do with this, such as showing and hiding the controls if you so wish, or use it to change the styles.

## Enable/Disable Controls

You can see in the state we have `canScrollLeft` and `canScrollRight`. We'll use these to enable and disable the controls.

So for starters let's update the buttons `disabled` property to use these:

``` js
buildControls() {
  const { canScrollLeft, canScrollRight } = this.state
  return (
    <div className="item-controls">
      <button type="button" disabled={!canScrollLeft}>
        Previous
      </button>

      {/* ... add and remove buttons ... */}

      <button type="button" disabled={!canScrollRight}>
        Next
      </button>
    </div>
  )
}
```

Based on the initial state, both of these should be disabled, so let's figure out when they should be clickable.

``` js
checkForScrollPosition() {
  const { scrollLeft, scrollWidth, clientWidth } = this.container

  this.setState({
    canScrollLeft: scrollLeft > 0,
    canScrollRight: scrollLeft !== scrollWidth - clientWidth
  })
}
```

If the `scrollLeft` is greater than 0, then we know the container has been scrolled a bit. It represents the number of pixels scrolled from the left.

To check if we can scroll right, we need to look at the `scrollWidth` of the container, which will be the entire length of the container if the overflow wasn't hidden, and the `clientWidth` which is the width we can physically see.

Say the `scrollWidth` is 600, and the `clientWidth` is 500. If we subtract those, we get 100 which is the maximum value `scrollLeft` can be. As long as `scrollLeft` isn't 100, we know there's still more to scroll.

In order to get this method called, we'll need to add some more code into `componentDidMount` to listen for scroll events on the container, to ensure we have access to the container ref. We'll also add an initial call to `this.checkForScrollPosition()` in case we have a large number of items on mount that need to be scrollable.

``` js
componentDidMount() {
  this.checkForOverflow()
  this.checkForScrollPosition()

  this.container.addEventListener(
    'scroll',
    this.debounceCheckForScrollPosition
  )
}
```

Finally, we'll need to update `componentDidUpdate` to check again. This covers an issue where you've scrolled to the end of the container, and clicked `Add Item`. You'll see the next button is still disabled even though there's new space to scroll.

``` js
componentDidUpdate(prevProps, prevState) {
  if (prevState.items.length !== this.state.items.length) {
    this.checkForOverflow()
    this.checkForScrollPosition()
  }
}
```

Adding some more items, and scrolling the container, you'll see the buttons toggle between enabled and disabled.

## Scrolling the Container

The last step is to make those next and previous buttons actually do something. To start, we'll create the method that will scroll the container:

``` js
scrollContainerBy(distance) {
  this.container.scrollBy({ left: distance, behavior: 'smooth' })
}
```

This will accept a number which will scroll the container, and it'll be a smooth scroll as well to make it look profesh. If we pass 200 into there, it'll scroll to the right 200px, and we can then pass -200 to go the opposite way. That leaves our buttons like this:

``` js
buildControls() {
  const { canScrollLeft, canScrollRight } = this.state
  return (
    <div className="item-controls">
      <button
        type="button"
        disabled={!canScrollLeft}
        onClick={() => {
          this.scrollContainerBy(-200)
        }}
      >
        Previous
      </button>

      {/* ... add and remove buttons ... */}

      <button
        type="button"
        disabled={!canScrollRight}
        onClick={() => {
          this.scrollContainerBy(200)
        }}
      >
        Next
      </button>
    </div>
  )
}
```

Finally then to wrap it all up, we need to remove our event listeners in `componentWillUnmount`. We'll need to call `cancel` on the debounced method in case it fires after unmounting, and it tries updating state on a component that doesn't exist anymore.

``` js
componentWillUnmount() {
  this.container.removeEventListener(
    'scroll',
    this.debounceCheckForScrollPosition
  )
  this.debounceCheckForOverflow.cancel()
}
```
