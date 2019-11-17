'use strict'

const { desc, pLift, propOr } = require('../lib/helpers')
const db = require('../db/queries')

/** groupRatingsAsUsers :: [Ratings] -> [User] */
const groupRatingsAsUsers = ratings =>
  Object.values(
    ratings.reduce(
      (users, r) => ({
        ...users,
        [r.user_id]: {
          name: r.name,
          user_id: r.user_id,
          ratings: propOr([])(`${r.user_id}.ratings`)(users).concat(r)
        }
      }),
      {}
    )
  )

/** toSimilarityData :: ([Rating] -> Number) -> User -> SimilarityData */
const toSimilarityData = metric => u => ({
  user_id: u.user_id,
  name: u.name,
  similarity: metric(u.ratings)
})

/** sortedMetric :: ([Rating] -> [Rating] -> Number) -> ([Rating], [Rating]) -> [SimilarityData] */
const sortedMetric = metric => (user, rest) =>
  groupRatingsAsUsers(rest)
    .map(toSimilarityData(metric(user)))
    .sort(desc('similarity'))

/** findTopMatchingUsersBy :: (([Rating] -> [Rating] -> Number), Number) -> [similarityData] */
const findTopMatchingUsersBy = (metric, id) =>
  pLift(sortedMetric(metric))(
    db.getRatedMovies(id),
    db.getWhoAlsoHaveRatedSameMovies(id)
  )

module.exports = findTopMatchingUsersBy
