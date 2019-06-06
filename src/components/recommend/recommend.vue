<template>
  <div class="recommend.js">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>
    </div>
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul></ul>
    </div>
  </div>
</template>
<script>
import Slider from 'base/slider/slider'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  data(){
    return{
      recommends: [],
    }
  },
  components: {
    Slider,
  },
  created(){
    this._getRecommend()
  },
  methods:{
    _getRecommend(){
      getRecommend().then((res) => {
        if(res.code == ERR_OK){
          // 当jsonp获取数据成功后，用数组接收数据，然后用来渲染轮播图组件
          this.recommends = res.data.slider;
        }
      })
    },
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import './recommend.scss';
</style>