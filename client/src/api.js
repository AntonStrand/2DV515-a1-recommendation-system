import { encaseP } from 'fluture/index'
import axios from 'axios'
import { API_BASE_URL } from './config'

const fGet = encaseP(axios.get)

/** get :: String -> Future a */
const get = path => fGet(`${API_BASE_URL}${path}`).map(result => result.data)

/** getUsers :: Future [User] */
export const getUsers = get('/users')

/** getMetrics :: Future [Metric] */
export const getMetrics = get('/metrics')
