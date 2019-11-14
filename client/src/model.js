import * as api from './api'

/** getFormData :: () -> Promise { users :: [String], metrics :: [String] } */
export const getFormData = () =>
  Promise.all([api.getUsers(), api.getMetrics()])
    .then(results => results.map(x => x.data))
    .then(([users, metrics]) => ({
      users: users.map(u => `${u.user_id}: ${u.name}`),
      metrics: metrics.map(s => s[0].toUpperCase() + s.slice(1))
    }))
