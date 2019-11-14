import isEmpty from 'crocks/predicates/isEmpty'

/** capitalize :: String -> String */
export const capitalize = s =>
  isEmpty(s) ? s : s[0].toUpperCase() + s.slice(1)

/* pLift :: (a, b .. x -> y) -> (Promise a, Promise b, .. Promise x) -> Promise y */
export const pLift = fn => (...promises) =>
  Promise.all(promises).then(args => fn(...args))
