<template>
  <!-- ![search box interface](https://i.loli.net/2019/04/10/5cad4362e8bef.png) -->
  <div class="search">
    <div class="search-box-wrapper">
       <!-- @query="onQueryChange" -->
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!--
      :refreshDelay="refreshDelay" -->
      <!-- v-show="!query"：当前搜索框没有内容的时候显示热门搜索，如果搜索框有内容的时候显示搜索列表 -->
    <div
      class="shortcut-wrapper"
      ref="shortcutWrapper"
       v-show="!query"
    >
      <!-- <scroll
        class="shortcut"
        ref="shortcut"
        :data="shortcut"
      > -->
      <div>
        <div class="shortcut">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <!--hotkey:从qq音乐获取的热门搜索的数据  -->
              <!-- 点击li将内容填进搜索框中 -->
              <li
                class="item"
                v-for="(item,index) in hotKey"
                :key="index"
                @click="addQuery(item.k)"
              >
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!-- <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @delete="deleteSearchHistory"
              @select="addQuery"
            >
            </search-list>
          </div> -->
        </div>
      </div>
      <!-- </scroll> -->
    </div>
    <!-- 
    <div
      class="search-result"
      v-show="query"
      ref="searchResult"
    >
      -->
      <!-- @listScroll="blurInput"
        @select="saveSearch" -->
      <!--v-show="query"： 当搜索框中有内容的时候才显示搜素列表 -->
      <suggest
        ref="suggest"
        :query="query"
        v-show="query"
        @listScroll="blurInput"
      >
      </suggest>
      <!-- 
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"
    >
    </confirm>
    -->
    <!-- 当搜索内容含有歌手的时候，跳转路由，跳到歌手详情页 -->
    <router-view></router-view> 
  </div>
</template>

<script type="text/ecmascript-6">
// import { mapActions } from 'vuex'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
// import { playlistMixin, searchMixin } from 'common/js/mixin'
// import Scroll from 'base/scroll/scroll'
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
// import SearchList from 'base/search-list/search-list'
// import Confirm from 'base/confirm/confirm'

export default {
  // mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
  //   Scroll,
    Suggest,
  //   SearchList,
  //   Confirm
  },
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  created() {
    this._getHotKey()
  },
  // computed: {
  //   shortcut() { // when hotKey | searchHistory changes, scroll reset height
  //     return this.hotKey.concat(this.searchHistory)
  //   }
  // },
  methods: {
    onQueryChange(query){
      this.query = query;
    },
  //   ...mapActions(['clearSearchHistory']),
  //   handlePlaylist(playlist) {
  //     const bottom = playlist.length > 0 ? '60px' : ''
  //     this.$refs.searchResult.style.bottom = bottom
  //     this.$refs.suggest.refresh()
  //     this.$refs.shortcutWrapper.style.bottom = bottom
  //     this.$refs.shortcut.refresh()
  //   },
  //   showConfirm() {
  //     this.$refs.confirm.show()
  //   },
  // 调用子组件的方法，让输入框失去焦点
    blurInput(){
      this.$refs.searchBox.blur();
    },
    addQuery(query) {
      // 父组件调用子组件的方法，将输入框中的内容设置为指定内容
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          // 将请求的前10个数据放到hotkey中
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  // watch: {
  //   query(newQuery) { // Prevent current interface from disable scrolle
  //     if (!newQuery) {
  //       setTimeout(() => {
  //         this.$refs.shortcut.refresh()
  //       }, 20)
  //     }
  //   }
  // }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './search.scss';
</style>
