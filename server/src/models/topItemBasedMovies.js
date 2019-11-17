'use strict'

const { desc, pLift } = require('../lib/helpers')
const db = require('../db/queries')

const toMovie = ({ title, movie_id, ws, sim }) => ({
  title,
  movie_id,
  score: ws / sim
})

const findMovies = (ratings, notSeenMovies) =>
  Object.values(
    notSeenMovies.reduce((table, { movie_id, ...m }) => {
      let rating = ratings.find(r => r.movie_id === m.similar_to).rating
      const tm = table[movie_id] || { ws: 0, sim: 0 }

      // Guard against 0 or negative similarities
      return m.similarity <= 0
        ? table
        : {
          ...table,
          [movie_id]: {
            movie_id,
            title: m.title,
            ws: tm.ws + m.similarity * rating,
            sim: tm.sim + m.similarity
          }
        }
    }, {})
  )
    .map(toMovie)
    .sort(desc('score'))

const findTopMoviesFor = id =>
  pLift(findMovies)(db.getRatedMovies(id), db.getSimilarMovies(id))

module.exports = findTopMoviesFor
