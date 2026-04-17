const fs = require("fs");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets/");
    
    eleventyConfig.addFilter("lastModified", (inputPath) => {
        const stats = fs.statSync(inputPath);
        return stats.mtime;
    });

    eleventyConfig.addCollection("allTags", (collectionApi) => {
        const posts = collectionApi.getFilteredByTag("posts");

        const tagSet = new Set();

        for (const post of posts) {
            const tags = post.data.tagList || post.data.tags || [];

            for (const tag of tags) {
                if (tag && tag !== "post") {
                    tagSet.add(tag);
                }
            }
        }
        console.log("All tags:", [...tagSet]);

        return [...tagSet];
    });
};