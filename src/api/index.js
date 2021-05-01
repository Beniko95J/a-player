import axios from '@/utils/axios'
import {localRequest} from '@/utils/axios'
import { defaultLimit } from '@/config'

// 搜索
export function search(keywords, page = 0, limit = defaultLimit) {
  return axios.get('/search', {
    params: {
      offset: page * limit,
      limit: limit,
      keywords
    }
  })
}

// 获取音乐地址
export function getMusicUrl(id) {
  return axios.get('/song/url', {
    params: {
      id
    }
  })
}

// 获取专辑信息
export function getAlbum(id) {
  return axios.get('/album', {
    params: {
      id
    }
  })
}

// 获取歌词
export function getLyric(id) {
  return axios.get('/lyric', {
    params: {
      id
    }
  })
}

// 添加收藏
export function like(song) {
  return localRequest.post('/add', song)
}

// 取消收藏
export function dislike(song) {
  return localRequest.delete(`/delete/${song.id}`)
}

// 获取收藏歌单
export function getLocalMusicList() {
  return localRequest.get('/list')
}
