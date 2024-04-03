export function initGlobals(eleventyConfig) {
  eleventyConfig.addNunjucksGlobal("socials", [
    { link: "https://github.com/tjFogarty/", label: "GitHub", icon: "github" },
    {
      link: "https://www.linkedin.com/in/fogartytj/",
      label: "LinkedIn",
      icon: "linkedin",
    },
    { link: "/index.xml", label: "RSS", icon: "rss" },
  ]);
}
