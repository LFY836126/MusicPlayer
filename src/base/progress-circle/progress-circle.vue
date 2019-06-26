<template>
  <div class="progress-circle">
    <!-- viewBox是视口的的大小 ，从0，0到100，100-->
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- inner circle -->
      <!-- 内层圆 -->
      <!-- r="50" cx="50" cy="50"：圆的圆心和半径 -->
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <!-- outer circle can be rotated. -->
      <!-- stroke-dasharray: Stroke distance -->
      <!-- stroke-dashoffset: Stroke offset -->
      <!-- 外层圆 -->
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
      <!-- :stroke-dasharray="dashArray"：默认进度全部高亮
      :stroke-dashoffset="dashOffset" ：我从圆圈尾开始往回偏移了多少，除了偏移的，剩下的就是高亮的部分
      -->
    </svg>
    <!-- i Tag insertion slot -->
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './progress-circle.scss';
</style>
