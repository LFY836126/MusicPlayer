import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'

// 这里的common就代表了src目录下的common，因为在webpack.base.conf.js中配置了如下选项
//   resolve: {
//     alias: {'common': resolve('src/common')}//resolve是一个函数，也在webpack.base.conf.js中定义了
//   }
import 'common/stylus/index.styl'

// 让整个body区域都生效，解决300毫秒延迟的问题
fastclick.attach(document.body)
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
