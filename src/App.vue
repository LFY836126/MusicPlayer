<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from 'components/mHeader/mHeader'
import Tab from 'components/Tab/Tab'
export default {
  name: 'App',
  components: {
      MHeader,
      Tab,
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
