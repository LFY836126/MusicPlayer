import { getLyric } from 'api/song' // lyric parse
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64' // base64 解码
import axios from 'axios'
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  // 把这个getLyric封装成一个promise对象
  getLyric() { // api/song/getLyric()
    // 如果歌词存在就不用再次发送请求 
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      // 这个需要传this.mid的是获取数据的函数
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(console.log('no lyric'))
        }
      })
    })
  }
}
// 获取歌曲的歌手，播放源等数据
export function createSong(musicData, songVkey) { // factory method
  return new Song({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      album: musicData.albumname,
      duration: musicData.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
      // url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=5789882360&vkey=${songVkey}&uin=1843&fromtag=66`
      url: songVkey,
    })

}

// 获取歌曲的歌手，播放源等数据
export function createSongOne(item, songVkey) { // factory method
  return new Song({
      id: item.songid,
      mid: item.songmid,
      singer: filterSinger(item.singer),
      name: item.songname,
      album: item.albumname,
      duration: item.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`,
      // url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${item.songmid}.m4a?guid=5789882360&vkey=${songVkey}&uin=1843&fromtag=66`
      url: songVkey,
    })

}
// 因为一个歌曲可能有很多人唱，所以存储方式是数组形式，但是我们要将它转化为字符串形式显示
function filterSinger(singer) { // some item have two singer
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}