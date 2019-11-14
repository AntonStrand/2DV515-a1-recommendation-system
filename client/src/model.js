import * as api from './api'

/** capitalize :: String -> String */
const capitalize = s => s[0].toUpperCase() + s.slice(1)

/* pLift :: (a, b .. x -> y) -> (Promise a, Promise b, .. Promise x) -> Promise y */
const pLift = fn => (...promises) =>
  Promise.all(promises).then(args => fn(...args))

/** FormData :: { users :: [{ label::String, value::Number }], metrics :: [{ label::String, value::String }] } */

/** toFormData :: ([User], [String]) -> FormData */
const toFormData = (users, metrics) => ({
  users: users.map(u => ({ label: u.name, value: u.user_id })),
  metrics: metrics.map(s => ({ label: capitalize(s), value: s }))
})

/** getFormData :: () -> Promise FromData */
export const getFormData = () =>
  pLift(toFormData)(api.getUsers(), api.getMetrics())
