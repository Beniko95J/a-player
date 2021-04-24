import axios from 'axios'

const request = axios.create({
  baseURL: 'https://autumnfish.cn'
})

export default request
