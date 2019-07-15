<template>
  <!-- ![min player list interface](https://i.loli.net/2019/04/10/5cad9ce9ebab7.png) -->
  <transition name="list-fade">
    <!-- 
       -->
      <!-- .playlist:这个组件全屏样式，蒙层效果 -->
    <div
      class="playlist"
      v-show="showFlag"
      @click="hide"
    >
     <!-- list-wrapper:对应就是下半部分黑色背景部分也就是弹出的内容层 -->
      <div class="list-wrapper" @click.stop>
        <!-- list-header：弹出部分的header部分：随机播放字体，和按钮样式 -->
        <div class="list-header">
          <h1 class="title">
             <!-- :class="iconMode" @click="changeMode" -->
             <!-- iconMode和changeMode在mixin中实现 -->
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <!-- {{modeText}} -->
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <!-- list-content：中间歌曲列表 -->
        <scroll class="list-content" ref="listContent" :data="sequenceList" :refreshDelay="refreshDelay">
          <!-- :refreshDelay="refreshDelay"：当scroll监听到数据改变后120ms刷新数据 -->
          <transition-group ref="list" name="list" tag="ul">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item,index)"
              ref="listItem"
            >
             <!-- .current：当前歌曲样式 -->
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <!-- 调用mixin中的方法，完成收藏的功能 -->
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!-- list-operate:弹出层底部:添加歌曲按钮，会跳转到另一个页面 -->
        <div class="list-operate">
           <!-- @click="addSong" -->
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text" @click="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
       <confirm
        ref="confirm"
        text="是否清空播放列表"
        confirmBtnText="清空"
        @confirm="confirmClear"
      >
      
      </confirm>
      <!-- 添加到歌曲列表 -->
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
// 在mixin中引入了mapActions ,mapGetters,
import { mapMutations, mapActions } from 'vuex'
// 因为mixin中需要playMode，在这里不引入会出错
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
// 提示框
import Confirm from 'base/confirm/confirm'
// 添加歌曲到歌曲列表
import AddSong from 'components/add-song/add-song'

export default {
  components: {
    Scroll,
    AddSong,
    Confirm
  },
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      // 当scroll监听到数据改变后120ms刷新数据
      refreshDelay: 120
    }
  },
  computed: {
    // ...mapGetters(['sequenceList', 'currentSong','mode', 'playlist']),
    // 在弹出框的head部分，显示不同播放模式
    modeText() {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.random
          ? '随机播放'
          : '单曲循环'
    }
  },
  methods: {
    // , ''
    ...mapActions(['deleteSong', 'deleteSongList']),
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    // 由父组件调用，控制playlist的显示与隐藏
    show() {
      this.showFlag = true
      // 当点击按钮显示组件的时候，要延迟20秒之后刷新一下scroll，因为这样才能正确的到数据的高度，才能确保滚动
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
  // 判断歌曲列表中是否有正在播放的歌曲，如果有，设置特殊样式
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    // 点击歌曲列表中的某首歌曲
    selectItem(item, index) {
      // console.log(this.playlist);
      // console.log(this.sequenceList);
      // 当前遍历的是sequenceList，然而如果是随机模式的话，playList中是被打乱的数组,
      // 那么只能通过找到索引，因为歌曲的播放是依赖于数组和索引的，然后通过playList[index]找到歌曲
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id
        })
      }
      // 设置state中当前播放歌曲的改变
      this.setCurrentIndex(index)
      // 点击完歌曲，同时设置歌曲状态为true
      this.setPlayingState(true)
    },
    // 滚动的时候，都一直定位到当前播放歌曲的位置
    scrollToCurrent(current) {
      // 找到当前播放歌曲对应在sequenceList中的位置
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id
      }) 
      // 跳到指定位置
      // this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index])
    },
    // 删除歌曲列表中的某一项
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    // 添加歌曲到列表
    addSong() {
      this.$refs.addSong.show()
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 组件不显示或者歌曲没变
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      // setTimeout(() => {
        this.scrollToCurrent(newSong)
      // }, 20)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './playlist.scss';
</style>
