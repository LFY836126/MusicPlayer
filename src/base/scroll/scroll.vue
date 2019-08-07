<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    // 官网找属性值的意思：https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
    probeType: {
      type: Number,
      default: 1
    },
    click: { // better-scroll: By default, the native click event of the browser is blocked. when set true，better-scroll will distributed click event
      type: Boolean,
      default: true
    },
    // 要不要监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 动态变化的数据
    data: { // Data is async, Data changes to recalculate the scroll
      type: Array,
      default: null
    },
    // 是否开启上拉刷新功能，默认是false
    pullup: { // Pull down to refresh
      type: Boolean,
      default: false
    },
    // 滚动前，派发的事件
    beforeScroll: { // hide mobile keyboard
      type: Boolean,
      default: false
    },
    // 默认刷新时间是20ms
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => { // maySure dom has render
      this._initScroll()
      // 20毫秒是怎么得到的？
      // 因为浏览器刷新间隔是17ms一次
    }, 20)
  },
  methods: {
    _initScroll() {
      // When it's no value
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        // scroll中的this默认指向scroll，所以要用一个变量指向vue实例的this
        const that = this
        // 监听scroll的滚动事件，并且拿到位置，也就是事件的回调
        // pos：整个滑动部分相对于初始位置的偏移，手指往上滑为负，往下滑为正，滑动到最底部，pos值为"负值绝对值"最大的时候
        this.scroll.on('scroll', pos => {
          that.$emit('scroll', pos)
        })
      }
      if (this.pullup) { // pullup: drop-down refresh
      // console.log('a')
      // scrollEnd:停止滚动了
      // scrollToEnd:滚动到底部了
        this.scroll.on('scrollEnd', () => {
          // parent scrollToEnd trigger when the screen is scrolling down 50px
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            //当满足这个条件的时候，表示当前已经滚动到底部了
            this.$emit('scrollToEnd') // scrollToEnd: scroll to bottom
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    // 重新计算高度
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // apply: Call a function with this value given And provide parameters as an array
      // apply: Pass parameters to scroll.scrollTo
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监听data改变
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
