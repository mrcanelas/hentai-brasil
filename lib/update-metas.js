const MetaDAO = require("./meta-dao");
const { getMeta } = require("./tmdb");
const { connect } = require("./connect");

function updateMeta() {
  connect()
    .then((uri) => {
      console.log(`MONGO URI: ${uri}`);
    })
    .catch(console.error);
  let metaDao = new MetaDAO();
  metaDao
    .getAll(0, 9999)
    .then((metas) => {
      metas.map(async (meta) => {
        const newMeta = await getMeta(meta.id.split(":")[1]);
        const mergeMeta = {
            id: meta.id,
            slug: meta.slug,
            name: meta.name,
            type: "series",
            poster: `https://image.tmdb.org/t/p/w500${newMeta.poster_path}`,
            posterShape: "poster",
            genres: meta.genres,
            imdbRating: newMeta.vote_average,
            description: newMeta.overview,
            year: newMeta.first_air_date
              ? newMeta.first_air_date.split("-")[0]
              : null,
          };
          metaDao.upsert(mergeMeta)
      });
    })
    .catch((error) => {
      throw new Error(`Catalog Handler ERROR: ${error}`);
    });
}

updateMeta();
