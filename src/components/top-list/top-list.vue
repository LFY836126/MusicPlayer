<template>
  <!-- ![rank detail interface](https://i.loli.net/2019/04/10/5cadb3ddb41c9.png) -->
  <transition name="slide">
    <music-list
      :rank="rank"
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
    >
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { getMusic } from 'api/song'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
// import { createSong } from 'common/js/song'
import { createSong } from 'common/js/song'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  computed: {
    ...mapGetters(['topList']),
    title() {
      return this.topList.topTitle
      // return 'a'
    },
    bgImage() {
      // 背景显示第一个歌曲的背景图
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      // console.log(this.topList);
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.songlist);
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
     _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {data} = item
        if (data.songid && data.albummid) {
          // console.log(item);
          getMusic(data.songmid).then((res) => { // 这里需要先获取vkey
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              // console.log(item.songid, item.songmid);
              const newSong = createSong(data, songVkey) // 在这里把vkey和musicData传进去
              // console.log(newSong);
              // console.log(this.currentSong, this.singer, this.playing, this.fullScreen, this.playlist, this.sequenceList, this.mode, this.currentIndex, this.currentSong);
              ret.push(newSong)
              // console.log(this.currentSong, this.singer, this.playing, this.fullScreen, this.playlist, this.sequenceList, this.mode, this.currentIndex, this.currentSong);
            }
          })
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import './top-list.scss';
</style>
