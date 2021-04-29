import * as types from './mutation-types'

const mutations = {
  // 修改audio元素
  [types.SET_AUDIOELE](state, audioEle) {
    state.audioEle = audioEle
  },
  // 修改播放模式
  [types.SET_PLAYMODE](state, mode) {
    state.mode = mode
  },
  // 修改播放状态
  [types.SET_PLAYING](state, playing) {
    state.playing = playing
  },
  // 修改播放列表
  [types.SET_PLAYLIST](state, playlist) {
    state.playlist = playlist
  },
  // 修改本地收藏列表
  [types.SET_LOCALLIST](state, locallist) {
    state.locallist = locallist
  },
  // 修改当前音乐索引
  [types.SET_CURRENTINDEX](state, currentIndex) {
    state.currentIndex = currentIndex
  }
}

export default mutations
