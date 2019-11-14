import axios from 'axios'
import { API_BASE_URL } from './config'

/** get :: String -> Promise a */
const get = path =>
  axios.get(`${API_BASE_URL}${path}`).then(result => result.data)

/** getUsers :: () -> Promise [User] */
export const getUsers = () => get('/users')

/** getMetrics :: () -> Promise [Metric] */
export const getMetrics = () => get('/metrics')
