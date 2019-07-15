import storage from 'good-storage'

const SEARCH_KEY = '__search__'
// 定义最大存储空间，如果超过了的话，就把最早存储的删掉
const SEARCH_MAX_LEN = 15
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

/**
 * data insert into array first index
 * @param arr: Stored array
 * @param val: Stored value
 * @param compare: func
 * @param maxLen: length
 */
function insertArray(arr, val, compare, maxLen) {
  // 将后搜索的值，填入到数组的前面，先搜索的值，填入到数组的后面
  const index = arr.findIndex(compare)
  if (index === 0) {
    // 如果当前搜索的值已经是数组的第一位了，就不改变
    return
  }
  if (index > 0) {
    // 如果当前搜索的值不是数组的第一位，就删掉数组中的该值，并且在第一位填入
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // 如果数组长度超过最大长度，将数组最后一个删掉
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 * SEARCH_KEY 搜索列表
 */

export function saveSearch(query) {
  // 如果根据key值能取到数据，就将数据赋给searches，如果没有数据，就将[]赋给searches
  const searches = storage.get(SEARCH_KEY, []) // gets cached data, history data, if no data return empty array
  insertArray(
    searches,
    query,
    // findIndex中传入的比较函数
    item => {
      return item === query
    },
    SEARCH_MAX_LEN
  )
  storage.set(SEARCH_KEY, searches) // store cached data
  return searches
}

export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 从本地拿到搜索列表
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

/**
 * PLAY_KEY 最近播放数组
 */

//  播放历史
export function savePlay(song) {
  // 如果有就取出来，没有就=[]
  const songs = storage.get(PLAY_KEY, [])
  insertArray(
    songs,
    song,
    item => {
      return song.id === item.id
    },
    PLAY_MAX_LEN
  )
  // 本地存一份，同时返回
  storage.set(PLAY_KEY, songs)
  return songs
}
// 外部从本地加载最近播放数组
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

/**
 * FAVORITE_KEY 收藏数组
 */

export function saveFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  insertArray(
    songs,
    song,
    item => {
      return song.id === item.id
    },
    FAVORITE_MAX_LEN
  )
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
