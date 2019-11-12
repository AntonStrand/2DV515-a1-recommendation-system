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

/** toSimularityData :: ([Rating] -> Number) -> User -> SimularityData */
const toSimularityData = metric => u => ({
  user_id: u.user_id,
  name: u.name,
  simularity: metric(u.ratings)
})

/** sortedMetric :: ([Rating] -> [Rating] -> Number) -> ([Rating], [Rating]) -> [SimularityData] */
const sortedMetric = metric => (user, rest) =>
  groupRatingsAsUsers(rest)
    .map(toSimularityData(metric(user)))
    .sort(desc('simularity'))

/** findTopMatchingUsersBy :: (([Rating] -> [Rating] -> Number), Number) -> [SimularityData] */
const findTopMatchingUsersBy = (metric, id) =>
  pLift(sortedMetric(metric))(
    db.getRatedMovies(id),
    db.getWhoAlsoHaveRatedSameMovies(id)
  )

module.exports = findTopMatchingUsersBy
