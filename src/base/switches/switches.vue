<template>
  <!-- ![search list interface](https://i.loli.net/2019/04/10/5cada57184b01.png) -->
  <ul class="switches">
    <!-- 
       -->
      <!-- currentIndex:有两个值0,1，分别代表最近播放和搜索历史两部分，在父组件中控制currentIndex和switches-->
    <li
      class="switch-item"
      v-for="(item,index) in switches"
      :key="index"
      :class="{'active': currentIndex === index}"
      @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: null
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 点击给父组件派发事件
    switchItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './switches.scss';
</style>
