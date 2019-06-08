import Vue from 'vue'
import Vuex from 'vuex'
// 我们每次通过mutations方式修改state的时候，它会在我的控制台去打一个logger，就是说这条修改记录是什么，可以看到state修改前后的值等
import createLogger from 'vuex/dist/logger'

import * as actions from './actions.js'
import * as getters from './getters.js'
import state from './state.js'
import mutations from './mutations.js'

Vue.use(Vuex)

// debug：调试工具，可以帮我们检查比如过state的修改是不是通过mutations修改的
const debug = process.env.NODE_ENV !== 'production' // development mode is on, strict mode check vuex data
// npm run dev    就是一个dev环境
// npm run build  就是一个production环境
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // 当debug为true的时候就开启这个严格模式，也就是我们开发的时候开启这个模式，当上线之后，这个模式就关闭
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
