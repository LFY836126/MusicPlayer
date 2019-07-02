<template>
  <!-- ![search box interface](https://i.loli.net/2019/04/10/5cad4362e8bef.png) -->
  <div class="search-box">
    <!-- 输入框前面的搜索图标 -->
    <i class="icon-search"></i>
    <!-- v-model="query"
      -->
    <input ref="query" class="box" :placeholder="placeholder" v-model="query"/>
     <!-- v-show="query" @click="clear" -->
     <!-- 输入框后面的"×"图标，
     1. v-show="query"：当输入框有内容的时候才显示图标，
     2. @click="clear"：当点击时候，输入框清空
     -->
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'

export default {
  props: {
    // 默认搜索框中的内容是：搜索歌曲、歌手
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    // 获取来自输入搜索框中的内容，利用双线绑定v-model
    return {
      query: ''
    }
  },
  // 在created周期前，监听query的改变，并且将改变后的内容传递给父组件
  created() {
    // 这种写法和直接在下面写watch差不多
    this.$watch(
      'query',
      // debounce节流函数，在一定时间改变多次，以最后一次为准
      debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 200)
    )
    // 这种写法和直接在下面写watch差不多
    this.$watch('query', (newQuery) =>{
      this.$emit('query', newQuery);
    })
  },
  methods: {
    // 清空搜索框中的内容
    clear() {
      this.query = ''
    },
    // 设置搜索框中的内容为指定内容
    setQuery(query) {
      this.query = query
    },
    // 当在手机端开始滑动搜索列表时候，搜索框失去焦点，便于键盘收起，这个方法由父组件search调用
    blur() {
      this.$refs.query.blur()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './search-box.scss';
</style>
