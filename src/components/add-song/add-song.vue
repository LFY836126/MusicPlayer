<template>
  <!-- ![add song to list interface](https://i.loli.net/2019/04/10/5cada57184b01.png) -->
  <transition name="slide">
     <!--  @click.stop：因为这个组件是在playlist中引入的，playlist中也有点击事件，所以阻止冒泡 -->
    <div class="add-song" v-show="showFlag" @click.stop>
    <!--.header：header区域 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- .search-box-wrapper：搜索框 -->
      <div class="search-box-wrapper">
        <!-- @query="onQueryChange" -->
        <search-box
          ref="searchBox"
          placeholder="搜索歌曲"
          @query="onQueryChange"
        >
        </search-box>
      </div>
       <!-- -->
       <!-- .shortcut：最近播放和搜索历史 -->
      <div class="shortcut"  v-show="!query">
        <!-- @switch="switchItem"：监听子组件传来的方法 -->
        <!--switches 最近播放和历史播放-->
        <switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switch="switchItem"
        >
        </switches>
        <div class="list-wrapper">
          <!--ref=songList:最近播放列表 -->
          <scroll
            class="list-scroll"
            ref="songList"
            v-if="currentIndex === 0"
            :data="playHistory"
          >
            <div class="list-inner">
              <!-- 歌曲列表 -->
              <!-- @select="selectSong"：select是song-list传给父组件的方法 -->
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <!-- ref="searchList":搜索历史列表 -->
          <scroll
            class="list-scroll"
            ref="searchList"
            v-if="currentIndex === 1"
            :data="searchHistory"
            :refreshDelay="refreshDelay"
          >
          <!-- :data="searchHistory":在mixin中定义的，从vue中取的 
                :searches="searchHistory"
                @delete="deleteSearchHistory"
                @select="addQuery"
                以上三个都是mixin中共享的方法 
          -->
            <div class="list-inner">
              <search-list
                :searches="searchHistory"
                @delete="deleteSearchHistory"
                @select="addQuery"
              >
              </search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- .search-result：搜索结果 -->
      <!-- v-show="query" -->
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @listScroll="blurInput"
          @select="selectSuggest"
        >
        </suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
// 引用搜索逻辑
import SearchBox from 'base/search-box/search-box'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import Switches from 'base/switches/switches'
import TopTip from 'base/top-tip/top-tip'
// 引用搜索逻辑
import Suggest from 'components/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
// 将 从本地取出来的对象转化为Song实例
import Song from 'common/js/song'

export default {
  components: {
    // 搜索框
    SearchBox,
    SearchList,
    // 歌曲列表
    SongList,
//     SearchList,
    Scroll,
    // 最近播放和搜素历史
    Switches,
    // 添加歌曲后的弹出提示
    TopTip,
// 搜索组件核心组件
    Suggest
  },
  mixins: [searchMixin],
  data() {
    return {
      // 默认关键词是空，在mixin中定义了
      // query: '',
      // 不显示这个组件
      showFlag: false,
      // 不搜索歌手
      showSinger: false,
//       songs: [],
      // 这两个是和最近播放和搜索历史有关的
      currentIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  methods: {
    ...mapActions(['insertSong']),
    show() {
      this.showFlag = true
      setTimeout(() => {
        // 保证scroll可以正确计算时间
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    // search(query){
    //   this.query = query;
    // },
    // 点击歌曲，将当前歌曲添加到歌曲列表中
    selectSong(song, index) {
      if (index !== 0) { 
        // song自己并不是一个Song实例，它只是拥有Song的属性，
        this.insertSong(new Song(song)) // new Song() -> 传入实例, song 不是实例是对象
        this.$refs.topTip.show()
      }
    },
    selectSuggest() {
      this.$refs.topTip.show()
      // 在mixin中直接能使用
      this.saveSearch()
    },
    // 修改currentIndex，然后这个值传递给子组件的时候，改变对应部分(最近播放/搜索历史)高亮
    switchItem(index) {
      this.currentIndex = index
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './add-song.scss';
</style>
