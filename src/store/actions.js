

import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
// import { saveSearch,deleteSearchHistory } from 'common/js/cache.js'
import {
  saveSearch,
  clearSearch,
  deleteSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'

// /**
//  * this song in the list index
//  * @return: randomlist song index
//  */
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}


// 当点击歌曲的时候，改变state中的几个属性，实现播放歌曲
// 参数:两个对象：
    // 第一个对象：一个commit方法和state中的属性
    // 第二个对象：调用selectPlay中传入的参数，为了改变state中的部分属性值
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  // commit(types.SET_PLAYLIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index]) // return song(list[index]) at randomList index
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// /**
//  * random play, no index
//  * @param {type}
//  * @return:
//  */
export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random) // change playback mode become random mode
  commit(types.SET_SEQUENCE_LIST, list) // submit mutation, change the list of song sequences
  // 将list打乱
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList) // change the playlist son
  // 从randomList的第一个开始播放就可以了
  commit(types.SET_CURRENT_INDEX, 0) // click on the current song index
  commit(types.SET_FULL_SCREEN, true) // change to full screen mode
  commit(types.SET_PLAYING_STATE, true) // change the current state of play
}

// /**
//  * Click on the search list song 1, Add to current playlist
//  * @param {type}
//  * @return:
//  */
export const insertSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice() // state can't modify unless mutation, copy not modify
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex // song 2(current song) index
  // 记录当前歌曲
  const currentSong = playlist[currentIndex] // song 2 position
  // 查找当前列表中是否有song这首歌曲，并返回索引
  const fpIndex = findIndex(playlist, song) // song 1(click search list song) index
  // 插入歌曲在当前索引的下一个，索引应该+1
  currentIndex++ // song 1 position
  // 索引位置插入song
  playlist.splice(currentIndex, 0, song) // song 1 insert song 2 next position
  if (fpIndex > -1) { // current playlist has song 1 ?
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1) // delete current playlist song 1
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
    // 解释是上面一段代码：
    // let a = [1, 2, 3, 4];
    // 此时我要插入一个2，那么a = [1, 2, 3, 4, 2]
    // 所以此时我要删除一个2，也就是前面的，因为后面的2是新添加的
    // 那么，就是这条语句：playlist.splice(fpIndex, 1)，并且currentIndex--
    // 此时的a = [1, 3, 4, 2]
    // 如果此时我在1和3之间添加2的话，我就需要将最后一个2删掉，又因为此时的数组长度已经变长了，所以应该是fpIndex+1的位置
  }
  // song 2 at sequenceList index + 1

  // 找到sequenceList当前应该插入的位置，整体逻辑和playList一样的
  const currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 是否含有该插入的这首歌
  const fsIndex = findIndex(sequenceList, song)
  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    // 如果现在插入的比之前插入的靠后
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      // 如果现在插入的比之前插入的靠前
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击歌曲，将歌曲添加到搜索历史中
// // Save to localStorage, saveSearch(call cache.js)
export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除搜索历史中的一条
// // Remove the search term from localStorage, deleteSearch(call cache.js)
export const deleteSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 清空搜索历史
// // clearSearch: cache.js Clean cache, clearSearch(call cache.js)
export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 从歌曲列表中删除数据
export const deleteSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  // currentIndex === playlist.length:删除的是最后一首歌，此时的currentIndex 是 = pindex的
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (state.playing == false || !playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 删除歌曲列表中的所有歌曲
export const deleteSongList = function({ commit }) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

// 最近播放
export const savePlayHistory = function({ commit }, song) {
  // 调用cache中的方法，将数组在本地缓存一份
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
