import Type from 'union-type'
import { T } from 'ramda'

export const SelectOption = Type({ of: { label: String, value: T } })

/** ArrayOfSelectOption :: [a] -> Boolean */
const ArrayOfSelectOption = xs =>
  Array.isArray(xs) && xs.every(x => x.label != null && x.value != null)

export const FormData = Type({
  of: {
    users: ArrayOfSelectOption,
    metrics: ArrayOfSelectOption
  }
})

export const Limit = Type({
  Valid: [Number],
  Invalid: [],
  Nothing: []
})

const isValidLimit = Limit.case({ Invalid: () => false, _: () => true })

export const RecommendationQuery = Type({
  of: {
    userId: Number,
    metric: String,
    limit: isValidLimit
  }
})

export const RecommendationType = Type({
  TopUsers: [RecommendationQuery],
  TopMovies: [RecommendationQuery],
  ItemBased: [Number]
})

export const Recommendations = Type({
  Users: [Array],
  Movies: [Array],
  Nothing: [],
  Default: []
})
