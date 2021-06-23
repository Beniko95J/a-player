<template>
  <div class="musicList">
    <template>
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span v-if="listType === 1" class="list-time">时长</span>
        <span v-else class="list-album">专辑</span>
      </div>
      <div ref="listContent" class="list-content" @scroll="listScroll($event)">
        <div 
          v-for="(item, index) in list"
          :key="item.id"
          class="list-item"
          :class="{'on':playing&&currentMusic.id===item.id}"
        >
          <span class="list-num" v-text="index+1"></span>
          <div class="list-name">
            <span>{{ item.name }}</span>
            <div class="list-menu">
              <a-icon
                class="hover"
                :type="getPlayIconType(item)"
                :size="40"
                @click.stop="selectItem(item,index)"
              />
              <a-icon
                v-if="!isLike(item)"
                class="hover"
                type="ic_favorite_border"
                :size="40"
                @click.stop="likeItem(item)"
              />
              <a-icon
                v-if="isLike(item)"
                class="hover"
                type="ic_favorite"
                :size="40"
                @click.stop="dislikeItem(item)"
              />
              <a-icon
                v-if="listType !== 1"
                class="hover"
                type="ic_playlist_add"
                :size="40"
                @click.stop="addItem(item,index)"
              />
            </div>
          </div>
          <span class="list-artist">{{ item.singer }}</span>
          <span v-if="listType === 1" class="list-time">
            {{ (item.duration % 3600) | format }}
            <a-icon
              class="hover list-menu-icon-del"
              type="delete-mini"
              :size="40"
              @click.stop="deleteItem(index)"
            />
          </span>
          <span v-else class="list-album">{{ item.album }}</span>
        </div>
        <slot name="listBtn"></slot>
      </div>
    </template>
  </div>
</template>

<script>
import { getMusicUrl, getAlbum } from '@/api'
import { format } from '@/utils/util'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    // 歌曲数据
    list: {
      type: Array,
      default: () => []
    },
    listType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listScroll: throttle((e) => {
        const scrollTop = e.target.scrollTop
        this.scrollTop = scrollTop
        const { scrollHeight, offsetHeight } = e.target
        if (scrollTop + offsetHeight >= scrollHeight - 50) {
          console.log('trigger')
          this.$emit('pullup')
        }
      }, 100)
    }
  },
  computed: {
    ...mapGetters(['playing', 'currentMusic', 'locallist'])
  },
  methods: {
    scrollTo() {
      this.$refs.listContent.scrollTop = 0
    },
    async selectItem(item, index) {
      if (this.currentMusic.id && item.id === this.currentMusic.id) {
        this.setPlaying(!this.playing)
        return
      }

      const res = await getMusicUrl(item.id);
      item.url = res.data.data[0].url
      item.albumImg = await this.getAlbumImg(item.albumId)
      this.$emit('select', item, index) // 触发点击播放事件
    },
    likeItem(item) {
      this.selectLike(item)
    },
    dislikeItem(item) {
      this.selectDislike(item)
    },
    async addItem(item, index) {
      if (this.currentMusic.id && item.id === this.currentMusic.id) {
        return
      }

      const res = await getMusicUrl(item.id)
      item.url = res.data.data[0].url
      item.albumImg = await this.getAlbumImg(item.albumId)
      this.$emit('add', item, index) // 触发添加事件
    },
    deleteItem(index) {
      this.$emit('del', index) // 触发删除事件
    },
    getPlayIconType({ id: itemId }) {
      const {
        playing,
        currentMusic: { id }
      } = this
      return playing && id === itemId ? 'pause-mini' : 'play-mini'
    },
    isLike(item) {
      let index = this.locallist.findIndex(song => {
        return song.id == item.id
      })
      return index >= 0 ? true : false
    },
    async getAlbumImg(albumId) {
      const res = await getAlbum(albumId)
      return res.data.album.picUrl
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions(['selectLike', 'selectDislike'])
  },
  filters: {
    format
  }
}

function throttle(func, wait) {
    let lastTime
    return function(...rest) {
        if (!lastTime ||
          (new Date().getTime() - lastTime > wait)) {
            lastTime = +new Date()
            func.apply(this, rest)
        }
    }
}
</script>

<style lang="less" scoped>
.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;

  .list-name {
    padding-left: 40px;
    user-select: none;
  }
}

.list-content {
  width: 100%;
  height: calc(~'100% - 60px');
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.list-item {
  display: flex;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 60px;
  overflow: hidden;

  &.list-item-no {
    justify-content: center;
    align-items: center;
  }

  &.on {
    color: #fff;

    .list-num {
      font-size: 0;
      background: url('../../assets/img/wave.gif') no-repeat center center;
    }
  }

  &:hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }
  }

  &:not([class*='list-header']):hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }

    .list-time {
      font-size: 0;

      .list-menu-icon-del {
        display: block;
      }
    }
  }

  .list-num {
    display: block;
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }

  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;

    & > span {
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    small {
      margin-left: 5px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /*hover菜单*/

    .list-menu {
      display: none;
      position: absolute;
      top: 50%;
      right: 10px;
      height: 40px;
      font-size: 0;
      transform: translateY(-50%);
    }
  }

  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    @media (max-width: 1440px) {
      width: 200px;
    }
    @media (max-width: 1200px) {
      width: 150px;
    }
  }

  .list-time {
    display: block;
    width: 60px;
    position: relative;

    .list-menu-icon-del {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
</style>