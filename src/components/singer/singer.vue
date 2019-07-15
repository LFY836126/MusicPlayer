<template>
  <div class="singer" ref="singer">
    <!-- @select="selectSinger" 接受子组件传来的事件-->
    <list-view :data="singers" ref="list" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { playlistMixin } from 'common/js/mixin'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
// 将前10条数据定义为热门数据
const HOT_SINGER_LEN = 10
// 定义title为热门
const HOT_NAME = '热门'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  components:{
    ListView,
  },
  created() {
    this._getSingerList() // get singer data
  },
  methods:{
    handlePlaylist(playlist) {
      // 当playlist中有数据的时候，就将滚动组件的bottom设置为60px
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      // console.log(this.$refs.list, '-----------')
      this.$refs.list.refresh()
    },
     _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          // [singer data](https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=0025NhlN2yWrP4&jsonpCallback=__jp1)
          // this.singers = this._normalizeSinger(res.data.list)
          this.singers = this._normalizeSinger(res.data.list);
        }
      })
    },
    // 将数据格式化
    _normalizeSinger(list) {
      // 定义一个热门数据的数组，包括title("热门")和items(前十条数据)
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 给map这个热门数据填充数据，热门数据定义为前10条数据就是热门数据
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) { // previous 10 data, include '热门'
          // map.hot.items.push(
          //   {
          //     name: item.Fsinger_name,
          //     id: item.Fsinger_mid,
          //     avtor: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
          //   }
          // )
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        }
        // 根据Findex进行个分类，Findex就是字母
        const key = item.Findex
        if (!map[key]) { // after 10 data, not include '热门'
          map[key] = {
            title: key,
            items: []
          }
        }
        // map[key].items.push(
        //     {
        //       name: item.Fsinger_name,
        //       id: item.Fsinger_mid,
        //       avtor: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
        //     }
        //   )
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      })

      // 此时的map是个对象，里面也是一个一个对象，但是我们此时需要的是一个有序数组列表
      // console.log(map);
      // 为了得到有序列表，我们需要处理map

      // 处理热门数据剩下的数据，也就是按字母分类的数组
      const ret = []
      // 热门数组
      const hot = []
      for (const key in map) {
        const val = map[key]
        // 如果key是字母，就放入除了热门剩下的数组中
        if (val.title.match(/[a-zA-Z]/)) { // distinguishes '热门' & letter
          ret.push(val)
          // 否则放入热门数组
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      // 将字母数组按照字母表顺序排序
      ret.sort((a, b) => { // ascend sort
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 将数组拼接返回去，得到的也就是一个一维数组
      return hot.concat(ret)
    },
    selectSinger(singer) {
      this.$router.push({ // route jump
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 经过这个映射，在代码中就可以调用this.setSinger
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
// 这个.singer.scss中.singer类设置了position: fixed;就是为了固定父容器高度
// 因为better-scroll有个条件就是父容器的高度要限制好，子元素撑开之后才能实现滚动
@import './singer.scss';
</style>