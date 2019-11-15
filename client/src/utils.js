import isEmpty from 'crocks/predicates/isEmpty'

/** capitalize :: String -> String */
export const capitalize = s =>
  isEmpty(s) ? s : s[0].toUpperCase() + s.slice(1)
