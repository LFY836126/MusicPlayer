<template>
  <!-- ![add song to list interface](https://i.loli.net/2019/04/10/5cada57184b01.png) -->
  <!-- 从底部划入过来的效果 -->
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      // 默认隐藏
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      // 过2秒自动关闭，避免产生多个timer，所以要清理
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './top-tip.scss';
</style>
