import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export function initMarkdown(eleventyConfig) {
  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: `
        <span aria-label="Jump to heading">#</span>
      `,
      placement: "before",
      class: "c-post__direct-link",
    }),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);
}
