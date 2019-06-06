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
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: { // Data is async, Data changes to recalculate the scroll
      type: Array,
      default: null
    },
    pullup: { // Pull down to refresh
      type: Boolean,
      default: false
    },
    beforeScroll: { // hide mobile keyboard
      type: Boolean,
      default: false
    },
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
        const that = this
        this.scroll.on('scroll', pos => {
          that.$emit('scroll', pos)
        })
      }
      if (this.pullup) { // pullup: drop-down refresh
        this.scroll.on('scrollEnd', () => {
          // parent scrollToEnd trigger when the screen is scrolling down 50px
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
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
