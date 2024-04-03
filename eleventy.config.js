import { initWatchTargets } from "./config/watchTargets.js";
import { initPlugins } from "./config/plugins.js";
import { initFilters } from "./config/filters.js";
import { initShortcodes } from "./config/shortcodes.js";
import { initGlobals } from "./config/globals.js";
import { initLayouts } from "./config/layouts.js";
import { initCollections } from "./config/collections.js";
import { initPassthroughs } from "./config/passthroughs.js";
import { initTransforms } from "./config/transforms.js";
import { initMarkdown } from "./config/markdown.js";

export default async function (eleventyConfig) {
  initWatchTargets(eleventyConfig);
  initPlugins(eleventyConfig);
  initFilters(eleventyConfig);
  initShortcodes(eleventyConfig);
  initGlobals(eleventyConfig);
  initLayouts(eleventyConfig);
  initCollections(eleventyConfig);
  initPassthroughs(eleventyConfig);
  initTransforms(eleventyConfig);
  initMarkdown(eleventyConfig);

  eleventyConfig.setLiquidOptions({
    strictFilters: false,
    dynamicPartials: false,
  });

  eleventyConfig.setDataDeepMerge(true);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    passthroughFileCopy: true,
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src/site",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
