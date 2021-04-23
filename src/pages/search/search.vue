<template>
  <div class="search">
    <div class="search-head">
      <input type="text" placeholder="音乐/歌手" class="search-input">
    </div>
    <music-list>

    </music-list>
  </div>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
export default {
  components: {
    MusicList
  }
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  width: 100%;
  height: 100%;
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
}
</style>