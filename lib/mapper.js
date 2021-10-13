const axios = require("axios");
const { PORT } = require("./connect");
const MetaDAO = require("./meta-dao");
const { getTmdb } = require("./tmdb");
const baseUrl = "https://hentaiyabu.com/api/show.php";

async function getMapping() {
  let metaDao = new MetaDAO();
  axios.get(baseUrl).then((res) => {
    res.data.map(async (el) => {
      const tmdbId = await getTmdb(el.title);
      if (tmdbId) {
        const genres = el.genre
          .replace(".", "")
          .split(",")
          .map((genre) => genre.trim());
        const meta = {
          id: `tmdb:${tmdbId.id}`,
          slug: el.slug,
          name: el.title,
          type: "series",
          poster: `https://image.tmdb.org/t/p/w500${tmdbId.poster_path}`,
          posterShape: "poster",
          genres,
          imdbRating: tmdbId.vote_average,
          description: tmdbId.overview,
          year: tmdbId.first_air_date
            ? tmdbId.first_air_date.split("-")[0]
            : null,
        };
        metaDao.upsert(meta)
      }
    });
  });
}

getMapping();
