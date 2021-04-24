function filterSinger(singers) {
  let arr = []
  singers.forEach(item => {
    arr.push(item.name)
  })
  return arr.join('/')
}

export class Song {
  constructor({ id, name, singer, album, imageId, duration, url }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.imageId = imageId
    this.duration = duration
    this.url = url
  }
}

export function createPlayList(music) {
  return new Song({
    id: music.id,
    name: music.name,
    singer: music.artists.length > 0 && filterSinger(music.artists),
    album: music.album.name,
    imageId: music.album.picId || null,
    duration: music.duration / 1000,
    url: `https://autumnfish.cn/song/url?id=${music.id}`
  })
}

// 歌曲数据格式化
const formatSongs = function formatPlayList(list) {
  let Songs = []
  list.forEach(item => {
    const musicData = item
    if (musicData.id) {
      Songs.push(createPlayList(musicData))
    }
  })
  return Songs
}

export default formatSongs
