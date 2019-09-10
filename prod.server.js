let express = require('express')
let config = require('./config/index')
let axios = require('axios')
let port = process.env.PORT || config.build.port
let app = express()
let apiRoutes = express.Router()

apiRoutes.get('/getDiscList', (req, res) => {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // Send an HTTP request
  axios
    .get(url, {
      // The request to cheat qq
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      // params, (recommend.js/getDiscList) pass to url address
      // params: req.query：获取浏览器请求这个接口传进来的参数
      params: req.query
    })
    .then((response) => {
      // res: to font-end
      // response.data: qq response data
      // 将qq接口返回的response，返回我们定义接口的res(接口的返回数据)中,输入内容给浏览器端
      res.json(response.data)
    })
    .catch((e) => {
      console.log(e)
    })
})
// 获取vkey
apiRoutes.get('/music', function(req, res) {
  var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'  
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {

    res.json(response.data)

  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/lyric', (req, res) => {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios
    .get(url, {
      headers: {
        // The request to cheat qq
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then((response) => {
      // 将返回的数据做一个处理，因为返回的不是一个json，是一个jsonp的callback这样的东西，我们要转化为json形式
      let ret = response.data
      if (typeof ret === 'string') {
        // ^\w：一个到多个的有效字符
        // \(：将括号进行转义，这样这个就是单纯的匹配字符串中的括号
        // ({[^()]+})：我们要匹配的是两边是大括号{}中间是不为()的任意字符一个或多个
        let reg = /^\w+\(({[^()]+})\)$/
        let matches = ret.match(reg)
        if (matches) {
          // matches是一个数组：
            // [1]:表示我们捕获的整个字符
            // [2]:表示我们里面括号捕获的内容
            // 例如：str = dfaklsjkl({\"retcode\":0,\"code\":0,\"subcode\":0})"
            // 经历过上述过程返回match结果为
            // 0: "dfaklsjkl({"retcode":0,"code":0,"subcode":0})"
            // 1: "{"retcode":0,"code":0,"subcode":0}"
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    })
    .catch((e) => {
      console.log(e)
    })
})
apiRoutes.get('/getSongList', (req, res) => {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  // Send an HTTP request
  axios
    .get(url, {
      // The request to cheat qq
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      // params, (recommend.js/getDiscList) pass to url address
      // params: req.query：获取浏览器请求这个接口传进来的参数
      params: req.query
    })
    .then((response) => {
      // res: to font-end
      // response.data: qq response data
      // 将qq接口返回的response，返回我们定义接口的res(接口的返回数据)中
      res.json(response.data)
    })
    .catch((e) => {
      console.log(e)
    })
})
apiRoutes.get('/getHotKey', (req, res) => {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  // Send an HTTP request
  axios
    .get(url, {
      // The request to cheat qq
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      // params, (recommend.js/getDiscList) pass to url address
      // params: req.query：获取浏览器请求这个接口传进来的参数
      params: req.query
    })
    .then((response) => {
      // res: to font-end
      // response.data: qq response data
      // 将qq接口返回的response，返回我们定义接口的res(接口的返回数据)中
      res.json(response.data)
    })
    .catch((e) => {
      console.log(e)
    })
})
// 检索列表
apiRoutes.get('/searchList', function(req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'  
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {

    res.json(response.data)

  }).catch((e) => {
    console.log(e)
  })
})
// copy from build/webpack.dev.conf
// dist作为资源入口
app.use('/api', apiRoutes)
app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
