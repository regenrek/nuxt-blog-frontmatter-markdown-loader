const path = require("path");
var glob = require('glob');
import Mode from 'frontmatter-markdown-loader/mode'


/* https://github.com/jake-101/bael-template */
async function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      var filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: "content" })
        .map(filepath => `${url}/${path.basename(filepath, ".md")}`);
    })
  );
}

export default async() => {
  return {
    /*
    ** Rendering mode
    ** Doc: https://nuxtjs.org/api/configuration-mode
    */
    mode: "spa",

    /*
    ** Headers of the page
    ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
    */
    head: {
      title: "Nuxt.js starter for CSB",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Official Nuxt.js starter for CodeSandBox"
        }
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    /*
    ** Nuxt.js modules
    ** Doc: https://nuxtjs.org/guide/modules
    */
    modules: [
      // Doc: https://http.nuxtjs.org
      "@nuxt/http"
    ],

    generate: {
      routes: await getDynamicPaths({
        "/posts": "posts/*.md"
      })
    },

    /*
    ** Build configuration
    ** Doc: https://nuxtjs.org/api/configuration-build
    */
    build: {
      extend(config, ctx) {
        // add frontmatter-markdown-loader
        config.module.rules.push({
          test: /\.md$/,
          include: path.resolve(__dirname, "content"),
          loader: "frontmatter-markdown-loader",
          options: {
            mode: [Mode.VUE_COMPONENT, Mode.META]
          }
        });
      }
    }
  }
};