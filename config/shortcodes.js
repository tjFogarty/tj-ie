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
}
