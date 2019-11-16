import Type from 'union-type'

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
  ItemBased: []
})

export const Recommendations = Type({
  Users: [Array],
  Movies: [Array],
  Nothing: [],
  Default: []
})
