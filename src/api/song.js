import { commonParams } from './config'
import axios from 'axios' // ajax axios,request HTTPRequest

// 获取歌词
export function getLyric(mid) {
  const url = '/api/lyric' // browser accesse address, back-end proxy address
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 获取歌曲vkey
export function getMusic(mid) {
  const url = '/api/music'
  const data = {
    songmid: mid,
    ADTAG: 'myqq',
    from: 'myqq',
    channel: '10007100',
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    let str = res.data;
    let index = str.indexOf('src="http://aqqmusic');
    str = str.slice(index + 5);
    // console.log(str);
    let vkeyEndIndex = str.indexOf(' ');
    str = str.slice(0, vkeyEndIndex - 1);
    // console.log(str);
    return Promise.resolve(str)
  })
}