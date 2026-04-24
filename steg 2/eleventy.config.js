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

    eleventyConfig.addFilter("postDate", (date) => {
        let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return formattedDate;
    });

    eleventyConfig.addFilter("postDateTime", (date) => {
        let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedDate;
    });

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