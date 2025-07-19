import Image from "@11ty/eleventy-img";
import path from "path";

async function getResizedImageUrl(src) {
  if (!src) {
    return "";
  }

  const fullSrc = path.join("src/site/assets/images/", src);

  try {
    const metadata = await Image(fullSrc, {
      widths: [300],
      formats: ['auto'],
      outputDir: "./_site/assets/images/",
      urlPath: "/assets/images/",
    });

    const firstFormat = Object.keys(metadata)[0];

    if (!firstFormat) {
      return "";
    }

    const data = metadata[firstFormat];

    if (data && data.length > 0) {
      return data[0].url;
    }
  } catch (e) {
    console.error(`::Error processing image ${fullSrc}:`, e.message);
    return "";
  }

  return "";
}

export function initShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode("glitchText", function (text, nth = 2) {
    if (!text) return '';

    const words = text.split(' ');

    return words.map((word, index) => {
      if (index % nth === 0) {
        return `<span class="glitch-text" aria-label="${word}">${word}</span>`;
      }

      return word;
    }).join(' ');
  });

  eleventyConfig.addNunjucksAsyncShortcode("getResizedImageUrl", getResizedImageUrl);
}
