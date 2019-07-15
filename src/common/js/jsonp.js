import originJsonp from 'jsonp'

/**
 * @param url: url address
 * @param data: pass to back-end parameter
 * @param option: jsonp support parameter
 * @returns {Promise}
 */
// data就是url请求参数，因为原始的jsonp是不支持传入data的，原始的库是需要拼好的url，才能调用这个库
export default function jsonp(url, data, option) {
  // 如果url中有问号，那么就用"?"连接地址和参数，如果没有问号，就用"&"方式连接地址和参数
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 将data变为url中请求参数的格式
export function param(data) {
  let url = ''
  for (const k in data) {
    const value = data[k] !== undefined ? data[k] : ''
    // decode():是解码
    // encode()是编码
    url += `&${k}=${encodeURIComponent(value)}` // encodeURIComponent(): encode string as URI component
  }
  return url ? url.substring(1) : '' // get rid of first '&'
}
