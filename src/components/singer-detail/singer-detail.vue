<template>
  <!-- ![singer detail interface](https://i.loli.net/2019/04/08/5caac3e8e7a0f.png) -->
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    <!-- <div class="singer-detail"></div> -->
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getMusic } from 'api/song'
import MusicList from 'components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer', 'playing', 'fullScreen',' playlist','sequenceList','mode','currentIndex','currentSong']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    // 获取每个歌手详细信息
    this._getDetail()
    
  },
  methods: {
    // 获取每个歌手详细信息
      _getDetail() {
        // 如果此时没有id，那么我们就让他回退回去
        if (!this.singer.id) {
          this.$router.push('/singer/')
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            // res.data.list：得到歌手的歌曲列表
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      // 将歌曲列表格式化，转化为我们需要的格式
    // _normalizeSongs(list) {
    //   const ret = []
    //   list.forEach(item => {
    // //     // [singer data](https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=0025NhlN2yWrP4&jsonpCallback=__jp1)
    //     const { musicData } = item
    //     if (musicData.songid && musicData.albummid) {
    //       ret.push(createSong(musicData))
    //     }
    //   })
    //   return ret
    // },
   _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          getMusic(musicData.songmid).then((res) => { // 这里需要先获取vkey
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              // console.log(songVkey);
              const newSong = createSong(musicData, songVkey) // 在这里把vkey和musicData传进去
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

<style lang="scss" rel="stylesheet/scss" scoped>
@import './singer-detail.scss';
</style>
