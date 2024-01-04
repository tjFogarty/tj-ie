---
title: "Scrollable Container Controls with React Hooks"
description: "Revisiting some old code to convert it to using hooks."
date: 2023-12-04T17:55:42+01:00
permalink: "/scrollable-container-controls-with-react-hooks/"
layout: layouts/post.njk
coverPreview: "react-scroll.png"
tags:
  - javascript
  - react
---

I wanted to rewrite this code to use hooks so it can stay relevant. You can view the old post [at this link](/scrollable-container-controls-with-react/).

Here's the new code using React Hooks, scroll below for a demo:

``` jsx
import React, { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

export const ScrollableContainer = () => {
  const [items, setItems] = useState([...Array(10).keys()]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef(null);

  const checkForScrollPosition = () => {
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const pos = Math.ceil(scrollLeft);

    setCanScrollLeft(pos > 0);
    setCanScrollRight(pos !== scrollWidth - clientWidth);
  };

  const debounceCheckForScrollPosition = debounce(checkForScrollPosition, 200);

  const handleClickAddItem = () => {
    setItems([...items, items.length]);
  };

  const handleClickRemoveItem = () => {
    setItems(items.slice(0, -1));
  };

  const scrollContainerBy = (distance) => {
    containerRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  useEffect(() => {
    checkForScrollPosition();

    containerRef.current.addEventListener(
      "scroll",
      debounceCheckForScrollPosition,
    );

    return () => {
      containerRef.current.removeEventListener(
        "scroll",
        debounceCheckForScrollPosition,
      );
    };
  }, []);

  useEffect(() => {
    checkForScrollPosition();
  }, [items]);

  const listItems = items.map((item) => {
    return (
      <li className="item" key={item}>
        {item + 1}
      </li>
    );
  });

  const controls = (
    <div className="item-controls">
      <button
        type="button"
        disabled={!canScrollLeft}
        onClick={() => {
          scrollContainerBy(-200);
        }}
      >
        Previous
      </button>

      <button type="button" onClick={handleClickAddItem}>
        Add Item
      </button>

      <button type="button" onClick={handleClickRemoveItem}>
        Remove Item
      </button>

      <button
        type="button"
        disabled={!canScrollRight}
        onClick={() => {
          scrollContainerBy(200);
        }}
      >
        Next
      </button>
    </div>
  );

  return (
    <>
      <ul className="item-container" ref={containerRef}>
        {listItems}
      </ul>
      {controls}
    </>
  );
};
```

<iframe src="https://codesandbox.io/embed/lksgfr?view=Editor+%2B+Preview&module=%2Fsrc%2FScrollableContainer.jsx"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="practical-browser-lksgfr"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
