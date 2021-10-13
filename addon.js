const { addonBuilder } = require("stremio-addon-sdk");
const { getStream } = require("./lib/scraper");
const manifest = require("./lib/manifest");
const MetaDAO = require("./lib/meta-dao");

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async (args) => {
  let metaDao = new MetaDAO();
  const skip = parseInt(args.extra.skip) || 0;
  const limit = 100;
  if (args.extra.search) {
    return metaDao
      .getByName(args.extra.search, skip, limit)
      .then((metas) => {
        return { metas };
      })
      .catch((error) => {
        throw new Error(`Catalog Handler ERROR: ${error}`);
      });
  }
  if (args.extra.genre) {
    return metaDao
      .getByGenre(args.extra.genre, skip, limit)
      .then((metas) => {
        return { metas };
      })
      .catch((error) => {
        throw new Error(`Catalog Handler ERROR: ${error}`);
      });
  }
  return metaDao
    .getAll(skip, limit)
    .then((metas) => {
      return { metas };
    })
    .catch((error) => {
      throw new Error(`Catalog Handler ERROR: ${error}`);
    });
});

builder.defineStreamHandler(async ({ type, id }) => {
  const stream = await getStream(id, type);
  return Promise.resolve({ streams: stream });
});

module.exports = builder.getInterface();
