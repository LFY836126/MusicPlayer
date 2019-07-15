import { commonParams, options } from './config'
import axios from 'axios'

/**
 * hot search
 * @param {type}
 * @return:
 */
// export function getHotKey() {
//   const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
//   const data = Object.assign({}, commonParams, {
//     uin: 0,
//     needNewCode: 1,
//     platform: 'h5'
//   })
//   return jsonp(url, data, options)
// }

// 热门搜索内容
export function getHotKey() {
  const url = '/api/getHotKey'
  const data = Object.assign({}, commonParams, {
    _: 1561709216132,
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
/**
 * search page
 * @param query: Retrieve the value
 * @param page: Index page
 * @param zhida: Do you want a singer?？
 * @param perpage: The number of returns per page.
 */

// 根据输入框输入内容的检索结果 
export function search(query, page, zhida, perpage) {
  const url = '/api/searchList'
  const data = Object.assign({}, commonParams, {
    // 检索关键词
    w: query,
    // 检索第几页
    p: page,
    // n和perpage控制每次请求到的数据数
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    // 是否检索包含检索词的歌手
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
