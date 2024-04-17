import Image from "@11ty/eleventy-img";

export function initShortcodes(eleventyConfig) {
  function postThumbnailShortcode(src, className = "", alt = "") {
    Image(`./src/site/assets/images/${src}`, {
      widths: [400, 800, 1200],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });

    const attrs = {
      alt,
      class: className,
      sizes: "400px, 1000px",
      loading: "lazy",
      decoding: "async",
    };

    const metadata = Image.statsSync(`./src/site/assets/images/${src}`, {
      widths: [400, 800, 1200],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });

    return Image.generateHTML(metadata, attrs);
  }

  async function imageShortcode(
    src,
    alt = "",
    sizes = "(min-width: 922px) 900px, 100vw",
    widths = [400, 600, 700, 800, 900, 1000],
  ) {
    const metadata = await Image(`./src/site/assets/images/${src}`, {
      widths,
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });

    const attrs = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, attrs, {
      whitespaceMode: "inline",
    });
  }

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addShortcode("postThumbnail", postThumbnailShortcode);
  eleventyConfig.addNunjucksShortcode("postThumbnail", postThumbnailShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
}
