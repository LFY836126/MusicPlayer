'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express = require('express')
const app = express()

// 接口代理绕过主机和引用程序
// browser: XMLHttpRequst, node.js: http
const axios = require('axios')
var apiRoutes = express.Router()

// 最后一步，将api注册使用
app.use('/api', apiRoutes)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)


const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before (app) {
      // 下面这段主要作用就是从真实的qq服务器地址通过axios去发送一个http请求，同时修改headers
      // 把referer和host都修改成qq相关的referer和host，然后把浏览器发送的参数都原封不动的透传给qq服务端，
      // qq服务端收到请求之后就会正确的返回给我们响应，然后我们把相应的内容输出到浏览器端
      app.get('/api/getDiscList', (req, res) => {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        // Send an HTTP request
        axios.get(url, {
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
      app.get('/api/music', function(req, res) {
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
      app.get('/api/lyric', (req, res) => {
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
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
      app.get('/api/getSongList', (req, res) => {
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
      app.get('/api/getHotKey', (req, res) => {
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
      app.get('/api/searchList', function(req, res) {
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
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
