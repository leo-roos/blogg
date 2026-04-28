const fs = require("fs");
const characters = require("./assets/characters.json");
const sassPlugin = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

module.exports = function(eleventyConfig) {
    const watchFolders = [
        "./assets/characters.json",
        "./assets/Fonts",
        "./assets/Images",
        "./assets/js"
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

    eleventyConfig.addCollection("characters", (collectionApi) => {
        const charactersSet = new Set();
        for (const character of characters) {
            charactersSet.add(character);
        }

        return [...charactersSet];
    });

    eleventyConfig.addPlugin(sassPlugin, {
        watch: ["assets/index.scss"]
    });
};