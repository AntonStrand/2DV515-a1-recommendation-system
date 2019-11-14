import * as api from './api'
import { pLift } from './utils'

/** FormData :: { users :: [{ label::String, value::Number }], metrics :: [{ label::String, value::String }] } */

const selectOption = (label, value) => ({ label, value })

/** toFormData :: ([User], [String]) -> FormData */
const toFormData = (users, metrics) => ({
  users: users.map(u => selectOption(u.name, u.user_id)),
  metrics: metrics.map(s => selectOption(s, s))
})

/** getFormData :: () -> Promise FromData */
export const getFormData = () =>
  pLift(toFormData)(api.getUsers(), api.getMetrics())
