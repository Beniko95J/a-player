import axios from 'axios'

const request = axios.create({
  baseURL: 'https://autumnfish.cn'
})

export const localRequest = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export default request
