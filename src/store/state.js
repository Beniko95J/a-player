import { playMode } from '@/config'

const state = {
  audioEle: null, // audio元素
  mode: playMode.listLoop, // 播放模式，默认列表循环
  playing: false, // 播放状态
  playlist: [], // 播放列表
  currentIndex: -1, // 当前音乐索引
}

export default state
