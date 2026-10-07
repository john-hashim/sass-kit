import axios from 'axios'

// Testing only: disable before production to remove the simulated server delay.
const ENABLE_API_DELAY = true
const API_DELAY_MS = 2000

const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  async response => {
    if (ENABLE_API_DELAY) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY_MS))
    }
    return response
  },
  async error => {
    if (ENABLE_API_DELAY) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY_MS))
    }
    return Promise.reject(error)
  }
)

export default apiClient
