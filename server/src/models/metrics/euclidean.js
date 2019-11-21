'use strict'

/** euclidean :: [Rating] -> [Rating] -> Number */
const euclidean = as => bs => {
  let sim = 0
  let matches = 0
  as.forEach(a => {
    bs.forEach(b => {
      if (a.movie_id === b.movie_id) {
        sim += (a.rating - b.rating) ** 2
        matches++
      }
    })
  })
  // don't invert the value if there is no match
  return matches > 0 ? 1 / (1 + sim) : 0
}

module.exports = euclidean
