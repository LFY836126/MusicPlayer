<template>
  <!-- ![singer interface](https://i.loli.net/2019/04/08/5caac3c529537.png) -->
  <!-- :data="data": data is async, data change refresh scroll -->
  <scroll class="listview" ref="listview" :data="data"  @scroll="scroll" :listenScroll="listenScroll" :probeType='probeType'>
    <ul>
      <li class="list-group" ref="listGroup" v-for="(group, index) in data" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母列表 -->
    <!-- @touchmove.stop.prevent:可以阻止浏览器或者任何地方的滚动，阻止冒泡事件 -->
    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <!-- :data-index="index" ：获取到当前是哪个索引，方便指定左侧该跳转的位置-->
        <!-- :class="{'current': currentIndex === index}"： 当左侧滑动时实现右边高亮 -->
        <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li> 
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { getData } from 'common/js/dom'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
// 样式定义的高度，用于后续计算字母个高度，确定滑动距离用
const ANCHOR_HEIGHT = 18

const FIXED_TITLE_HEIGHT = 30

export default {
  components: {
    Scroll,
    loading
  },
  props: {
    data: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      // 记录左侧歌手列表实时滚动位置
      scrollY: -1, // real-time scroll position
      // 记录当左侧滑动时，右侧应该高亮显示的字母表
      currentIndex: 0, // which letters should be display
      diff: -1 // diff: current element celling to pre element floor gaps
    }
  },
  created() {
    // 这个touch放在这里，就是为了实现touchmove和touchstart可以同时获取并更改这个值
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  },
  computed: {
    shortcutList() { // ['A','B','C'...]
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
//     selectItem(item) {
//       this.$emit('select', item)
//     },
    // 手指点击触发事件
    onShortCutTouchStart(e) {
      // 单独封装一个类getData(src/common/js/dom.js)实现索引的获取
      const anchorIndex = getData(e.target, 'index') // getData(): get index
      // 跳转到左侧相应位置
      // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)

      // firstTouch：实现滑动，需要记录的变量，当前手指开始触碰屏幕的位置
      const firstTouch = e.touches[0] // e.touches[0]: click position
      this.touch.y1 = firstTouch.pageY
      // 将当前点击的索引记录下来
      this.touch.anchorIndex = anchorIndex
      // 将跳转单独封装成一个方法，因为不仅这里要用，下面的onShortCutTouchMove也要用
      this._scrollTo(anchorIndex)
    },
    // 手指滑动触发事件
    onShortCutTouchMove(e) {
      // 思路：从touchstart 到 touchmove滚动的位置，计算当前位置和一开始滚动位置的差值data，根据这个data确定滚动到哪
      // firstTouch：实现滑动，需要记录的变量，当前手指现在滑动到的屏幕的位置
      const firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      const delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0 // | 0: Math.floor：向下取整
      // 将手指最初点击的索引的位置，加上手指滑过了几个索引，这样就可以确定手指的当前索引位置
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta // stop position index
      this._scrollTo(anchorIndex)
    },
//     refresh() {
//       this.$refs.listview.refresh()
//     },

// 将私有方法放在下面，将公共方法放在上面
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 当有索引值之后，跳转到当前
    _scrollTo(index) {
      // 如果点击字母表上下多出来的部分(ul自带的)，但是没有的地方，直接返回
      // click on the blank
      if (!index && index !== 0) {
        return
      }
      // 如果手指滑动到字母表A往上，或者Z往下做一个判断
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]

      // scrollToElement第二个参数的含义就是我们要不要有一个动画时间，
      // scrollToElement虽然已经做了边界处理了，但是我们还是最好自己做一个边界处理
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // scrollToElement: element, animate time
    },
    // 计算左侧每个group的高度，方便实现右侧字母表高亮，
    _calculateHeight() {
      let height = 0
      const listGroup = this.$refs.listGroup
      this.listHeight = []
      this.listHeight.push(height)
      for (let i = 0; i < listGroup.length; i++) {
        // 获取到dom，并计算每个dom结点占据屏幕高度
        const item = listGroup[i]
        // clientHeight:当前item内容区高度
        height += item.clientHeight
        // console.log(height);
        this.listHeight.push(height)
        // listHeight:[0, 760, 1030, 1370......]
        // 也就是i字母对应的listHeight[i]是i的头位置，listHeight[i + 1]是i的尾位置
      }
    }
  },
  watch: {
    data() { // 20: browser 17ms dom render complete
    // 因为数据到渲染还是需要时间，所以设置延迟，是为了我们充分保证此时可以拿到高度
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff(newVal) {
      const fixedTop = newVal > 0 && newVal < FIXED_TITLE_HEIGHT ? newVal - FIXED_TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) { // when the title animation not trigger, fixedTop not change
        return
      }
      this.fixedTop = fixedTop
      // 上面三行就是为了减少dom操作的频度，只有当两个title碰见之后才让上一个title进行偏移，否则上一个title位置不改变
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    },
    scrollY(newY) {
      const listHeight = this.listHeight

      // 第一种情况：when scroll to the top, newY > 0
      if (newY > 0) { 
        this.currentIndex = 0
        return
      }
      // 将当前的偏移值和listHeight做个对比，比较上限和下限等，然后确定这个newY落到哪个区间
      // listHeight one more element than listGroup

      //第二种情况： when scroll to the middle section,
      for (let i = 0; i < listHeight.length - 1; i++) { 
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        // -newY: When scroll, newY is negative, add “-” ensure positive
        if (-newY >= height1 && -newY < height2) { 
          this.currentIndex = i
          // 滑动的时候，计算两个title之间的高度，因为newY是个负值，用下一个高度值减去偏移的值就是title之间的距离
          this.diff = newY + height2 // diff: trigger animate of the title
          // console.log(this.diff);
          return
        }
        this.currentIndex = 0
      }

      //第三种情况： when scroll to the bottom
      this.currentIndex = listHeight.length - 2 
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "./listview.scss";
</style>
