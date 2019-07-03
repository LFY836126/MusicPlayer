<template>
  <!-- ![search box interface](https://i.loli.net/2019/04/10/5cad4362e8bef.png) -->
  <div class="search">
    <div class="search-box-wrapper">
       <!-- @query="onQueryChange" -->
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
      <!-- v-show="!query"：当前搜索框没有内容的时候显示热门搜索，如果搜索框有内容的时候显示搜索列表 -->
    <div
      class="shortcut-wrapper"
      ref="shortcutWrapper"
       v-show="!query"
       :refreshDelay="refreshDelay"
    >
      <scroll
        class="shortcut"
        ref="shortcut"
        :data="shortcut"
      >
        <div>
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
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <!-- @click="showConfirm" -->
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!-- 通过组件显示列表 -->
            <!-- @delete="deleteSearchHistory"
               -->
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteOne"
            >
            </search-list>
          </div> 
        </div>
      </scroll>
    </div>
    <div
      class="search-result"
      v-show="query"
      ref="searchResult"
    >
      <!--v-show="query"： 当搜索框中有内容的时候才显示搜素列表 -->
      <suggest
        ref="suggest"
        :query="query"
        v-show="query"
        @listScroll="blurInput"
        @select="saveSearch"
      >
      </suggest>
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"
    >
    </confirm>
    <!-- 当搜索内容含有歌手的时候，跳转路由，跳到歌手详情页 -->
    <router-view></router-view> 
  </div>
</template>

<script type="text/ecmascript-6">
// mapGetters 在mixin中定义了
import { mapActions } from 'vuex'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { playlistMixin, searchMixin } from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'

export default {
  // mixins: [playlistMixin, searchMixin],
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },
  data() { 
    return {
      hotKey: [],
      // 在mixin中定义了
      // query: ''
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    // 在mixin中定义了，直接用就可以
    // ...mapGetters(['searchHistory']),
    // 为了正确计算scroll高度
    shortcut() { // when hotKey | searchHistory changes, scroll reset height
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    // 在mixin中定义了
    // onQueryChange(query){
    //   this.query = query;
    // },
    // 'saveSearchHistory', 'deleteSearchHistory'：在mixin中定义了
    ...mapActions(['clearSearchHistory']),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      // 调用suggest中refresh的方法,重新计算scroll高度
      this.$refs.suggest.refresh()
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
  // 显示提示弹框
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 下面这两个方法在mixin中定义了 
  // // 调用子组件的方法，让输入框失去焦点
  //   blurInput(){
  //     this.$refs.searchBox.blur();
  //   },
  //   // 搜索历史
  //   saveSearch(){
  //     this.saveSearchHistory(this.query);
  //   },
    // 删除某条搜索历史
    deleteOne(item){
      this.deleteSearchHistory(item);
    },
    // deleteAll(){
    //   this.clearSearchHistory();
    // },
    // 在搜索框中填入内容
    addQuery(query) {
      // 父组件调用子组件的方法，将输入框中的内容设置为指定内容
      this.$refs.searchBox.setQuery(query)
    },
    // 得到热门搜索内容
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          // 将请求的前10个数据放到hotkey中
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  watch: {
    query(newQuery) { // Prevent current interface from disable scrolle
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './search.scss';
</style>
