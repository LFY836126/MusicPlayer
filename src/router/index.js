import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
Vue.use(Router) 

export default new Router({
    routes:[
      {path: '/', redirect:'/recommend'},
      {path: '/recommend', component: Recommend},
      {
        path: '/singer', 
        component: Singer,
        children: [
          {
          // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
          path: ':id',
          component: SingerDetail,
          }
        ]
      },
      {path: '/rank', component: Rank},
      {path: '/search', component:Search},
  ]
})
