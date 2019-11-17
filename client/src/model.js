import * as api from './api'
import liftA2 from 'crocks/helpers/liftA2'
import compose from 'crocks/helpers/compose'
import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import isEmpty from 'crocks/predicates/isEmpty'

import {
  RecommendationType,
  Limit,
  Recommendations,
  SelectOption,
  FormData
} from './types'

/** toFormData :: [User] -> [String] -> FormData */
const toFormData = users => metrics =>
  FormData.of(
    users.map(u => SelectOption.of(u.name, u.user_id)),
    metrics.map(s => SelectOption.of(s, s))
  )

/** getFormData :: Future FromData */
export const getFormData = liftA2(toFormData, api.getUsers, api.getMetrics)

/** getLimitQuery :: Limit -> String */
const getLimitQuery = Limit.case({ Valid: v => `&limit=${v}`, _: () => '' })

/** requestRecommendations :: String -> Object -> Future [Object] */
const requestRecommendations = route => q =>
  api.get(`${route}/${q.userId}?metric=${q.metric}${getLimitQuery(q.limit)}`)

/** setRecommendationType :: Recommendations -> [a] -> Recommendations */
const setRecommendationType = ifElse(isEmpty, () => Recommendations.Nothing)

/** getRecommendations :: RecommendationType -> Future Recommendation */
export const getRecommendations = RecommendationType.case({
  TopUsers: compose(
    map(setRecommendationType(Recommendations.Users)),
    requestRecommendations('/users')
  ),
  TopMovies: compose(
    map(setRecommendationType(Recommendations.Movies)),
    requestRecommendations('/movies')
  ),
  ItemBased: _ => console.log('ItemBased')
})
