import browserslist from 'browserslist';
import { transform, browserslistToTargets } from "lightningcss";
import { cache } from './cache.js';

const targets = browserslistToTargets(browserslist('>= 0.25%'));

// https://stackoverflow.com/a/15397495
const nth = (d) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const isDevelopmentMode = process.env.NODE_ENV === 'development';

export function initFilters(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (css, key = 'styles') {
    const config = {
      minify: true,
      code: Buffer.from(css),
      targets
    };

    if (isDevelopmentMode) {
      const { code } = transform(config);
      return code;
    }

    if (!cache.get(key)) {
      const { code } = transform(config);
      cache.set(key, code);
    }

    return cache.get(key);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const day = dateObj.toLocaleDateString("en-GB", { day: "numeric" });
    const monthAndYear = dateObj.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });

    return `${day}${nth(day)} ${monthAndYear}`;
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    return dateObj.toLocaleDateString("en-GB", { year: "numeric" });
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return dateObj.toISOString().split("T")[0];
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1,
    );
  });
}
