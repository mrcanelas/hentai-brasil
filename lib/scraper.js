const axios = require("axios");
const jsdom = require("jsdom");
const { imdb2tmdb } = require("./imdb2tmdb");
const { JSDOM } = jsdom;
const MetaDAO = require("./meta-dao");
const { getJWSource, parseTitle } = require("./utils");
const hentaiEndPoint = "https://hentaiyabu.com/";

const PROVIDER = "Hentai Brasil";

async function getStream(id, type) {
  let metaDao = new MetaDAO();
  const tmdbId = id.includes('tt') ? await imdb2tmdb(id.split(':')[0]) : `tmdb:${id.split(":")[1]}`;
  const episode = id.includes('tt') ? id.split(":")[2] : id.split(":")[3];
  return new Promise(async (resolve) => {
    metaDao.getById(tmdbId).then(async (results) => {
      if (results !== undefined) {
        const epList = [];
        const page = Math.ceil(episode / 30);
        axios
          .get(hentaiEndPoint + `hentai/${results.slug}/page/${page}/`)
          .then(async (res) => {
            const dom = new JSDOM(res.data);
            const items = dom.window.document.querySelectorAll("div.anime-episode");
            items.forEach((item, index) => {
              const name = item.querySelector("h3").textContent;
              const ep = (page - 1) * 30 + (index + 1);
              const url = item.querySelector("a").href;
              epList.push({ name, ep, url });
            });
            const index = epList.find((val) => val.ep == episode);
            if (index !== undefined) {
              const episodes = await getJWSource(index.url);
              const metas = episodes.map((el) => {
                if (results.slug.includes("dublado")) {
                  return {
                    name: `Hentai Brasil\n${el.label}`,
                    title: `${parseTitle(
                      index.name
                    )}\n🔈 Dublado ⚙️ ${PROVIDER}`,
                    type: `series`,
                    url: el.file,
                    behaviorHints: {
                      bingeGroup: `HentaiBrasil-${results.slug}|${el.label}`,
                    },
                  };
                } else {
                  return {
                    name: `Hentai Brasil\n${el.label}`,
                    title: `${parseTitle(
                      index.name
                    )}\n🔈 Legendado ⚙️ ${PROVIDER}`,
                    type: `series`,
                    url: el.file,
                    behaviorHints: {
                      bingeGroup: `HentaiBrasil-${results.slug}|${el.label}`,
                    },
                  };
                }
              });
              resolve(metas);
            } else {
              resolve([]);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = { getStream };
