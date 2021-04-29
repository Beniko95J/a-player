import * as types from './mutation-types'
import { like, dislike } from '@/api'

function findIndex(list, music) {
  return list.findIndex(item => {
    return item.id === music.id
  })
}

// 插入到播放列表
export const selectAdd = function({ commit, state }, music) {
  let list = [...state.playlist]
  // 查询当前播放列表是否有代插入的音乐，并返回其索引值
  let index = findIndex(list, music)
  if (index < 0) {
    list.unshift(music)
    commit(types.SET_PLAYLIST, list)
  }
}

// 选择播放（会插入一条到播放列表）
export const selectAddPlay = function({ commit, state }, music) {
  let list = [...state.playlist]
  // 查询当前播放列表是否有代插入的音乐，并返回其索引值
  let index = findIndex(list, music)
  // 当前播放列表有待插入的音乐时，直接改变当前播放音乐的索引值
  if (index > -1) {
    commit(types.SET_CURRENTINDEX, index)
  } else {
    list.unshift(music)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENTINDEX, 0)
  }
  commit(types.SET_PLAYING, true)
}

// 删除正在播放列表中的歌曲
export const removerPlayListItem = function(
  { commit, state },
  { list, index }
) {
  let currentIndex = state.currentIndex
  if (index < state.currentIndex || list.length === state.currentIndex) {
    currentIndex--
    commit(types.SET_CURRENTINDEX, currentIndex)
  }
  commit(types.SET_PLAYLIST, list)
  if (!list.length) {
    commit(types.SET_PLAYING, false)
  } else {
    commit(types.SET_PLAYING, true)
  }
}

// 清空播放列表
export const clearPlayList = function({ commit }) {
  commit(types.SET_PLAYING, false)
  commit(types.SET_CURRENTINDEX, -1)
  commit(types.SET_PLAYLIST, [])
}

// 添加本地收藏列表
export const selectLike = async function({ commit, state }, music) {
  let list = [...state.locallist]
  // 查询本地收藏列表是否有待插入的音乐，并返回其索引值
  let index = findIndex(list, music)
  if (index < 0) {
    list.push(music)
    commit(types.SET_LOCALLIST, list)
  }
  await like(music)
}

// 取消本地收藏列表
export const selectDislike = async function({ commit, state }, music) {
  let list = [...state.locallist]
  // 查询本地收藏列表是否有待插入的音乐，并返回其索引值
  let index = findIndex(list, music)
  if (index >= 0) {
    list.splice(index, 1)
    commit(types.SET_LOCALLIST, list)
  }
  await dislike(music)
}
