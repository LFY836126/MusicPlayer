<template>
  <div class="recommend" ref="recommend">
     <!-- <scroll
      class="recommend-content"
      ref="scroll"
      :data="discList"
    > -->
    <!-- 这里把discList传给scroll，因为-->
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage" class="needsclick"/> 
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <!-- .item :
            flex布局，实现左边图片和右边文字的布局，还有利用align-items: center;实现水平居中
            右边文字的上下也使用了flex布局，还有flex-direction: column;和 justify-content: center;-->
            <li class="item" v-for="item in discList" :key="item.dissid" @click="selectItem(item)">
              <div class="icon">
                <!-- v-lazy: when scroll then load -->
                <img width="60" height="60" v-lazy="item.imgurl"/>
              </div>
              <div class="text">
                <!-- item.creator.name:将名字中很多字符进行转义 -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <!-- 为了实现loading位置的居中，所以要用一个大的div包住它 -->
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data(){
    return{
      recommends: [],
      discList: [],
    }
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
  created(){
    // setTimeout(()=>{
    //   this._getRecommend()//异步获取轮播图数据
    // }, 2000)
    this._getRecommend()//异步获取轮播图数据
    this._getDiscList() //异步获取歌单数据
  },
  methods:{
    handlePlaylist(playlist) {
      // 当playlist中有数据的时候，就将滚动组件的bottom设置为60px
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      // console.log(this.$refs.list, '-----------')
      this.$refs.scroll.refresh()
    },
    // 点击li，带参数的路由跳转
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      // 并且将点击的歌单传入vuex中
      // console.log('click')
      this.setDisc(item)
      // console.log('click')
    },
    _getRecommend(){
      getRecommend().then((res) => {
        if(res.code == ERR_OK){
          // 当jsonp获取数据成功后，用数组接收数据，然后用来渲染轮播图组件
          this.recommends = res.data.slider;
        }
      })
    },
    _getDiscList() {
      getDiscList()
        .then(res => {
          if (res.code === ERR_OK) {
            // [Popular song list recommendation data](https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=__jp0)
            // Status: 500, server error, axios fix
            this.discList = res.data.list
          }
        })
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh() // better-scroll: dom change, refresh
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import './recommend.scss';
</style>
