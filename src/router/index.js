// // 将所有路由组件改为异步加载
// import Vue from 'vue'
// import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'
// Vue.use(Router) 

// export default new Router({
//     routes:[
//       {path: '/', redirect:'/recommend'},
//       {
//         path: '/recommend', 
//         component: Recommend,
//         children: [
//           {
//             path: ':id', 
//             component: Disc,
//           }
//         ]
//       },
//       {
//         path: '/singer', 
//         component: Singer,
//         children: [
//           {
//           // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
//           path: ':id',
//           component: SingerDetail,
//           }
//         ]
//       },
//       {
//         path: '/rank', 
//         component: Rank,
//         children: [
//           {
//           // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
//           path: ':id',
//           component: TopList,
//           }
//         ]
//       },
//       {
//         path: '/search', 
//         component:Search,
//         children: [
//           {
//           // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
//           path: ':id',
//           component: SingerDetail,
//           }
//         ]
//       },
//       {
//         path:'/user',
//         component: UserCenter
//       }
//   ]
// })
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = resolve => {
  import('components/recommend/recommend').then(module => {
    resolve(module)
  })
}
const Singer = resolve => {
  import('components/singer/singer').then(module => {
    resolve(module)
  })
}
const Rank = resolve => {
  import('components/rank/rank').then(module => {
    resolve(module)
  })
}
const Search = resolve => {
  import('components/search/search').then(module => {
    resolve(module)
  })
}
const SingerDetail = resolve => {
  import('components/singer-detail/singer-detail').then(module => {
    resolve(module)
  })
}
const Disc = resolve => {
  import('components/disc/disc').then(module => {
    resolve(module)
  })
}
const TopList = resolve => {
  import('components/top-list/top-list').then(module => {
    resolve(module)
  })
}
const UserCenter = resolve => {
  import('components/user-center/user-center').then(module => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    // default route path
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [ // Secondary routing config
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
