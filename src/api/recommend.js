import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios' // Promise based HTTP client for the browser and node.js

/**
 * Carousel data
 * @param {type}
 * @return: jsonp
 */
// 因为每次抓取数据都会有很多重复的参数，所以单独用一个文件(同目录config.js)存起来，更方便

// 获取轮播图数据
export function getRecommend() {
  // ![jsonp data](https://i.loli.net/2019/04/06/5ca8638bac881.png) open in chrome, copy url(copy '?' before)
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // Object.assign: object extend attributes, (copy the values of all enumerable own properties from one or more source objects to a target object)
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

/**
 * Popular song list recommendation data
 * @returns {Promise.<TResult>|*}
 */
// 获取全部歌单数据
export function getDiscList() {
  // request back-end address that sends HTTP request to qq music get data
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  // 这里就不是一个jsonp请求了，而是一个ajax请求了，因为我们在后端定义接口了
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    // picmid: 1,
    platform: 'yqq.json',
    hostUin: 0,
    sin: 0,
    ein: 19,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  // **webpack.dev.conf.js** invoked back-end interface
  return axios.get(url, {
      params: data
    }).then(res => {
      return Promise.resolve(res.data)
    })
}
// 抓取每个歌单的全部数据
export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  /* const url = 'https://c.y.qq.com/qzone/fcgi-bin/fcg_ucc_getcdinfo_byids_cp.fcg' */
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
