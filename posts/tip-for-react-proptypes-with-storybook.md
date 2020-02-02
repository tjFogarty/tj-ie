---
title: "Tip for React PropTypes with Storybook"
date: 2017-07-20T00:00:00+01:00
permalink: "/tip-for-react-proptypes-with-storybook/"
layout: layouts/post.njk
tags:
- javascript
- react
---

I've recently begun working with React.js, and I'm really enjoying it! There's so much to learn, but there's one tip I've picked up that's saving me some time.

I was doing some research and I came across this brilliant article called <a href="https://cheesecakelabs.com/blog/css-architecture-reactjs/" target="_blank" rel="noopener">CSS Architecture with ReactJS</a>. In it was a clever way of defining our props once, and re-using across prop types and stories in <a href="https://storybook.js.org/" target="_blank" rel="noopener">Storybook</a>.

We're going to be using `Object.values`. From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values" target="_blank" rel="noopener">MDN</a>:

>The Object.values() method returns an array of a given object's own enumerable property values, in the same order as that provided by a for&#8230;in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well).

---

Let's say we have a `<Button />` component that we can apply different themes to. We can set it up like so in our `src/components/button/index.js` file:


``` js
export const ButtonTheme = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
}
```

Then, we can define our prop types:


``` js
Button.propTypes = {
  theme: PropTypes.oneOf(Object.values(ButtonTheme))
}
```

Finally then, in `stories/button.js` we can pull this in and reference it:


``` jsx
import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, select} from '@storybook/addon-knobs'
import Button, { ButtonTheme } from '../src/components/button'

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Simple button', () => (
    <Button
      theme={select(
        'Theme',
        Object.values(ButtonTheme),
        ButtonTheme.PRIMARY)
      }
    >
      Click me!
    </Button>
))
```

So we only have to define the different themes once, and it'll propogate across our prop types and 'knobs' in Storybook automatically! Magic.

