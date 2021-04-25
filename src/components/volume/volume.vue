<template>
  <div class="volume">
    <a-icon
      class="pointer volume-icon"
      :type="getVolumeIconType()"
      :size="30"
      @click="handleToggleVolume"
    />
    <div class="volume-progress-wrapper">
      <a-progress
        :percent="volumeProgress"
        @percentChangeEnd="handleVolumeChange"
        @percentChange="handleVolumeChange"
      />
    </div>
  </div>
</template>

<script>
import AProgress from '@/base/a-progress/a-progress'
import AIcon from '@/base/a-icon/a-icon'

export default {
  name: 'Volume',
  components: {
    AProgress,
    AIcon
  },
  props: {
    volume: {
      type: Number,
      required: true
    }
  },
  computed: {
    volumeProgress() {
      return this.volume
    },
    isMute: {
      get() {
        return this.volumeProgress === 0
      },
      set(newMute) {
        const volume = newMute ? 0 : this.lastVolume
        if (newMute) {
          this.lastVolume = this.volumeProgress
        }
        this.handleVolumeChange(volume)
      }
    }
  },
  methods: {
    getVolumeIconType() {
      return this.isMute ? 'volume-off' : 'volume'
    },
    // 是否静音
    handleToggleVolume() {
      this.isMute = !this.isMute
    },
    handleVolumeChange(percent) {
      this.$emit('volumeChange', percent)
    }
  }
}
</script>

<style lang="less" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;
  &-icon {
    margin-right: 5px;
    color: #fff;
  }
  &-progress-wrapper {
    flex: 1;
  }
}
</style>