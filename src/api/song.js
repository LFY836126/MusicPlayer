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
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename:'C400' + mid +'.m4a',
    guid:1327051764,
    platform:'yqq',
    loginUin:0,
    hostUin: 0,
    needNewCode: 0,
    g_tk:5381,
    uin:1843,
    cid:205361747,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}