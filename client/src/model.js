import * as api from './api'
import liftA2 from 'crocks/helpers/liftA2'
import { RecommendationType, Limit } from './types'

/** FormData :: { users :: [{ label::String, value::Number }], metrics :: [{ label::String, value::String }] } */

/** selectOption :: (String, a) -> ({ label :: String, value :: a }) */
const selectOption = (label, value) => ({ label, value })

/** toFormData :: [User] -> [String] -> FormData */
const toFormData = users => metrics => ({
  users: users.map(u => selectOption(u.name, u.user_id)),
  metrics: metrics.map(s => selectOption(s, s))
})

/** getFormData :: Future FromData */
export const getFormData = liftA2(toFormData, api.getUsers, api.getMetrics)

const getLimitQuery = Limit.case({
  Valid: v => `&limit=${v}`,
  _: () => ''
})

const requestRecommendations = route => q =>
  api.get(`${route}/${q.userId}?metric=${q.metric}${getLimitQuery(q.limit)}`)

export const getRecommendations = RecommendationType.case({
  TopUsers: requestRecommendations('/users'),
  TopMovies: requestRecommendations('/movies'),
  ItemBased: _ => console.log('ItemBased')
})
