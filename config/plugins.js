import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export function initPlugins(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg", "png"],
    urlPath: "/assets/images/",
    outputDir: "./_site/assets/images/",
    widths: [500, 800],
    htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
        sizes: "(max-width: 730px) 100vw, 730px",
			},
			pictureAttributes: {}
		},
  });
}
