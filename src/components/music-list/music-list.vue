<template>
  <div class="musicList">
    <template>
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span class="list-time">时长</span>
        <span class="list-album">专辑</span>
      </div>
      <div class="list-content">
        
      </div>
    </template>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;

  .list-name {
    padding-left: 40px;
  }
}

.list-content {
  width: 100%;
  height: calc(~'100% - 60px');
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.list-item {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 50px;
  overflow: hidden;
  
  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;
  }
  
  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
  }

  .list-time {
    display: block;
    width: 60px;
    position: relative;
  }
}
</style>