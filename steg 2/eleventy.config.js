const fs = require("fs");
const characters = require("./assets/characters.json");
const sassPlugin = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

module.exports = async function(eleventyConfig) {
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
    eleventyConfig.addWatchTarget("./assets/scss");

    function formatDate(date, showDate, showTime) {
        let formattedDate = "";

        if (showDate) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            formattedDate += `${year}-${month}-${day}`;
        }

        if (showTime) {
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            formattedDate += `${showDate ? " " : ""}${hours}:${minutes}`;
        }

        return formattedDate;
    }

    eleventyConfig.addFilter("postDate", (date) => {
        return formatDate(date, true, false);
    });

    eleventyConfig.addFilter("postDateTime", (date) => {
        return formatDate(date, true, true);
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

    eleventyConfig.addCollection("characters", () => {
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