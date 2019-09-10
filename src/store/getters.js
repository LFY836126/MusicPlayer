

export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist.slice()
export const sequenceList = state => state.sequenceList.slice()
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex

// 充当计算属性，还是计算出currentSong，以便数据的拿取
export const currentSong = state => { // song forward backward
  return state.playlist[state.currentIndex] || {}
}
export const disc = state => state.disc
export const topList = state => state.topList
export const searchHistory = state => state.searchHistory
export const playHistory = state => state.playHistory
export const favoriteList = state => state.favoriteList
