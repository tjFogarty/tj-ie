export function initWatchTargets(eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/site/assets");
  eleventyConfig.addWatchTarget("./src/site/_includes");
}
