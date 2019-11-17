'use strict'

const { desc, pLift } = require('../lib/helpers')
const db = require('../db/queries')
const findTopMatchingUsersBy = require('./similarUsers')

const toMovie = ({ title, movie_id, ws, sim }) => ({
  title,
  movie_id,
  score: ws / sim
})

const findMovies = (users, notSeenMovies) =>
  Object.values(
    notSeenMovies.reduce((table, { movie_id, ...m }) => {
      let sim = users.find(u => u.user_id === m.user_id).similarity
      const tm = table[movie_id] || { ws: 0, sim: 0 }
      // Guard against 0 or negative similarities
      return sim <= 0
        ? table
        : {
          ...table,
          [movie_id]: {
            movie_id,
            title: m.title,
            ws: tm.ws + m.rating * sim,
            sim: tm.sim + sim
          }
        }
    }, {})
  )
    .map(toMovie)
    .sort(desc('score'))

const findTopMoviesBy = (metric, id) =>
  pLift(findMovies)(findTopMatchingUsersBy(metric, id), db.getNotSeenMovies(id))

module.exports = findTopMoviesBy
