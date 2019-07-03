/*
 * @Description: define data
 * @version:
 * @Author: GanEhank
 * @LastEditors: GanEhank
 * @Date: 2018-06-18 08:12:39
 * @LastEditTime: 2019-04-08 18:33:50
 */

import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'
// import { loadSearch } from 'common/js/cache'

const state = {
  singer: {},
  // 播放状态，处于播放状态还是暂停状态
  playing: false,
  // 播放器的展开和收起
  fullScreen: false,
  // 因为可以实现切歌功能，所以一定有个播放列表
  playlist: [],
  // 所有歌曲播放列表，当切换到顺序播放模式的时候播放这个列表
  sequenceList: [], // when play mode random, playlist !== sequenceList
  // 播放模式的切换
  mode: playMode.sequence,
  // 当前播放的是哪首歌的索引，
  currentIndex: -1,
  disc: {}, // song single object
  topList: {}, // List interface jump interface: the list details interface.
  // searchHistory: [],搜索历史I
  searchHistory: loadSearch(), // loadSearch: Read from the local cache. search-list
  // 播放历史，从本地缓存中读取
  playHistory: loadPlay(), // loadPlay: Read the search history from the local cache.
  // favoriteList: loadFavorite() // collect list
}

export default state
