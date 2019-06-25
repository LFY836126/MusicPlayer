<template>
  <!-- ![music player interface](https://i.loli.net/2019/04/09/5cac16b7d5a91.png) -->
  <!-- 分为两部分：
  normal-player:展开的播放器，
  mini-player：收起后在底部的播放器
  -->
  <div class="player" v-show="playlist.length>0">
    <!-- name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave" -->
    <transition name="normal"  
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 1.首先一张背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image"/>
        </div>
        <!-- 2.1头的部分，歌曲名，歌手名称 -->
        <div class="top">
          <!-- 2.1.1左上角有一个返回按钮 -->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!-- 2.1.2歌曲名 -->
          <h1 class="title" v-html="currentSong.name"></h1>
          <!-- 2.1.3歌手名 s-->
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 2.2中间部分有一个唱片，唱片中间有个图片 -->
        <div class="middle">
          <!-- @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd" -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- 2.2.1唱片图片 -->
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image"/>
              </div>
            </div>
            <!-- <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div> -->
          </div>
          <!-- :data="currentLyric && currentLyric.lines": currentLyric!==null -->
          <!-- <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  ref="lyricLine"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                  :class="{'current': currentLineNum === index}"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll> -->
        </div>
        <!-- 2.3底部的一个操作区，包含一个进度条 -->
        <div class="bottom">
          <!-- <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>-->
          <div class="progress-wrapper">
            <!-- 当前歌曲播放时长 -->
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <!-- <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar> -->
            </div>
            <!-- 当前歌曲总时长 -->
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div> 
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev" ></i>
            </div>
            <!-- 设置歌曲播放或者暂停 -->
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 缩小版的播放 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 1.有一个小型唱片图片 -->
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls"/>
        </div>
        <div class="text">
          <!-- 2.歌手名称，歌曲名称 -->
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 3.播放按钮 -->
        <div class="control">
          <!-- insert slot -->
          <!-- <progress-circle :radius="radius" :percent="percent">-->
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          <!--</progress-circle> -->
        </div>
        <!-- 4.点开歌曲列表的按钮 --> 
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- <playlist ref="playlist"></playlist> -->
    <!-- 播放歌曲 -->
    <!-- audio会派发两个事件
    一个是canplay：当歌曲能播放时候触发该事件
    另一个是error：当歌曲播放出错时候会触发这个事件 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
    >
          <!-- @play="ready"
      @error="error"
      @timeupdate="updateTime"  
      @ended="end" -->
    <!-- 当currentSong发生改变的时候调用play方法 -->
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
// 根据不同浏览器设置前缀`
import { prefixStyle } from 'common/js/dom'
// import { playMode } from 'common/js/config'
// import { playerMixin } from 'common/js/mixin'
import animations from 'create-keyframe-animation'
// import ProgressBar from 'base/progress-bar/progress-bar'
// import ProgressCircle from 'base/progress-circle/progress-circle'
// import Lyric from 'lyric-parser'
// import Scroll from 'base/scroll/scroll'
// import Playlist from 'components/playlist/playlist'

const transform = prefixStyle('transform')
// const transitionDuration = prefixStyle('transitionDuration')

export default {
  // components: {
  //   ProgressBar,
  //   ProgressCircle,
  //   Scroll,
  //   Playlist
  // },
  // mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
  //     radius: 32,
  //     currentLyric: null,
  //     currentLineNum: 0, // lyrics highlight
  //     currentShow: 'cd', // disc interface and lyrics interface
  //     playingLyric: '' // CD below lyrics
    }
  },
  // created() {
  //   this.touch = {}
  // },
  computed: {
  // 'fullScreen':控制大的播放器显示，还是底部收起的播放器显示，在组件中利用v-show来控制
    ...mapGetters([
      // 当前播放歌曲索引
      'currentIndex', 
      // 设置是大的播放页面还是缩小版的播放页面
      'fullScreen', 
      // 'playing',
      // 播放列表，当playlist的length>0之后才能显示播放器页面
      'playlist',
      // 当前播放歌曲
      'currentSong',
      // 这个playing就是通过getters从vuex获取的playing，默认为false，当点击歌曲列表music-list.vue的时候，会提交一个actions，然后会改变state中的playing的状态
      'playing',
      ]),
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
  //   percent() {
  //     return this.currentTime / this.currentSong.duration
  //   }
  },
  methods: {
    ...mapMutations({
      // 获取更改state中fullScreen的mutations方法
      setFullScreen: 'SET_FULL_SCREEN',
      // 获取更改state中playing的mutations方法
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX'
    }),
  //   ...mapActions(['savePlayHistory']),
    back() {
      // 不能直接this.fullScreen = false，因为在Vuex中，要通过
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    // done参数代表一个回调函数，执行的时候会跳到afterenter
    // 由小的CD到大的CD的转化，中间有一个动画的效果
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 注册动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 运行动画，第一个参数：作用的dom，第二个参数，作用的动画，第三个函数：作用的回调函数，动画执行完了之后执行done函数，也就是afterenter
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 动画完成之后将所有样式置为空
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // done参数代表一个回调函数，执行的时候会跳到afterleave
    // leave是大CD到小CD的移动，不过这里没设置动画的效果，直接移动的
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      // 添加动画执行结束后触发的事件，也就是执行afterleave
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    togglePlaying() {
      // if (!this.songReady) {
      //   return
      // }
      this.setPlayingState(!this.playing)
      // if (this.currentLyric) { // when scroll lyrics can play, preventing the lyrics from scrolling while they stop playing
      //   this.currentLyric.togglePlay()
      // }
    },
  //   end() {
  //     if (this.mode === playMode.loop) {
  //       this.loop()
  //     } else {
  //       this.next()
  //     }
  //   },
  //   loop() {
  //     this.$refs.audio.currentTime = 0
  //     this.$refs.audio.play()
  //     this.setPlayingState(true)
  //     if (this.currentLyric) {
  //       this.currentLyric.seek(0) // <audio>, song jump to begin
  //     }
  //   },
    next() {
      // 如果当前歌曲没有准备好，就直接返回
      if (!this.songReady) {
        return
      }
      // if (this.playlist.length === 1) { // only one song
      //   this.loop()
      //   return
      // } else {
        let index = this.currentIndex + 1
        // 如果当前歌曲是最后一首歌
        if (index === this.playlist.length) {
          index = 0
        }
        // 获取mutations中的方法改变state
        this.setCurrentIndex(index)
        // 当点击按钮(播放下一首)后，发现歌曲虽然跳到了下一首，但是图标并没有，所以这里就是更改图标的
        if (!this.playing) {
          this.togglePlaying()
        }
      // }
      // 点击之后this.songReady = false,确保下一首歌曲准备好时 才可以点击
      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }
  //     if (this.playlist.length === 1) {
  //       this.loop()
  //       return
  //     } else {
        let index = this.currentIndex - 1
        // 如果当前歌曲是第一首歌
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        // 当点击按钮(播放上一首)后，发现歌曲虽然跳到了下一首，但是图标并没有，所以这里就是更改图标的
        if (!this.playing) {
          this.togglePlaying()
        }
  //     }
      this.songReady = false
    },
    ready() {
      this.songReady = true
      // this.savePlayHistory(this.currentSong)
    },
    error() {
      // 容错处理:当前歌曲播放不出来的话也可以实现点击下一首的功能
      this.songReady = true
    },
    updateTime(e) {
      // update会传进来一个e的事件，这个事件有一个target属性就是audio标签
      // 这个audio还有一个可以获取到当前播放时间的属性就是currenTime,
      // 这个currentTime是一个时间戳的形式，是可读写属性
      this.currentTime = e.target.currentTime // <audio> current time
    },
    format(interval) {
      //interval|0就是一个正数的向下取整
      interval = interval | 0  // | 0: math.floor
      const minute = (interval / 60) | 0
      // 当前播放时长我们要显示0.06不是0.6，也就是当余数为个位数的时候，需要一个补0的函数pad
      const second = this._pad(interval % 60) // _pad: Use 0 to fill 2 bits
      return `${minute}:${second}`
    },
    // 第二个参数0代表小数点后需要补两位
    _pad(num, n = 2) { // _pad: use 0 to fill 2 bits
    // 获取字符串长度
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
  //   onProgressBarChange(percent) {
  //     const currentTime = this.currentSong.duration * percent
  //     this.$refs.audio.currentTime = currentTime
  //     if (!this.playing) {
  //       this.togglePlaying()
  //     }
  //     if (this.currentLyric) {
  //       this.currentLyric.seek(currentTime * 1000)
  //     }
  //   },
  //   getLyric() {
  //     this.currentSong
  //       .getLyric()
  //       .then(lyric => {
  //         if (this.currentSong.lyric !== lyric) { // prevent fast switch, result in unmatched lyric
  //           return
  //         }
  //         this.currentLyric = new Lyric(lyric, this.handleLyric)
  //         if (this.playing) {
  //           this.currentLyric.play()
  //         }
  //       })
  //       .catch(() => {
  //         this.currentLyric = null
  //         this.playingLyric = ''
  //         this.currentLineNum = 0
  //       })
  //   },
  //   handleLyric({ lineNum, txt }) {
  //     this.currentLineNum = lineNum
  //     if (lineNum > 5) {
  //       const lineEl = this.$refs.lyricLine[lineNum - 5]
  //       this.$refs.lyricList.scrollToElement(lineEl, 1000)
  //     } else {
  //       this.$refs.lyricList.scrollTo(0, 0, 1000)
  //     }
  //     this.playingLyric = txt
  //   },
  //   showPlaylist() {
  //     this.$refs.playlist.show()
  //   },
  //   middleTouchStart(e) {
  //     this.touch.initiated = true
  //     this.touch.moved = false
  //     const touch = e.touches[0] // finger click info
  //     this.touch.startX = touch.pageX
  //     this.touch.startY = touch.pageY
  //   },
  //   middleTouchMove(e) {
  //     if (!this.touch.initiated) {
  //       return
  //     }
  //     const touch = e.touches[0]
  //     const deltaX = touch.pageX - this.touch.startX
  //     const deltaY = touch.pageY - this.touch.startY
  //     if (Math.abs(deltaY) > Math.abs(deltaX)) { // whether switch depends on x-axis scroll more than y-axic scroll
  //       return
  //     }
  //     if (!this.touch.moved) {
  //       this.touch.moved = true
  //     }
  //     const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
  //     // page left-scroll distance
  //     const offsetWidth = Math.min(
  //       0,
  //       Math.max(-window.innerWidth, left + deltaX)
  //     )
  //     this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
  //     // lyricList: Vue component, $el access dom
  //     this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  //     this.$refs.lyricList.$el.style[transitionDuration] = 0
  //     this.$refs.middleL.style.opacity = 1 - this.touch.percent
  //     this.$refs.middleL.style[transitionDuration] = 0
  //   },
  //   middleTouchEnd() {
  //     if (!this.touch.moved) {
  //       return
  //     }
  //     let offsetWidth
  //     let opacity
  //     if (this.currentShow === 'cd') {
  //       // slide <-
  //       if (this.touch.percent > 0.1) {
  //         offsetWidth = -window.innerWidth
  //         opacity = 0
  //         this.currentShow = 'lyric'
  //       } else {
  //         offsetWidth = 0
  //         opacity = 1
  //       }
  //     } else {
  //       // slide ->
  //       if (this.touch.percent < 0.9) {
  //         offsetWidth = 0
  //         this.currentShow = 'cd'
  //         opacity = 1
  //       } else {
  //         offsetWidth = -window.innerWidth
  //         opacity = 0
  //       }
  //     }
  //     const time = 300
  //     this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  //     this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
  //     this.$refs.middleL.style.opacity = opacity
  //     this.$refs.middleL.style[transitionDuration] = `${time}ms`
  //     this.touch.initiated = false
    // },
  // 为了实现从大的CD到小的CD动画效果的缩放，要拿到初始的参数，如缩放比例或者位置信息
    _getPosAndScale() {
      const targetWidth = 40 // Small record width
      const paddingLeft = 40 // Small record paddingLeft，指CD中心点
      const paddingBottom = 30 // Small record paddingBottom，指CD中心点
      const paddingTop = 80 // Big record paddingTop
      const width = window.innerWidth * 0.8 // Big record width
      const scale = targetWidth / width /*缩放比例*/
      // 大的CD向左移动的距离
      const x = -(window.innerWidth / 2 - paddingLeft) // Fourth quadrant, Big record middle point (x, y)
      // 大的CD向下移动的距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return { x, y, scale }
    }
  },
  watch: {
    currentSong(newSong, oldSong) { // currentSong change, invoked play()
    // 设置一个延迟
    this.$nextTick(() => {
        this.$refs.audio.play()//只写这一句是会报错的，因为调用play时候，我们同时请求src是不可以的，这个dom还没有ready
      })
    },
      // if (!newSong.id) { // no song
      //   return
      // }
  //     if (newSong.id === oldSong.id) { // mixin.js/changeMode(), currentSong.id no change currentSong no change
  //       return
  //     }
  //     if (this.currentLyric) {
  //       this.currentLyric.stop() // stop timer of the first song
  //       this.currentTime = 0
  //       this.playingLyric = ''
  //       this.currentLineNum = 0
  //     }
  //     clearTimeout(this.timer)
  //     this.timer = setTimeout(() => {
  //       this.$refs.audio.play() // method & data it's sync
  //       this.getLyric()
  //     }, 1000)
  //   },
  // 监听playing的状态，若是playing的状态更改了之后，触发audio的相应方法，实现播放或者暂停
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => { // method & data it's sync
        newPlaying ? audio.play() : audio.pause()
      })
    },
    // fullScreen(newVal) {
    //   if (newVal) {
    //     setTimeout(() => {
    //       this.$refs.lyricList.refresh()
    //     }, 20)
    //   }
    // }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './player.scss';
</style>
