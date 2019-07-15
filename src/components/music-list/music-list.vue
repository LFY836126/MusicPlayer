<template>
  <!-- ![singer detail interface](https://i.loli.net/2019/04/08/5caac3e8e7a0f.png) -->
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- v-html="title": title中可能有很多转义字符，所以要用这个指令转化为正常的title -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <!-- <div class="filter"></div> -->
      <div class="play-wrapper">
        <!-- v-show="songs.length>0" ：按钮必须等数据渲染完了再出现-->
        <div
          class="play"
          ref="playBtn"
          v-show="songs.length>0"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 这里把songs传入scroll中是为了正确计算滚动区域高度 -->
    <scroll :data="songs" class="list" ref="list" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
      <!-- <div class="song-list-wrapper"> -->
        <song-list :songs="songs" @select="selectItem" :rank="rank">
        </song-list>
      <!-- </div> -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'

// 自动添加浏览器前缀
import { prefixStyle } from 'common/js/dom'
import { playlistMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
// 这两个css属性需要判断在哪个浏览器下，进而确定添加哪个前缀
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading,
    SongList
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    // 歌曲列表是否显示排名
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0 // real time roll position
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT // bg-layer minTransalteY

  //  this.$refs.list拿到scroll下的vue-components对象，再通过$el获取到dom对象,然后将song-list组件position的top设置为图片高度的位置
    // this.$refs.list.$el.style.top = `${this.imageHeight}px`
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  computed: { 
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    handlePlaylist(playlist) {
      // 当playlist中有数据的时候，就将滚动组件的bottom设置为60px
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      // console.log(this.$refs.list, '-----------')
      this.$refs.list.refresh()
    },
    scroll(pos) {
      // newVal：整个滑动部分相对于初始位置的偏移
      //               手指往上滑为负，往下滑为正
      //               滑动到最底部，pos值为"负值绝对值"最大的时候
      // 获取歌曲列表滚动的距离
      // pos：整个滑动部分相对于初始位置的偏移，手指往上滑为负，往下滑为正，滑动到最底部s，pos值为"负值绝对值"最大的时候
      this.scrollY = pos.y
    },
    // 点击左上角返回上一级，
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
      // console.log(this.currentIndex);
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    }
  },
  watch: {
    scrollY(newVal) {
      // 设置背景最远滚动这些距离
      const translateY = Math.max(this.minTransalteY, newVal)
      // 设置手指下滑，图片放大的属性
      let scale = 1
      // 设置谁覆盖谁的属性
      let zIndex = 0
      // 设置手指下滑，图片模糊的效果的属性
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) { // scroll down
        scale = 1 + percent
        // 如果不设置zIndex = 10，那么当向下拉的时候，歌曲列表会覆盖图片
        zIndex = 10
      } else {
        blur = Math.min(percent * 20, 20)
      }
  // 设置歌单列表的背景色滑动效果
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      // this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
      // css属性，设置模糊
      this.$refs.filter.style[backdrop] = `blur(${blur}px)` // gaussian-blur: iphone view

      // 当手指向上滑动的时候，如果滑动距离超过了图片的一部分高度，那么就通过设置图片的z-index来令图片的一部分在上显示
      if (newVal < this.minTransalteY) { // scroll to top滚动到顶部
        zIndex = 10
        // 因为图片设置的大小是通过width和padding-top实现的宽高比为10:7的，所以要是改变height就要先将paddingTop置为0
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`

        // 设置随机播放全部的按钮，在滑动到最顶端时候消失
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        // 设置随机播放全部的按钮在正常情况下，display = ''，让它正常显示
        this.$refs.playBtn.style.display = ''
      }
      // 设置手指下滑过程中，图片放大的效果
      this.$refs.bgImage.style[transform] = `scale(${scale})`      
      // this.$refs.bgImage.style[webkitTransform] = `scale(${scale})`

      // 设置手指下滑或者过程中，图片(上下滑过程中图片高度会改变)始终保持在页面最前面
      this.$refs.bgImage.style.zIndex = zIndex
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./music-list.scss";
</style>
