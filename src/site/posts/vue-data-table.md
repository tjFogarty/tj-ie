---
title: "Vue Data Table"
description: "Exploring how to tackle a data table in Vue without relying on third-party solutions."
date: 2020-10-25T21:08:03.932Z
permalink: "/vue-data-table/"
layout: layouts/post.njk
tags:
- javascript
- vue
---

A requirement arose in work the other week where a data table would be needed to complete the development of a new feature. I wanted to have a go at a custom implementation to see if I could figure it out. In the meantime, a colleague had already created their own version which is far better to this one, but I figured it was interesting enough and worth sharing as a starting point for others.

One major item this doesn't cover is virtualisation, whereby rows are rendered conditionally based on them being visible within a scrollable table. Instead, I've opted for pagination.

Here's the result:

<iframe src="https://codesandbox.io/embed/nameless-pond-m1plt?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="nameless-pond-m1plt"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

The full code is available in the sandbox above, but I want to outline a couple of the important bits.

The table requires two props:

1. `data` - an array of objects that you want to display. In this case, it's a collection of users.
2. `columns` - an array of columns for our table which contains information like which value to display from the data, which component should be responsible for rendering it (if any is provided), and how to sort it.

The data is an array of objects with the following shape with `faker` generating the information:

``` js
{
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  distance: faker.random.number(),
  favouriteWord: faker.lorem.word()
}
```

The columns are the heavy-lifters here, and for the name it has the following properties:

``` js
{
  title: "Name",
  component: NameCell,
  sort: (a, b) => {
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }

    return -1;
  }
}
```

Usually we'd look for a `value` property to render, but we have a component in this case which is used as follows:

``` html
<component v-if="column.component" :is="column.component" :data="item" />
<template v-else>
  {% raw %}{{ item[column.value] }}{% endraw %}
</template>
```

This `NameCell` component would be passed a user object to manage the display.

Finally the sort will set the current sort to the title of the column, which knows then the sort function associated with it.
