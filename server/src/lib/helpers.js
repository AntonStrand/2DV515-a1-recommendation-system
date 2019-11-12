'use strict'

/** desc :: String -> Number */
const desc = key => (a, b) => b[key] - a[key]

/* pLift :: (a, b .. x -> y) -> (Promise a, Promise b, .. Promise x) -> Promise y */
const pLift = fn => (...promises) =>
  Promise.all(promises).then(args => fn(...args))

/** propOr :: a -> String -> Object -> a */
const propOr = def => path => o =>
  path.split('.').reduce((value, k) => (value[k] ? value[k] : def), o)

module.exports = {
  desc,
  pLift,
  propOr
}
