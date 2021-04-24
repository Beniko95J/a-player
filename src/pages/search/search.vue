<template>
  <div class="search">
    <div class="search-head">
      <input v-model.trim="searchValue" type="text" placeholder="音乐/歌手" class="search-input" @keyup.enter="onEnter">
    </div>
    <music-list
      ref="musicList"
      :list="list"
      @select="selectItem"
    />
  </div>
</template>

<script>
import MusicList from '@/components/music-list/music-list'

import {search} from '@/api'
import formatSongs from '@/utils/song'

import { mapActions } from 'vuex'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      searchValue: '',
      list: []
    }
  },
  methods: {
    onEnter() {
      if (this.searchValue.replace(/(^\s+)|(\s+$)/g, '') === '') {
        console.log('搜索内容不能为空！');
        return;
      }
      search(this.searchValue).then(res => {
        this.list = formatSongs(res.data.result.songs);
      })
    },
    selectItem(music) {
      this.selectAddPlay(music)
    },
    ...mapActions(['selectAddPlay'])
  }
};
</script>

<style lang="less" scoped>
.search {
  position: relative;
  width: 100%;
  height: calc(~'100% - 60px');
  .search-head {
    display: flex;
    height: 40px;
    padding: 10px 15px;
    overflow: hidden;
    background: @search_bg_coloe;
  }

  .search-input {
    flex: 1;
    height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid @btn_color;
    outline: 0;
    background: transparent;
    color: @text_color_active;
    font-size: @font_size_medium;
    box-shadow: 0 0 1px 0 #fff inset;
    &::placeholder {
      color: @text_color;
    }
  }
  .musicList {
    width: 100%;
    height: calc(~'100% - 60px');
  }
}
</style>