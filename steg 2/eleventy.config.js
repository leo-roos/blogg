const fs = require("fs");

module.exports = function(eleventyConfig) {
    const watchFolders = [
        "./assets/Fonts",
        "./assets/Images",
        "./assets/index.css",
    ]
    for (let index = 0; index < watchFolders.length; index++) {
        const element = watchFolders[index];
        eleventyConfig.addPassthroughCopy(element);
        eleventyConfig.addWatchTarget(element);
    }

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

        return [...tagSet];
    });
};