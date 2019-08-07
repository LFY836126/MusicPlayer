<template>
  <!-- ![recommend interface](https://i.loli.net/2019/04/06/5ca861da160ba.png) -->

  <!-- 轮播图实现逻辑：举个栗子，比如说5个图片的轮播图
  屏幕宽度 100px
  设置子元素宽度：100px
  设置父元素宽度：100 * 5 + 2 * 100 = 700px
   -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!-- silder这个插件在components/recommend.vue引入后,silder标签之间的dom在这里slot渲染 -->
      <slot></slot>
    </div>
    <!-- 轮播图下面的小点 -->
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      >
      <!-- 如何将滚动到某页和currentPageIndex结合起来？ -->
      <!-- 正常better-scroll在滚动的时候其实是派发一个事件的 ，见后面this.slider.on('scrollEnd', {})-->
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  props: {
    loop: {// 是否可以循环轮播
      type: Boolean,
      default: true//默认可以轮播
    },
    autoPlay: {//是否可以自动轮播
      type: Boolean,
      default: true//默认可以自动轮播 
    },
    interval: {//自动轮播间隔
      type: Number,
      default: 2000//默认轮播间隔是2s
    }
  },
  data() {
    return {
      dots: [],//轮播图下面的小点
      currentPageIndex: 0 //记录当前活跃的点，以便样式的改变
    }
  },
  mounted() {
    setTimeout(() => { // setTimeout: 20s, browser 17s refreshe once
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._autoPlay()
      }
      // 20毫秒是怎么得到的？
      // 因为浏览器刷新间隔是17ms一次
    }, 20)
    window.addEventListener('resize', () => {
      // 当silder什么都没做时候
      if (!this.slider) {
        return
      }
      // 重新计算宽度
      this._setSliderWidth(true)
      this.slider.refresh() // better-scroll: dom change, refresh
    })
  },
  methods: {
    // 设置轮播图宽度
    _setSliderWidth(isResize) {
      // 轮播图子元素dom结点的集合
      this.children = this.$refs.sliderGroup.children
      /*
      console.log(this.children.length) = 5
      better-scroll copy 2 dom For loop
      dom: 5+2=7
      */
      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        // 为轮播图每个子元素添加类名，这个添加的方法封装成了一个单独的文件
        addClass(child, 'slider-item') // addClass(): common/js/dom.js
        // 改变子元素大小为父元素占的屏幕大小
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果loop是true的话，在我们初始化better-scroll会左右克隆两个dom，保证循环切换，所以长度要*2
      // console.log(this.loop);
      if (this.loop && !isResize) {
        // console.log(width,sliderWidth)
        width += 2 * sliderWidth
        // console.log(width)
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 轮播图下面的几个点
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // 允许左右滚动
        scrollX: true,
        // 不允许上下滚动
        scrollY: false,
        momentum: false, // Whether to open the sliding inertia when sliding quickly
        // 新写法
        snap: { // 这个配置是为了做 Slide 组件用的
          loop: this.loop,
          threshold: 0.3, // 可滚动到下一个的阈值
          speed: 400 // 过渡时间
        },
        // 旧写法
        // snap: true, // for slide component
        // snapLoop: true, // Is it possible to seamlessly cycle the carousel ?
        // snapThreshold: 0.2, // The threshold at which the page can be switched when the finger is swiped, You can switch the threshold of the page when you swipe your finger
        // snapSpeed: 400, // Animation time for carousel switching
        // better-scroll and fastclick versus, Clicking on the carousel in mobile mode does not jump
        click: true
      })
      // 每次在切换下一张图片的，会触发一个scrollEnd事件
      this.slider.on('scrollEnd', () => { // better-scroll scrollEnd trigger
        let pageIndex = this.slider.getCurrentPage().pageX // pageIndex: stop page index
        // if (this.loop) {
          // 因为getCurrentPage()获取的就是当前页的页码，所以不用 -1
        //   pageIndex -= 1 // better-scroll: add one copy at the first element for loop
        // }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    _autoPlay() {
      // let pageIndex = this.currentPageIndex + 1 // pageIndex: stop page index + 1, scroll to next page
      this.timer = setTimeout(() => {
        /*
        better-scrol func: goToPage()
        pageIndex: x
        0: y
        400: time interval
        */
        /* goToPage(x, y, time, easing):
           x: 横轴的页数 
           y: 纵轴的页数  
           time: 动画执行的时间 
           easing: 缓动函数
        */
        // this.slider.goToPage(pageIndex, 0, 400);可以实现动画的效果，但是只轮播到最后一张图就停
        this.slider.next();
      }, this.interval)
    }
  },
  destroyed() { // Clear the timer after the route change
  // 把定时器等资源进行清理，有利于内存的释放
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './slider.scss';
</style>
