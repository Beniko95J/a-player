import { defaultVolume } from '@/config'

const _storage = window.localStorage
const storage = {
  get(key, data = []) {
    if (_storage) {
      return _storage.getItem(key)
        ? Array.isArray(data)
          ? JSON.parse(_storage.getItem(key))
          : _storage.getItem(key)
        : data
    }
  },
  set(key, val) {
    if (_storage) {
      _storage.setItem(key, val)
    }
  },
  clear(key) {
    if (_storage) {
      _storage.removeItem(key)
    }
  }
}

/**
 * 音量
 * @type VOLUME_KEY：key值
 */
 const VOLUME_KEY = '__aPlayer_volume__'
 // 获取音量
 export function getVolume() {
   const volume = storage.get(VOLUME_KEY, defaultVolume)
   return Number(volume)
 }
 // 修改音量
 export function setVolume(volume) {
   storage.set(VOLUME_KEY, volume)
   return volume
 }
