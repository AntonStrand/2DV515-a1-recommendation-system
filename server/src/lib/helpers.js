/** groupBy :: String -> [Object] -> [[ Object ]] */
const groupBy = key => xs =>
  Object.values(
    xs.reduce(
      (group, x) => ({
        ...group,
        [x[key]]: group[x[key]] ? [...group[x[key]], x] : [x]
      }),
      {}
    )
  )

/** isEmpty :: [a] -> Boolean */
const isEmpty = xs => xs == null || (xs != null && xs.length === 0)

/* pLift :: (a, b .. x -> y) -> (Promise a, Promise b, .. Promise x) -> Promise y */
const pLift = fn => (...promises) =>
  Promise.all(promises).then(args => fn(...args))

module.exports = {
  groupBy,
  isEmpty,
  pLift
}
