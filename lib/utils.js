const axios = require("axios")

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
  const html = await axios.get(url);
  const obj = html.data
    .split("sources: [\n")[1]
    .split(",]")[0]
    .replace(/default: /g, '"default": ')
    .replace(/type: /g, '"type": ')
    .replace(/label: /g, '"label": ')
    .replace(/file: /g, '"file": ');
  const result = JSON.parse("[" + obj + "]");
  return result;
}


module.exports = { titlelize, parseTitle, getJWSource };
