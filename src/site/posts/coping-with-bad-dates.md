---
title: "Coping with Bad Dates"
description: "Deriving multiple date ranges from a single one when presented with unavailable dates."
date: 2020-10-03T14:49:55.669Z
permalink: "/coping-with-bad-dates/"
layout: layouts/post.njk
tags:
  - javascript
---

In a recent bit of feature-work at my job, I came across an interesting puzzle: Let's create an event spanning multiple days, and if the user is unavailable for any of those days, then split the event to wrap around those days.

Say we want an event spanning the 1st to the 10th. The user is unavailble on the 5th and the 8th. So we instead end up with 3 events: 1st - 4th, 6th - 7th, and 9th - 10th.

We're using [moment](https://www.npmjs.com/package/moment) so that's what you'll see here.

Given a start date, an end date, and some unavailable dates, we'll start with the following:

``` js
import moment from 'moment';

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let start = moment(startDate).clone();

  while (start.isSameOrBefore(endDate, 'day')) {
    dates.push(start.format('YYYY-MM-DD'));
    start = start.add(1, 'day');
  }

  return dates;
}

const startDate = moment('2020-01-01');
const endDate = moment('2020-01-14');
const unavailableDates = ['2020-01-08', '2020-01-11', '2020-01-01', '2020-01-09'];
const originalDates = getDatesInRange(startDate, endDate);
const availableDates = originalDates.filter(oD => !unavailableDates.includes(oD));
```

The `getDatesInRange` function returns a list of each day in a given date range. We're using this so we can remove the unavailable dates from them.

The next piece of the puzzle is to group the dates according to their proximity to one another. Each group of dates consists of subsequent days. If there's a break (the difference in days between the dates we're checking is greater than 1), then we need to start a new group.

I had overcomplicated this to be fair, but thankfully found a solution someone else had come up with. It's using `reduce` which can be a mind-bender at times, though I found it cleaner than the other approach I was taking.

``` js
// https://stackoverflow.com/a/51420305
const groupedDateRanges = availableDates.reduce((acc, date) => {
  const group = acc[acc.length - 1]; // [1]

  if (moment(date).diff(moment(group[group.length - 1] || date), 'days') > 1) { // [2]
    acc.push([date]) // [3]
  } else {
    group.push(date); // [4]
  }

  return acc;
}, [[]]);
```

To start with, our initial value will be an array within an array. The nested arrays will be groups of dates.

1. The current group will be the last value in the array.
2. We'll check if the last date in a group is further than 1 day away from the current date we're checking.
3. If it is, then we create a new group.
4. Otherwise we push the date to our existing group.

The output of the above would be:

``` js
[
  [
    '2020-01-02',
    '2020-01-03',
    '2020-01-04',
    '2020-01-05',
    '2020-01-06',
    '2020-01-07'
  ],
  [ '2020-01-10' ],
  [ '2020-01-12', '2020-01-13', '2020-01-14' ]
]
```

After that we can format things a bit for use in creating new events.

``` js
const allocationDates = groupedDateRanges.map((range) => {
  return {
    start: range[0],
    end: range[range.length - 1],
    days: moment(range[range.length - 1]).diff(range[0], 'd') + 1
  }
});
```

Which results in:

``` js
[
  { start: '2020-01-02', end: '2020-01-07', days: 6 },
  { start: '2020-01-10', end: '2020-01-10', days: 1 },
  { start: '2020-01-12', end: '2020-01-14', days: 3 }
]
```

I'm including the days there as it might be necessary to divide up any extra time durations that might be associated with it.

[View the Gist.](https://gist.github.com/tjFogarty/e6cab497b457286c3fc2e76bfa43a889)
