<template>
  <div class="music">
    <div class="music-content">
      <div class="music-left">
        <music-btn></music-btn>
        <router-view></router-view>
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
      这里是播放器
    </div>

    <div class="bg" :style="{backgroundImage:`url(${wallpaper})`}"></div>
    <div class="mask"></div>
  </div>
</template>

<script>
import Lyric from '@/components/lyric/lyric'
import MusicBtn from '@/components/music-btn/music-btn'
export default {
  components: {
    Lyric,
    MusicBtn
  },
  data() {
    return {
      wallpaper: require('../assets/wallpaper/wp.jpg'),
      clientStartX: 0,
      rightWidth: 310
    }
  },
  mounted() {
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
  methods: {
    moveHandle(nowClientX) {
      console.log('事件');
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
    }
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
      // width: 310px;
      margin-left: 10px;
      box-sizing: border-box;
      // border: 1px solid red;
    }
  }

  .music-bar {
    width: 100%;
    height: 80px;
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