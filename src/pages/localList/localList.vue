<template>
  <div class="localList">
    <a-loading v-model="aLoadShow"></a-loading>
    <music-list
      :list="locallist"
      @select="selectItem"
      @add="addItem"
    />
  </div>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import ALoading from '@/base/a-loading/a-loading'

import { getLocalMusicList } from '@/api'

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      aLoadShow: true
    }
  },
  components: {
    MusicList,
    ALoading
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
    this.aLoadShow = false
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
