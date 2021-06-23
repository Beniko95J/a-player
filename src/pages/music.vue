<template>
  <div class="music">
    <div class="music-content">
      <div class="music-left">
        <music-btn></music-btn>
        <keep-alive>
          <router-view name="default"></router-view>
        </keep-alive>
      </div>

      <div class="touch-div" ref="moveDom">
        <div class="div-line"></div>
        <div class="div-line"></div>
      </div>

      <div class="music-right" :style="{width: `${rightWidth}px`}">
        <lyric
          ref="lyric"
          :lyric="lyric"
          :nolyric="nolyric"
          :lyric-index="lyricIndex"
        />
      </div>
    </div>

    <div class="music-bar" :class="{ disable: !musicReady || !currentMusic.id }">
      <div class="music-bar-btns">
        <a-icon class="pointer" type="prev" :size="36" @click="prev"/>
        <div class="control-play pointer" @click="play">
          <a-icon :type="playing ? 'pause' : 'play'" :size="24" />
        </div>
        <a-icon class="pointer" type="next" :size="36" @click="next"/>
      </div>

      <div class="music-music">
        <div class="music-bar-info">
          <template v-if="currentMusic && currentMusic.id">
            {{ currentMusic.name }}
            <span>- {{ currentMusic.singer }}</span>
          </template>
          <template v-else></template>
        </div>
        <div v-if="currentMusic.id" class="music-bar-time">
          {{ currentTime | format }}/{{ currentMusic.duration % 3600 | format }}
        </div>
        <a-progress
          class="music-progress"
          :percent="percentMusic"
          :percent-progress="currentProgress"
          @percentChange="progressMusic"
          @percentChangeEnd="progressMusicEnd"
        />
      </div>

      <a-icon
        class="icon-color pointer mode"
        :type="getModeIconType()"
        :size="30"
      />
      <a-icon
        class="icon-color pointer queue-music"
        type="ic_queue_music"
        :size="30"
      />

      <!-- 音量控制 -->
      <div class="music-bar-volume">
        <volume :volume="volume" @volumeChange="volumeChange" />
      </div>
    </div>

    <div class="bg" :style="{backgroundImage: picUrl}"></div>
    <div class="mask"></div>
  </div>
</template>

<script>
import Lyric from '@/components/lyric/lyric'
import MusicBtn from '@/components/music-btn/music-btn'
import AIcon from '@/base/a-icon/a-icon'
import AProgress from '@/base/a-progress/a-progress'
import Volume from '@/components/volume/volume'

import aPlayerMusic from './aPlayer'
import { format, silencePromise, parseLyric } from '@/utils/util'
import { playMode } from '@/config'
import { getVolume, setVolume } from '@/utils/storage'
import { getLyric } from '@/api'

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Lyric,
    MusicBtn,
    AIcon,
    AProgress,
    Volume
  },
  data() {
    const volume = getVolume()
    return {
      wallpaper: require('../assets/wallpaper/wp.jpg'),
      clientStartX: 0,
      rightWidth: 310,
      musicReady: false, // 是否可以使用播放器
      currentTime: 0, // 当前播放时间
      currentProgress: 0, // 当前缓冲进度
      volume, // 音量大小
      isMute: false, // 是否静音
      lyric: [], // 歌词
      nolyric: false, // 是否有歌词
      lyricIndex: 0, // 当前播放歌词下标
    }
  },
  computed: {
    picUrl() {
      return this.currentMusic.id && this.currentMusic.albumImg
      ? `url(${this.currentMusic.albumImg}?param=300y300)`
      : `url(${this.wallpaper})`
    },
    percentMusic() {
      const duration = this.currentMusic.duration
      return this.currentTime && duration ? this.currentTime / duration : 0
    },
    ...mapGetters([
      'audioEle',
      'mode',
      'playing',
      'playlist',
      'currentIndex',
      'currentMusic',
    ])
  },
  watch: {
    currentMusic(newMusic, oldMusic) {
      if (!newMusic.id) {
        this.lyric = []
        return
      }
      if (newMusic.id === oldMusic.id) {
        return
      }
      this.audioEle.src = newMusic.url
      // 重置相关参数
      this.lyricIndex = this.currentTime = this.currentProgress = 0
      silencePromise(this.audioEle.play())
      this.$nextTick(() => {
        this._getLyric(newMusic.id)
      })
    },
    playing(newPlaying) {
      console.log("'playing' changed")
      const audio = this.audioEle
      this.$nextTick(() => {
        newPlaying ? silencePromise(audio.play()) : audio.pause()
        this.musicReady = true
      })
    },
    currentTime(newTime) {
      if (this.nolyric) {
        return
      }
      let lyricIndex = 0
      for (let i = 0; i < this.lyric.length; i++) {
        if (newTime > this.lyric[i].time) {
          lyricIndex = i
        }
      }
      this.lyricIndex = lyricIndex
    },
  },
  methods: {
    moveHandle(nowClientX) {
      let computedX = this.clientStartX - nowClientX;
      let rightBoxWidth = this.rightWidth;
      let changeWidth = rightBoxWidth + computedX;

      if (changeWidth < 200) {
        changeWidth = 200;
      }

      if (changeWidth > 900) {
        changeWidth = 900;
      }

      this.rightWidth = changeWidth;

      this.clientStartX = nowClientX;
    },
    getModeIconType() {
      return {
        [playMode.listLoop]: 'loop',
        [playMode.order]: 'sequence',
        [playMode.random]: 'random',
        [playMode.loop]: 'loop-one'
      }[this.mode]
    },
    // 上一曲
    prev() {
      if (!this.musicReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing && this.musicReady) {
          this.setPlaying(true)
        }
        this.musicReady = false
      }
    },
    // 播放暂停
    play() {
      if (!this.musicReady) {
        return
      }
      this.setPlaying(!this.playing)
    },
    // 下一曲
    // 当 flag 为 true 时，表示上一曲播放失败
    next(flag = false) {
      if (!this.musicReady) {
        return
      }
      const {
        playlist: { length }
      } = this
      if (
        (length - 1 === this.currentIndex && this.mode === playMode.order) ||
        (length === 1 && flag)
      ) {
        this.setCurrentIndex(-1)
        this.setPlaying(false)
        return
      }
      if (length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === length) {
          index = 0
        }
        if (!this.playing && this.musicReady) {
          this.setPlaying(true)
        }
        this.setCurrentIndex(index)
        this.musicReady = false
      }
    },
    // 循环
    loop() {
      this.audioEle.currentTime = 0
      silencePromise(this.audioEle.play())
      this.setPlaying(true)
      if (this.lyric.length > 0) {
        this.lyricIndex = 0
      }
    },
    // 修改音乐显示时长
    progressMusic(percent) {
      this.currentTime = this.currentMusic.duration * percent
    },
    // 修改音乐进度
    progressMusicEnd(percent) {
      this.audioEle.currentTime = this.currentMusic.duration * percent
    },
    // 修改音量大小
    volumeChange(percent) {
      percent === 0 ? (this.isMute = true) : (this.isMute = false)
      this.volume = percent
      this.audioEle.volume = percent
      setVolume(percent)
    },
    // 获取歌词
    _getLyric(id) {
      getLyric(id).then(res => {
        if (res.data.lrc === undefined) {
          this.nolyric = true
        } else {
          this.nolyric = false
          this.lyric = parseLyric(res.data.lrc.lyric)
        }
        silencePromise(this.audioEle.play())
      })
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENTINDEX',
    }),
  },
  mounted() {
    this.$nextTick(() => {
      aPlayerMusic.initAudio(this)
      this.volumeChange(this.volume)
    })

    let moveDom = this.$refs.moveDom;

    moveDom.onmousedown = e => {
      this.clientStartX = e.clientX;
      e.preventDefault();

      document.onmousemove = e => {
        this.moveHandle(e.clientX);
      };

      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
    };
  },
  filters: {
    format
  }
}
</script>

<style lang="less">
.music {
  padding: 75px 25px 25px 25px;
  width: 100%;
  max-width: 1750px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  .music-content {
    display: flex;
    width: 100%;
    height: calc(~'100% - 80px');
    .music-left {
      flex: 1;
      height: 100%;
      overflow: hidden;
      margin-right: 10px;
      // border: 1px solid red;
    }
    .touch-div {
      display: flex;
      width: 20px;
      justify-content: center;
      align-items: center;
      cursor: col-resize;
      .div-line {
        margin: 0 auto;
        width: 2px;
        background: #bbb;;
        height: 90%;
      }
    }
    .music-right {
      position: relative;
      margin-left: 10px;
      box-sizing: border-box;
      // border: 1px solid red;
    }
  }

  /*底部aPlayer-bar*/
  .music-bar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding-bottom: 15px;
    color: #fff;
    &.disable {
      pointer-events: none;
      opacity: 0.6;
    }
    .icon-color {
      color: #fff;
    }
    .music-bar-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 180px;
      .control-play {
        .flex-center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
        .icon-bofang101 {
          transform: translateX(2px);
        }
      }
    }

    .flex-center;
    .btn-prev {
      width: 19px;
      min-width: 19px;
      height: 20px;
      background-position: 0 -30px;
    }
    .btn-play {
      width: 21px;
      min-width: 21px;
      height: 29px;
      margin: 0 50px;
      background-position: 0 0;
      &.btn-play-pause {
        background-position: -30px 0;
      }
    }
    .btn-next {
      width: 19px;
      min-width: 19px;
      height: 20px;
      background-position: 0 -52px;
    }
    .music-music {
      position: relative;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      padding-left: 40px;
      font-size: @font_size_small;
      color: @text_color_active;
      .music-bar-info {
        height: 15px;
        padding-right: 80px;
        line-height: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .music-bar-time {
        position: absolute;
        top: 0;
        right: 5px;
      }
      .music-progress {
        margin-top: 3px;
      }
    }
    .mode,
    .comment,
    .queue-music,
    .music-bar-volume {
      margin-left: 20px;
    }

    // 音量控制
    .volume-wrapper {
      margin-left: 20px;
      width: 150px;
    }
  }

  .mask,
  .bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .mask {
    z-index: -1;
    background-color: @mask_color;
  }

  .bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(5px);
    opacity: 0.7;
    transition: 1s;
  }
}
</style>