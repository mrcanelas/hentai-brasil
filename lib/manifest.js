const genres = require("./genres")



module.exports = {
    id: "hentai-brasil-addon",
	name: "Hentai Brasil",
	description: "NESCECITA DO THE MOIVE DATABASE ADDON PARA FUNCIONAR.",
	logo: "https://i.ibb.co/G9rDNZS/image.jpg",
	version: "0.0.1",
	catalogs: [
		{
		  type: "series",
		  id: "series.top",
		  extraSupported: ["search", "genre", "skip"],
		  genres: genres.sort(),
		},
	],
	resources: [
		"catalog",
		"stream"
	],
	types: [
		"series"
	],
	extra: [
        {
          name: "search",
          isRequired: false,
        },
        {
          name: "skip",
          isRequired: false,
        },
	],
	behaviorHints: {
		adult: true
	  }
}