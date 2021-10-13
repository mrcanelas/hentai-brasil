require('dotenv').config()
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.TMDB_API)

async function getTmdb(name) {
  if (name !== null || undefined) {
    return await moviedb.searchTv({query: name, include_adult: 'true', language: 'pt-BR'})
    .then(res => {
      return res.results[0] ? res.results[0] : undefined
    })
  }
  return undefined
}

module.exports = { getTmdb };