<template>
  <div class="playList">
    <music-list
      :list="playlist"
      :list-type="1"
      @select="selectItem"
      @del="deleteItem"
    >
      <div slot="listBtn" class="list-btn">
        <span>清空列表</span>
      </div>
    </music-list>
  </div>
</template>

<script>
import MusicList from '@/components/music-list/music-list';

import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'PlayList',
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['playing', 'playlist', 'currentMusic'])
  },
  methods: {
    // 播放暂停事件
    selectItem(item, index) {
      if (item.id !== this.currentMusic.id) {
        this.setCurrentIndex(index)
        this.setPlaying(true)
      }
    },
    deleteItem(index) {
      let list = [...this.playlist];
      list.splice(index, 1);
      this.removerPlayListItem({ list, index });
      console.log('删除成功');
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENTINDEX'
    }),
    ...mapActions(['removerPlayListItem', 'clearPlayList'])
  }
}
</script>

<style lang="less">
.playList {
  position: relative;
  width: 100%;
  height: 100%;
  .musicList {
    width: 100%;
    height: 100%;
    .list-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      span {
        padding: 5px 20px;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: @text_color_active;
        }
      }
    }
  }
}
</style>