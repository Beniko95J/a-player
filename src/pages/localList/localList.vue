<template>
  <div class="localList">
    <music-list
      :list="locallist"
      @select="selectItem"
      @add="addItem"
    />
  </div>
</template>

<script>
import MusicList from '@/components/music-list/music-list'

import { getLocalMusicList } from '@/api'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['locallist'])
  },
  methods: {
    selectItem(music) {
      this.selectAddPlay(music)
    },
    addItem(music) {
      this.selectAdd(music)
    },
    ...mapActions(['selectAddPlay', 'selectAdd'])
  },
  async created() {
    const result = await getLocalMusicList()
    this.list = result.data
  },
  async activated() {
    const result = await getLocalMusicList()
    this.list = result.data
  }
}
</script>

<style lang="less" scoped>
.localList {
  position: relative;
  width: 100%;
  height: calc(~'100% - 60px');
  .musicList {
    width: 100%;
    height: 100%;
  }
}
</style>
