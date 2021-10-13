const axios = require('axios')

async function imdb2tmdb(imdb) {
    return axios.get(`https://94c8cb9f702d-tmdb-addon.baby-beamup.club/meta/series/${imdb}.json`)
    .then(results => results.data.meta.id)
}

module.exports = { imdb2tmdb }