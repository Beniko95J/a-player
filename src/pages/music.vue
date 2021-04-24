<template>
  <div class="music">
    <div class="music-content">
      <div class="music-left">
        <music-btn></music-btn>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>

      <div class="touch-div" ref="moveDom">
        <div class="div-line"></div>
        <div class="div-line"></div>
      </div>

      <div class="music-right" :style="{width: `${rightWidth}px`}">
        <lyric></lyric>
      </div>
    </div>

    <div class="music-bar">
      <div class="music-bar-btns">
        <a-icon
          class="pointer"
          type="prev"
          :size="36"
        />
        <div
          class="control-play pointer"
        >
          <a-icon :type="playing ? 'pause' : 'play'" :size="24" />
        </div>
        <a-icon
          class="pointer"
          type="next"
          :size="36"
        />
      </div>

      <div class="music-music">
        <a-progress
          class="music-progress"
        />
      </div>

      <a-icon
        class="icon-color pointer mode"
        :type="getModeIconType()"
        :size="30"
      />
    </div>

    <div class="bg" :style="{backgroundImage:`url(${wallpaper})`}"></div>
    <div class="mask"></div>
  </div>
</template>

<script>
import Lyric from '@/components/lyric/lyric'
import MusicBtn from '@/components/music-btn/music-btn'
import AIcon from '@/base/a-icon/a-icon'
import AProgress from '@/base/a-progress/a-progress'

import aPlayerMusic from './aPlayer'
import { silencePromise } from '@/utils/util'
import { playMode } from '@/config'

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Lyric,
    MusicBtn,
    AIcon,
    AProgress
  },
  data() {
    return {
      wallpaper: require('../assets/wallpaper/wp.jpg'),
      clientStartX: 0,
      rightWidth: 310
    }
  },
  computed: {
    ...mapGetters([
      'audioEle',
      'mode',
      'playing',
      'currentMusic',
    ])
  },
  watch: {
    currentMusic(newMusic, oldMusic) {
      console.log('Current music changed.')
      if (newMusic.id === oldMusic.id) {
        return
      }
      this.audioEle.src = newMusic.url;
      silencePromise(this.audioEle.play())
    },
    playing(newPlaying) {
      console.log('Play state changed.')
      const audio = this.audioEle
      this.$nextTick(() => {
        newPlaying ? silencePromise(audio.play()) : audio.pause()
      })
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
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
    }),
  },
  mounted() {
    this.$nextTick(() => {
      aPlayerMusic.initAudio(this)
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

  /*底部mmPlayer-bar*/
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
    }
    .mode,
    .comment,
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
  }
}
</style>