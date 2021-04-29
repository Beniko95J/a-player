<template>
  <div id="app">
    <a-header></a-header>
    <router-view class="router-view"></router-view>
    <audio ref="aPlayer"></audio>
  </div>
</template>

<script>
import AHeader from '@/components/a-header/a-header'

import { getLocalMusicList } from '@/api'

import { mapMutations } from 'vuex'

export default {
  components: {
    AHeader
  },
  methods: {
    ...mapMutations({
      setAudioele: 'SET_AUDIOELE',
      setLocalList: 'SET_LOCALLIST'
    })
  },
  created() {
    this.$nextTick(async () => {
      this.setAudioele(this.$refs.aPlayer)
      const response = await getLocalMusicList()
      this.setLocalList(response.data)
    })
  }
};
</script>

<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: @text_color;
  font-size: @font_size_medium;

  .router-view {
    width: 100%;
    height: 100%;
  }
}
</style>
