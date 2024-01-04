---
title: "Multi-Select Checkboxes with React Hooks"
description: "An old code demo revised to use React Hooks."
date: 2023-12-04T13:07:21+01:00
permalink: "/multi-select-checkboxes-with-react-hooks/"
layout: layouts/post.njk
coverPreview: "checkboxes.png"
tags:
  - react
  - javascript
---

I felt like revisiting this bit of code from a few years ago, since it still gets a bit of traffic. You can view the old post [at this link](/multi-select-checkboxes-with-react/).

Here's the new code using React Hooks, scroll below for a demo:

``` jsx
import React, { useState, useRef, useEffect } from "react";

function generateItems(numberOfItems) {
  return [...Array(numberOfItems).keys()].map((i) => {
    const num = i + 1;
    return { label: `Item ${num}`, id: `value-${num}` };
  });
}

export const ListComponent = () => {
  const listEl = useRef(null);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const [items] = useState(generateItems(20));

  function handleKeyUp(e) {
    if (e.key === "Shift") {
      setIsShiftDown(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Shift") {
      setIsShiftDown(true);
    }
  }

  function handleSelectStart(e) {
    // if we're clicking the labels it'll select the text if holding shift
    if (isShiftDown) {
      e.preventDefault();
    }
  }

  function getNewSelectedItems(value) {
    const currentSelectedIndex = items.findIndex((item) => item.id === value);
    const lastSelectedIndex = items.findIndex(
      (item) => item.id === lastSelectedItem,
    );

    return items
      .slice(
        Math.min(lastSelectedIndex, currentSelectedIndex),
        Math.max(lastSelectedIndex, currentSelectedIndex) + 1,
      )
      .map((item) => item.id);
  }

  function getNextValue(value) {
    const hasBeenSelected = !selectedItems.includes(value);

    if (isShiftDown) {
      const newSelectedItems = getNewSelectedItems(value);
      // de-dupe the array using a Set
      const selections = [...new Set([...selectedItems, ...newSelectedItems])];

      if (!hasBeenSelected) {
        return selections.filter((item) => !newSelectedItems.includes(item));
      }

      return selections;
    }

    // if it's already in there, remove it, otherwise append it
    return selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
  }

  function handleSelectItem(e) {
    const { value } = e.target;
    const nextValue = getNextValue(value);

    setSelectedItems(nextValue);
    setLastSelectedItem(value);
  }

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);
    listEl.current.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keydown", handleKeyDown);
      listEl.current.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isShiftDown]);

  const listItems = items.map((item) => {
    const { id, label } = item;
    return (
      <li key={id}>
        <input
          onChange={handleSelectItem}
          type="checkbox"
          checked={selectedItems.includes(id)}
          value={id}
          id={`item-${id}`}
        />
        <label htmlFor={`item-${id}`}>{label}</label>
      </li>
    );
  });

  return <ul ref={listEl}>{listItems}</ul>;
};
```

<iframe src="https://codesandbox.io/embed/5txs9v?view=Editor+%2B+Preview&module=%2Fsrc%2FList.jsx"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="condescending-hamilton-5txs9v"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
