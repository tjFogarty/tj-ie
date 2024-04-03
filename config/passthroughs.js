export function initPassthroughs(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/site/assets");
  eleventyConfig.addPassthroughCopy("./src/site/favicon*.*");
  eleventyConfig.addPassthroughCopy("./src/site/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/site/fonts");
  eleventyConfig.addPassthroughCopy("./src/site/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/site/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/site/keybase.txt");
  eleventyConfig.addPassthroughCopy("./src/site/googlea2c3a0ad5b2401f7.html");

}
