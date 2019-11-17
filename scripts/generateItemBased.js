'use strict'

const sql = require('mysql2')

const [user, password, database] = process.argv.slice(2)

/** *** SQL *** **/
/** mysql :: Promise Connection */
const mysql = sql
  .createConnection({
    host: 'localhost',
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 200,
    dateStrings: true
  })
  .promise()

const saveMovieRating = m =>
  mysql.execute(
    `INSERT IGNORE INTO item_based (movie_id, similar_to, similarity) VALUES (?, ?, ?)`,
    [m.movie_id, m.similar_to, m.similarity]
  )

const numOfItemBasedRatings = () =>
  mysql
    .execute(`select COUNT(*) as count from item_based;`)
    .then(([result]) => result[0])

const getAllMovieRatings = () =>
  mysql.execute(`SELECT * FROM ratings;`).then(([result]) => result)

/** *** HELPERS *** **/

/** propOr :: a -> String -> Object -> a */
const propOr = (def, o, path) =>
  path.split('.').reduce((value, k) => (value[k] ? value[k] : def), o)

/** groupRatingsAsMovie :: [Ratings] -> [Movie] */
const groupRatingsAsMovies = ratings =>
  Object.values(
    ratings.reduce(
      (movies, r) => ({
        ...movies,
        [r.movie_id]: {
          movie_id: r.movie_id,
          ratings: propOr([], movies, `${r.movie_id}.ratings`).concat(r)
        }
      }),
      {}
    )
  )

/** *** LOGIC *** **/

/** euclidean :: [Rating] -> [Rating] -> Number */
const euclidean = (as, bs) => {
  let sim = 0

  as.forEach(a => {
    bs.forEach(b => {
      if (a.user_id === b.user_id) {
        sim += (a.rating - b.rating) ** 2
      }
    })
  })
  // don't invert the value if there is no match
  return sim > 0 ? 1 / (1 + sim) : 0
}

/** *** MAIN *** **/

getAllMovieRatings()
  .then(groupRatingsAsMovies)
  .then(movies =>
    movies.flatMap(movie =>
      movies
        .map(m => ({
          movie_id: m.movie_id,
          similar_to: movie.movie_id,
          similarity: euclidean(movie.ratings, m.ratings)
        }))
        .filter(m => m.movie_id !== m.similar_to)
        .map(saveMovieRating)
    )
  )
  .then(numOfItemBasedRatings)
  .then(({ count }) =>
    console.log(count, 'item-based recommendations was added.')
  )
  .then(() => process.exit(0))
