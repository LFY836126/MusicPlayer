
// 配置请求参数中的通用参数
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

// jsonp callback name
export const options = {
  param: 'jsonpCallback'
}

// when data success ("code": 0)
export const ERR_OK = 0
