import axios from 'axios'

const Util = {
  // host: 'http://' + window.location.host
  host: 'http://localhost:8200'
}

const request = axios.create({
  baseURL: Util.host,
  timeout: 10000,
  validateStatus: function (status) {
    return status < 600; // Reject only if the status code is greater than or equal to 500
  }
})

request.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default request