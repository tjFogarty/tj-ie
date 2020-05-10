---
title: "Multi-Select Checkboxes with React"
description: "Listen for hotkeys to select multiple checkboxes in a few clicks."
date: 2019-05-20T20:50:21+01:00
permalink: "/multi-select-checkboxes-with-react/"
layout: layouts/post.njk
tags:
  - react
  - javascript
---

An issue arose recently where a user wanted to be able to hold the Shift key to select a range of items in a list. A pal in work set me off on the right path, but what ended up being approved was quite different as there were multiple things to consider:

- Shift + Click could be in either direction - up or down - to select a range of items.
- Unselecting something combined with Shift + Click could unselect a range of items.
- This works with clicking labels as well as the checkboxes.
- The list could be re-ordered at any time, so we need to operate on the index of a value. So rather than storing an index, we'll store a value and get the index from that when we need it.

Here's what we'll be making. Try checking off an item then hold the Shift key and click on another item further down the list.

<iframe
  src="https://codesandbox.io/embed/multiselect-checkboxes-oennn?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2Flist%2Findex.js&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Multi-Select Checkboxes"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## The Component

Here's the scaffold of the component we'll be making. This looks a bit chunky, but we'll go through the methods individually and fill them in.

``` js
import React, { PureComponent } from "react";

export default class List extends PureComponent {
  // set up state and bindings
  constructor() {}

  // add event listeners
  componentDidMount() {}

  // remove event listeners
  componentWillUnmount() {}

  // handle the `onselectstart` event to prevent it interfering with bulk selection
  handleSelectStart(e) {}

  // listen for the shift keyup
  handleKeyUp(e) {}

  // listen for the shift keydown
  handleKeyDown(e) {}

  // handle toggle checkboxes
  handleSelectItem(e) {}

  // get the next value or range of values to select
  getNextValue(value) {}

  // get the range of items selected with the shift key held down
  getNewSelectedItems(value) {}

  // render our list items
  renderItems() {}

  render() {
    return <ul ref={node => (this.listEl = node)}>{this.renderItems()}</ul>;
  }
}
```

### renderItems

We'll start with rendering the items, as a bunch of code later on will depend on this. We'll be iterating over an array of objects that have a `label` and `id` property. The id is what we'll keep track of in state, and we'll know if it's selected be checking if it's in the `selectedItems` array.

``` js
renderItems() {
  const { items, selectedItems } = this.state;
  return items.map(item => {
    const { id, label } = item;
    return (
      <li key={id}>
        <input
          onChange={this.handleSelectItem}
          type="checkbox"
          checked={selectedItems.includes(id)}
          value={id}
          id={`item-${id}`}
        />
        <label htmlFor={`item-${id}`}>{label}</label>
      </li>
    );
  });
}
```

### constructor

We'll start by setting up the initial state, and binding events to the component.

``` js
constructor() {
  super();

  this.state = {
    items: generateItems(20),
    isShiftDown: false,
    selectedItems: [],
    lastSelectedItem: null
  };

  this.listEl = null;

  this.handleKeyUp = this.handleKeyUp.bind(this);
  this.handleKeyDown = this.handleKeyDown.bind(this);
  this.handleSelectItem = this.handleSelectItem.bind(this);
  this.handleSelectStart = this.handleSelectStart.bind(this);
}
```

First, we'll need some data to iterate over. The `generateItems` method is a small utility function for generating some example data. It goes like this:

``` js
function generateItems(numberOfItems) {
  return [...Array(numberOfItems).keys()].map(i => {
    const num = i + 1;
    return { label: `Item ${num}`, id: `value-${num}` };
  });
}
```

The next bit, `isShiftDown` will keep track of when the Shift key is currently being pressed. That's how we'll know when to trigger our multi-selection.

`selectedItems` will keep track of what has been checked off. We'll use this to toggle items, and also determine if we should be bulk selecting or unselecting items.

Next, if I click item 5 and then hold shift and click item 10, I need to select items 5 through 10. The `lastSelectedItem` will help us do that.

`listEl` will be a reference to our list element, and finally, we'll bind our events to the component. We could use arrow functions as well, but this is how I was raised.

### componentDidMount

We're listening for DOM events, pure and simple:

``` js
componentDidMount() {
  document.addEventListener("keyup", this.handleKeyUp, false);
  document.addEventListener("keydown", this.handleKeyDown, false);
  this.listEl.addEventListener("selectstart", this.handleSelectStart, false);
}
```

The key up/down events will be for detecting when the Shift key is being pressed.

The `selectstart` event is when we're clicking on text, and holding the Shift key. If we do that, it'll select the text rather than the range of items we want. By listening for this, we can decide whether we want to allow the default behaviour or block it.

### componentWillUnmount

This is for cleanup so we don't leave any event listeners hanging around which might try update state on a component that no longer exists on the page.

``` js
componentWillUnmount() {
  document.removeEventListener("keyup", this.handleKeyUp);
  document.removeEventListener("keydown", this.handleKeyDown);
  this.listEl.removeEventListener("selectstart", this.handleSelectStart);
}
```

### handleSelectStart

To be fair, this could be named a bit better to avoid confusion with other selections we'll be making, but it mirrors the DOM event we're handling:

``` js
handleSelectStart(e) {
  if (this.state.isShiftDown) {
    e.preventDefault();
  }
}
```

We only want to disable the text selection if the Shift key is being held down. This way a user can still highlight the items and copy them if they wish.

### handleKeyUp and handleKeyDown

We do a quick check if the Shift key is be pressed, or let go of, and update the state accordingly.

``` js
handleKeyUp(e) {
  if (e.key === "Shift" && this.state.isShiftDown) {
    this.setState({ isShiftDown: false });
  }
}

handleKeyDown(e) {
  if (e.key === "Shift" && !this.state.isShiftDown) {
    this.setState({ isShiftDown: true });
  }
}
```

### handleSelectItem

This is a short and sweet method that will hand off the majority of the work. This will make a call to get the next value(s) for our `selectedItems` and update the state. We'll also store the value as the `lastSelectedItem` for when the next click is made with the Shift key held down.

``` js
handleSelectItem(e) {
  const { value } = e.target;
  const nextValue = this.getNextValue(value);

  this.setState({ selectedItems: nextValue, lastSelectedItem: value });
}
```

### getNextValue

This is where things get a little more involved. Let's ignore the `if (isShiftDown)` block for now and skip to the final return; if the item is already selected, then we return the `selectedItems` without that value. Otherwise, we append it to the array.

If, however, the `isShiftDown` is true, we'll call `getNewSelectedItems` to return an array of items. It's combined with the currently selected items and duplicates are removed using a `Set` which is spread into an array. Sets cannot contain duplicates, so if you try to add an item that already exists, it won't do anything.

If the item isn't in the `selectedItems` array, we know then that it was previously removed. With that we remove anything that isn't a newly selected item - this inverts the selection.

``` js
getNextValue(value) {
  const { isShiftDown, selectedItems } = this.state;
  const hasBeenSelected = !selectedItems.includes(value);

  if (isShiftDown) {
    const newSelectedItems = this.getNewSelectedItems(value);
    // de-dupe the array using a Set
    const selections = [...new Set([...selectedItems, ...newSelectedItems])];

    if (!hasBeenSelected) {
      return selections.filter(item => !newSelectedItems.includes(item));
    }

    return selections;
  }

  // if it's already in there, remove it, otherwise append it
  return selectedItems.includes(value)
    ? selectedItems.filter(item => item !== value)
    : [...selectedItems, value];
}
```

### getSelectedItems

In this final method, we get the index of the last item we selected, and the current one. We then grab the range of those items using `Math.min` and `Math.max` to get the lower and upper index from the `items` array. Rather than returning the array of objects, we map over the results to return only the id.

``` js
getNewSelectedItems(value) {
  const { lastSelectedItem, items } = this.state;
  const currentSelectedIndex = items.findIndex(item => item.id === value);
  const lastSelectedIndex = items.findIndex(
    item => item.id === lastSelectedItem
  );

  return items
    .slice(
      Math.min(lastSelectedIndex, currentSelectedIndex),
      Math.max(lastSelectedIndex, currentSelectedIndex) + 1
    )
    .map(item => item.id);
}
```

---

It took a while to get this right, and even then there's probably plenty of room for improvement. It was an enjoyable problem to solve. I tried doing it with regular JavaScript, and it's a whole different ball game when the state is stored in the DOM instead. My mind has been in React land for the past 2 years, so I never thought of it any other way. It'd be a good exercise to try this out in other frameworks/paradigms.

{% external-link "https://codesandbox.io/s/multiselect-checkboxes-oennn", "View Demo and Source" %}
