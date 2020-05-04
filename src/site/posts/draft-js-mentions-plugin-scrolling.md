---
title: "DraftJS: Mentions Plugin with Scrolling and Keyboard Navigation"
description: "Solving the problem of a scrolling results list with the DraftJS mentions plugin."
date: 2020-05-04T14:36:00+01:00
permalink: "/draft-js-mentions-plugin-scrolling-keyboard/"
layout: layouts/post.njk
cover_image: draftjs-mentions.jpg
tags:
- javascript
- react
---

A good while back I had to solve an issue where we were using the {% external-link "https://www.draft-js-plugins.com/plugin/mention", "Mention plugin for DraftJS" %}.

We wanted to have a longer list of mention suggestions, and manage the overflow by letting the user scroll the list. This idea itself isn't a big issue, but what if you were using the keyboard to navigate?

This is where a custom `<Entry />` component was required. When using your custom component you get access to a collection of props such as mouse handlers, the mention object itself, and what we're interested in, which is `isFocused`.

With `isFocused` we can trigger a call to scroll the focused option into view. We can do this by attaching a `ref` to our custom component, and with `useEffect` being called when the focus changes, we can call one of two appropriate methods:

- {% external-link "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded", "scrollIntoViewIfNeeded" %}
- {% external-link "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView", "scrollIntoView" %}

`scrollIntoViewIfNeeded` is non-standard, and has limited support. It does offer the expected behaviour, though, both for moving up and down the list.

`scrollIntoView` is more widely supported, and offers us expected behaviour moving down the list, but not up.

``` jsx
import React, { useRef, useEffect } from "react";

export default function Entry({
  mention,
  isFocused,
  id,
  onMouseUp,
  onMouseDown,
  onMouseEnter
}) {
  const entryRef = useRef(null);
  let className = "mention-text";

  if (isFocused) {
    className += " mention-focused";
  }

  useEffect(() => {
    if (isFocused) {
      if ("scrollIntoViewIfNeeded" in document.body) {
        entryRef.current.scrollIntoViewIfNeeded(false);
      } else {
        entryRef.current.scrollIntoView(false);
      }
    }
  }, [isFocused]);

  return (
    <div
      ref={entryRef}
      className={className}
      role="option"
      aria-selected={isFocused ? "true" : "false"}
      id={id}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
    >
      {mention.name}
    </div>
  );
}
```

## Demo

<iframe
     src="https://codesandbox.io/embed/dazzling-brown-1mlbh?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fentry.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dazzling-brown-1mlbh"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
