<template>
  <!-- ![user center interface](https://i.loli.net/2019/04/10/5cadb1c58b527.png) -->
  <transition name="slide">
    <div class="user-center">
       <!-- .back返回按钮 -->
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <!-- .switches-wrapper:我喜欢的/最近听的部分 -->
      <div class="switches-wrapper">
        <switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switch="switchItem"
        >
        </switches>
      </div>
      <div
        class="play-btn"
        ref="playBtn"
        @click="random"
      >
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!-- .list-wrapper:歌曲列表 -->
      <div class="list-wrapper" ref="listWrapper">
        <!-- ref="favoriteList"：我喜欢的-->
        <scroll
          class="list-scroll"
          ref="favoriteList"
          v-if="currentIndex===0"
          :data="favoriteList"
        >
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <!--ref="playList"： 最近播放 -->
        <scroll
          class="list-scroll"
          ref="playList"
          v-if="currentIndex===1"
          :data="playHistory"
        >
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
        
      </div>
      <!-- 当我喜欢的/最近播放 没有数据，为空的时候，给出提示 -->
      <div class="no-result-wrapper" v-show="noResult">
        <!-- noResult：这个组件是否显示 -->
        <!-- noResultDesc：提示内容 -->
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
// 解决scroll正确计算高度而引入的
import { playlistMixin } from 'common/js/mixin'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result'
import Song from 'common/js/song'

export default {
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [{ name: '我喜欢的' }, { name: '最近听的' }]
    }
  },
  computed: {
    ...mapGetters([
      // 收藏列表，播放列表
      'favoriteList',
      'playHistory'
    ]),
    // 我喜欢的/最近播放  没有数据的时候下面两个计算属性生效
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    // scroll正确计算高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      // favoriteList：有可能不存在
      this.$refs.favoriteList && this.$refs.favoriteList.refresh() // $refs.favoriteList use v-if, make sure it is not undefined
      this.$refs.playList && this.$refs.playList.refresh()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      // 调整数组中元素顺序，将最后听的歌放在最前面
      this.insertSong(new Song(song))
    },
    back() {
      this.$router.back()
    },
    // 随机播放
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      // 如果没有数据，那么什么都不做，节省性能
      if (list.length === 0) {
        return
      }
      // list不是一个song实例，需要包装
      list = list.map(song => {
        return new Song(song)
      })
      this.randomPlay({ list })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './user-center.scss';
</style>
