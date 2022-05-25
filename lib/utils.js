const axios = require("axios")
const UserAgent = require("user-agents");
const userAgent = new UserAgent();

function getRandomUserAgent() {
  return userAgent.random().toString();
}

const config = {
  headers: {
    "user-agent": getRandomUserAgent(),
  },
};

function titlelize(name) {
  return name
    .toLowerCase()
    .normalize("NFKD") // normalize non-ASCII characters
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/&/g, "and")
    .replace(/[;, ~./]+/g, " ") // replace dots, commas or underscores with spaces
    .replace(/[^\w \-()+#@!'\u0400-\u04ff]+/g, "") // remove all non-alphanumeric chars
    .replace(/^\d{1,2}[.#\s]+(?=(?:\d+[.\s]*)?[\u0400-\u04ff])/i, "") // remove russian movie numbering
    .replace(/\s{2,}/, " ") // replace multiple spaces
    .replace(/dublado/g, "")
    .replace(/filme/g, "movie")
    .replace(/ /g, "%20")
    .trim();
}

function parseTitle(title) {
  return title
  .replace(/[(]/g, '')
  .replace(/[)]/g, '')
  .replace("HD", "")
  .replace("FHD", "")
  .trim()
}

async function getJWSource(url) {
  return new Promise(async (resolve, reject) => {
    axios
      .get(url, config)
      .then(async function (resp) {
        const playerKey = resp.data.split("?claire=")[1]
          if(playerKey) {
            const key = playerKey.split("'></iframe>")[0]
            const html = await axios.get(`https://kanra.dev/?claire=${key}`)
            const result = await parseJWSource(html.data)
            resolve(result)
          } else {
            const result = await parseJWSource(resp.data, config)
            resolve(result)
          }
      }
    )
  })
}

async function parseJWSource(data) {
  const obj = data
  .split("sources: [")[1]
  .split("]")[0]
  .replace(/default: /g, '"default": ')
  .replace(/type: /g, '"type": ')
  .replace(/label: /g, '"label": ')
  .replace(/file: /g, '"file": ')
  .trim()
  const newObj = "[" + obj + "]"
  const result = JSON.parse(newObj.replace('},]', '}]'));
  return result;
}


module.exports = { titlelize, parseTitle, getJWSource };
