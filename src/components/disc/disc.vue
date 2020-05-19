<template>
  <!-- ![hot song list interface](https://i.loli.net/2019/04/10/5cadb0eae5f9e.png) -->
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
    >
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongList } from 'api/recommend'
import { getMusic } from 'api/song'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSongOne } from 'common/js/song'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList()
  },
  computed: {
    ...mapGetters(['disc']),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  methods: {
    _getSongList() {
      // console.log(this.disc)
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      // 因为getSongList返回的是一个promise对象，所以可以用then
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.cdlist[0].songlist);
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      })
    },
     _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {songid, albummid} = item
        if (songid && albummid) {
      // console.log(songid);
          getMusic(item.songmid).then((res) => { // 这里需要先获取vkey
            if(res.includes('vkey')){
    //         if (res.code === ERR_OK) {
    //           const svkey = res.data.items
    //           const songVkey = svkey[0].vkey
              // console.log(item.songid, item.songmid);
    //           const newSong = createSongOne(item, songVkey) // 在这里把vkey和musicData传进去
              const newSong = createSongOne(item, res) // 在这里把vkey和musicData传进去
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
@import './disc.scss';
</style>
