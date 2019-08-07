<template>
  <!-- ![search box interface](https://i.loli.net/2019/04/10/5cad4362e8bef.png) -->
  <!-- 
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll" -->
    <!-- @scrollToEnd="searchMore"：接受scroll组件传来的事件(当此时滚动到底部时 派发的事件) -->
  <scroll
    :pullup="pullup"
    class="suggest"
    ref="suggest"
    :data="result"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    :beforeScroll="beforeScroll"
  >
    <ul class="suggest-list">
      <!-- v-for="(item,index) in result"
        :key="index"
         -->
      <li
        class="suggest-item"
        v-for="(item,index) in result"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="icon">
          <!-- 图标是动态的，也就是歌手和歌曲显示的图标是不一样的-->
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <!-- 歌手与歌曲显示的数据也是不一样的 -->
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <!-- 当搜索结果为空的时候，显示no-result组件 -->
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'
import { search } from 'api/search'
import { getMusic } from 'api/song'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
// 每页歌曲的数量
const perpage = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult,
  //   Singer
  },
  props: {
    // 是否检索歌手
    showSinger: {
      type: Boolean,
      default: true
    },
    // 检索词，根据检索词才能生成检索列表
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 维护当前检索的是第几页，默认是第一页
      page: 1,
      // 开启 上拉刷新的功能
      pullup: true, // drop-down refresh
      // beforeScroll: true,
      // 数据是否已经加载完了，关系到 上拉 是否刷新的到 数据
      hasMore: true, 
      // 检索列表
      result: [],
      flag: 1,
      beforeScroll: true,
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong']),
    // 刷新scroll
    refresh() {
      this.$refs.suggest.refresh()
    },
  // 获取与当前关键词有关的搜索列表
    search() { // request service-end data
    // query改变的时候，第一次调用search，page都要从第一个开始
      this.page = 1
      this.hasMore = true
    // query改变的时候，第一次调用search，都要滚动到底部
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          // res.data中有两个对象我们都要处理，一个是song，一个是zhida
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    // 将获取到的数据格式化，得到我们想要的格式
    _genResult(data, res) {
      let ret = res || []
      // type: distinguish singer & song
      // 当有包含检索词的歌手的时候，将zhida中的内容加上type:singer键值对形成一个新的对象加入到ret中
      if (data.zhida && data.zhida.singerid && this.flag) {
        this.flag = 0;
        /* eslint-disable standard/object-curly-even-spacing */
        // 将data.zhida中的所有对象，和type:'singer'整个键值对，放进每个对象中去，整个type:'singer'用于
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER }})
      }
      // 将包含该检索词的歌曲加入到ret中
      if (data.song) {
        // 将获取到的歌曲数据格式化形成真正的歌曲列表
        ret = this._normalizeSongs(ret, data.song.list);
      }
      return ret;
    },
    // _normalizeSongs(list) { // filter
    //   const ret = []
    //   list.forEach(musicData => {
    //     if (musicData.songid && musicData.albummid) {
    //       ret.push(createSong(musicData))
    //     }
    //   })
    //   return ret
    // },
   _normalizeSongs(ret, list) {
    //   let ret = ret;
      list.forEach((item) => {
    //     let {musicData} = item
        if (item.songid && item.albummid) {
          getMusic(item.songmid).then((res) => { // 这里需要先获取vkey
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(item, songVkey) // 在这里把vkey和musicData传进去
              ret.push(newSong)
            }
          })
        }
      })
      return ret
    },
    // 当滚动到底部的时候触发该事件，实现上拉刷新
    searchMore() {
      // 如果此时数据已经加载完了，就不能实现上拉刷新的功能了
      if (!this.hasMore) {
        return
      }
      // 刷新一次，page++,再请求page对应页数的数据
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data, this.result);
          this._checkMore(res.data)
        }
      })
      console.log(this.hasMore);
    },
    _checkMore(data) {
      const song = data.song
      // data中的song有几个参数：
      // 1. curnum：当前页的歌曲数量
      // 2. curpage：当前是第几页
      // 3. 和检索词有关的所有歌曲数量

      // 不能上拉刷新的条件：当前歌曲长度为0，已经检索到最后数据了
      
      if (!song.list.length || song.curnum + (song.curpage) * perpage > song.totalnum) {
        this.hasMore = false
      }
    },
    listScroll() {
      this.$emit('listScroll')
    },
  // 点击搜索列表触发的方法
    selectItem(item) {
      // 如果点击的是歌手
      if (item.type === TYPE_SINGER) {
        // 构造歌手对象
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 如果是歌手，跳转歌手页面
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        // 如果点击的是歌曲
        this.insertSong(item)
      }
      // 为了实现搜索历史功能
      this.$emit('select', item)
    },
  // 歌曲和歌手显示的文字是不一样的
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        // 如果当前对象中含有歌手名，那就显示歌手名
        return item.singername
      } else {
        // 否则显示歌手名
        // item中song已经被处理过了，所以直接写item.name就行不,用写item.songname
        return `${item.name}-${item.singer}`
      }
    },
  // 设置歌曲和歌手图标的样式
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    }
  },
  watch: {
    // 监听query值的改变
    query(newQuery) { // request server **api/search.js**
      this.search(newQuery)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './suggest.scss';
</style>
