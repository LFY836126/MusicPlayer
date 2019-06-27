<template>
  <!-- ![music player interface](https://i.loli.net/2019/04/09/5cac16b7d5a91.png) -->

  <div
    class="progress-bar"
    ref="progressBar"
    @click="progressClick"
  >
  <!-- bar-inner：表示总长度 -->
    <div class="bar-inner">
      <!-- progress：表示走过的部分 -->
      <div class="progress" ref="progress"></div>
      <!-- progress-btn-wrapper：表示当前的位置 -->
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <!-- progress-btn：当前位置的那个按钮 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 添加样式前缀像什么webkit等
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    // 接受从父元素player传过来的值：进度条
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 不同touch函数需要共享数据的时候，用这个touch
    this.touch = {}
  },
  methods: {
    // 手指开始拖拽
    progressTouchStart(e) {
      // 表示touch已经初始化了
      this.touch.init = true
      // 记录touch的点击位置
      this.touch.startX = e.touches[0].pageX // this.touch.startX: finger x-axis distance
      // 记录当前进度条的的偏移距离
      this.touch.left = this.$refs.progress.clientWidth // The distance the progress bar has traveled, Yellow display
    },
    // 手指拖拽中
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      // 整个进度条的宽度
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // The distance that the progress can move = Progress bar length - Progress bar ball width
      // 手指移动的距离
      const detailX = e.touches[0].pageX - this.touch.startX // progressbar move distance = current finger x-axis distance - pre finger x-axis distance
      const offsetWidth = Math.min( // offsetWidth: yellow color, real progress width
        progressBarWidth,
        // 最初的位置加上手指移动的距离，不能比0小，不能比进度条整个宽度大
        Math.max(0, this.touch.left + detailX)
      )
      this._offset(offsetWidth)
    },
    // 手指拖拽完
    progressTouchEnd() {
      this.touch.init = false
      // 当拖拽完之后，进度条虽然同步了，但是已播放秒数还是没有改变，所以这个函数就是实现这个功能的
      this._triggerPercent()
    },
    // 将拖拽后的进度条的百分比传递给父组件
    _triggerPercent() {
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / progressBarWidth // The distance the progress bar has traveled / The distance that the progress can move
      // 拖拽完之后，计算进度条的百分比，进一步改变秒数
      this.$emit('percentChange', percent)
    },
    // 点击进度条
    progressClick(e) {
      // 进度条到左边屏幕边缘的距离
      const rect = this.$refs.progressBar.getBoundingClientRect() // getBoundingClientRect: **static/getBoundingClientRect.png**
      // e.pageX：当前点击位置 到屏幕左边的距离，但是这里计算的：还要再减去进度条到左边的距离
      const offsetWidth = e.pageX - rect.left // offsetWidth: real progress = stop position - rect
      this._offset(offsetWidth)
      // this._offset(e.offsetX) //出错
      // 计算当前进度条的百分比，并且传递给父组件
      this._triggerPercent()
    },
    // 设置偏移距离
    _offset(offsetWidth) { // The distance the progress bar has traveled, Yellow display
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent(newPercent) {
      // 拖动过程中，拖动的权重要大一点
      if (newPercent >= 0 && !this.touch.init) { // > !this.touch.init: progress bar drag process cancel
      // 求总的宽度
        const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 求走过的宽度
        const offsetWidth = progressBarWidth * newPercent
        // 设置样式
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './progress-bar.scss';
</style>
