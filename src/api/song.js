import { commonParams } from './config'
import axios from 'axios' // ajax axios,request HTTPRequest

/**
 * get Lyric
 * @param {Number} mid
 * @return: Lyric
 */
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

export function getMusic(mid) {
  const url = '/api/music'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename:'C400' + mid +'.m4a',
    guid:6442406400,
    platform:'yqq',
    loginUin:0,
    hostUin: 0,
    needNewCode: 0,
    g_tk:5381,
    uin:0,
    cid:205361747,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}