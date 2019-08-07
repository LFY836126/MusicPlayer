/**
 * @param {Number} min
 * @param {Number} max
 * @return: [min, max]
 */
// 取得min和max之间的一个数
function getRandomInt(min, max) {
  /*
  [moz](https://developer. mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
  Math.random() return [0,1)
  return [x,y)
  Math.random()*(y-x)+x;
  */
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * may Array out-of-order
 * @param {Array} arr
 * @return: out-of-order Array
 */
//shuffle： 数组打乱函数
export function shuffle(arr) {
  // 得到一个新数组，为了不改变arr
  const _arr = arr.slice() // create copy prevent multiple call
  for (let i = 0; i < _arr.length; i++) {
    // 取得0-i之间的一个数，保护0 和 i
    const j = getRandomInt(0, i)
    const t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/**
 * throttling function
 * @param {function} func
 * @param {Number} delay
 * @return:
 */

// 函数防抖
export function debounce(func, delay) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
