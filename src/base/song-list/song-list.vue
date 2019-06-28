<template>
  <!-- ![singer detail interface](https://i.loli.net/2019/04/08/5caac3e8e7a0f.png) -->
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" @click="selectItem(song, index)" :key="index">
      <!-- 设置排行榜的排行样式 -->
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: null
    },
    // 默认rank为false，代表默认没有排行的样式
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    // 和排行榜有关的样式
    getRankCls(index) {
      // 前三名，是图片的样式
      if (index <= 2) {
        // 在scss文件中有对应的样式
        return `icon icon${index}`
      } else {
        // 否则就是文字样式，文字的实现在getRankText(index)中
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import './song-list.scss';
</style>
