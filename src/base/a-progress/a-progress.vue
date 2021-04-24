<template>
  <div ref="aProgress" class="aProgress">
    <div class="aProgress-bar"></div>
    <div ref="aPercentProgress" class="aProgress-outer"></div>
    <div ref="aProgressInner" class="aProgress-inner">
      <div
        class="aProgress-dot"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AProgress',
  props: {
    // 进度值一
    percent: {
      type: [Number],
      default: 0
    },
    // 进度值二（歌曲缓冲进度用）
    percentProgress: {
      type: [Number],
      default: 0
    }
  },
}
</script>

<style lang="less">
.aProgress {
  position: relative;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  .aProgress-bar {
    height: 2px;
    width: 100%;
    background: @bar_color;
  }
  .aProgress-outer {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: rgba(255, 255, 255, 0.2);
  }
  .aProgress-inner {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: @line_color;
    .aProgress-dot {
      position: absolute;
      top: 50%;
      right: -5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: @dot_color;
      transform: translateY(-50%);
    }
  }
}
</style>