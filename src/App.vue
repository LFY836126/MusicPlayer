<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 我需要在player.vue中，取vuex中的变量来控制player组件的显示，不能默认显示-->
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/mHeader/mHeader'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components: {
      MHeader,
      Tab,
      Player,
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
