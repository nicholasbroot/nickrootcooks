// .eleventy.js (faceted)
const Image = require("@11ty/eleventy-img");


module.exports = function (eleventyConfig) {
const FACETS = ["season", "cuisine", "course"]; // boolean handled separately


eleventyConfig.addCollection("recipes", (api) =>
api.getFilteredByGlob("src/recipes/*.md")
);


// Build a facet map: { season: [..], cuisine: [..], course: [..] }
eleventyConfig.addCollection("facetMap", (api) => {
const map = Object.fromEntries(FACETS.map(f => [f, new Set()]));
for (const item of api.getFilteredByGlob("src/recipes/*.md")) {
for (const f of FACETS) {
const vals = item.data[f] || [];
(Array.isArray(vals) ? vals : [vals]).filter(Boolean).forEach(v => map[f].add(String(v)));
}
}
// convert Sets to sorted arrays
return Object.fromEntries(Object.entries(map).map(([k, set]) => [k, Array.from(set).sort((a,b)=>a.localeCompare(b))]));
});


eleventyConfig.addPassthroughCopy({ "src/images": "images" });


eleventyConfig.addNunjucksAsyncShortcode("img", async (src, alt) => {
let metadata = await Image(`src${src}`, { formats: ["webp", "jpeg"], urlPath: "/images/", outputDir: "_site/images" });
let image = metadata.jpeg[0];
return `<img src="${image.url}" width="${image.width}" height="${image.height}" alt="${alt || ""}">`;
});


return {
dir: { input: "src", includes: "_includes", output: "_site" },
pathPrefix: "/nickrootcooks/",
markdownTemplateEngine: "njk",
htmlTemplateEngine: "njk",
};
};