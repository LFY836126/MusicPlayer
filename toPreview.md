## 目录
1. 所有目录
```
src:
    ├─api                   ->放置和后端请求相关的代码，包括ajax等
    ├─base
    │  ├─confirm
    │  ├─listview
    │  ├─loading
    │  ├─no-result
    │  ├─progress-bar
    │  ├─progress-circle
    │  ├─scroll
    │  ├─search-box
    │  ├─search-list
    │  ├─slider             ->轮播图组件
    │  ├─song-list
    │  ├─switches
    │  └─top-tip
    ├─common                ->放置静态资源，像图片，字体等
    │  ├─fonts
    │  ├─image
    │  ├─js
    │  ├─scss
    │  └─stylus
    ├─components            ->公共组件
    │  ├─add-song
    │  ├─disc
    │  ├─m-header           ->首页顶部
    │  ├─music-list
    │  ├─music-list.1
    │  ├─player
    │  ├─playlist
    │  ├─rank
    │  ├─recommend
    │  ├─search
    │  ├─singer
    │  ├─singer-detail
    │  ├─suggest
    │  ├─tab                ->导航栏(歌手，排行等)
    │  ├─top-list
    │  └─user-center
    ├─router                ->路由相关文件
    ├─store                 ->vuex相关代码
    ├─main.js               ->入口相关文件
    └─App.vue
index.html                  ->添加meta标签，移动端常见设置
package.json                ->添加了
                                ->"fastclick": "^1.0.6"：解决移动端点击300毫秒延迟
                                ->"babel-runtime": "^6.26.0",:对es语法进行转义
                                ->"babel-polyfill": "^6.26.0",对es6api进行转义，例如promise等
```

## 项目初始化
1. 解决300毫秒延迟的问题
    + src/main.js目录
    + import fastclick from 'fastclick'
    + fastclick.attach(document.body)
2. 写header
    + src/components/mHeader
    + src/App.vue中引入
    + 先import，然后在components上添加组件，然后使用组件<m-header></m-header>
3. 别名的配置
    + 在webpack.base.conf.js下配置
        ```
        resolve: {
            alias: {
                'common': resolve('src/common'), 
            }
        }
        function resolve (dir) {
          return path.join(__dirname, '..', dir)
        }
        ```
    + 此时common就代表了src/common
    + 同理，也可以多配制几个别名
        ```
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
              'vue$': 'vue/dist/vue.esm.js',
              'src': resolve('src'),
              'api': resolve('src/api'),
              'base': resolve('src/base'),
              'common': resolve('src/common'),
              'components': resolve('src/components'),
              'router': resolve('src/router'),
              'store': resolve('src/store')
            }
          },
        ```
4. 改变默认背景色
    + 背景色：src/common/stylus/variable.styl的background
    + 图标：src/components/mHeader
5. 引入路由：
    + src/router/index.js
    + 引入并注册
    ```
        import Router from 'vue-router'
        Vue.use(Router)
    ```
    + 在src/main.js添加路由，并注册到实例身上
        ```
        import router from './router'
        new Vue({
          router
        })
        ```
    + 然后添加router-view，对应渲染router那些组件，那么这些组件怎么切换的呢？->通过导航栏tab(src/components/tab)在App.vue文件中
    + 引入tab(mHeader也是这么引入的)
        ```
        里面有详细注释
        1. import Tab from 'components/tab/tab'
        2. components: {
            MHeader,
            Tab,
           }
        3. 在template中引入
            <m-header></m-header>
            <tab></tab>
        ```
6. 默认显示组件
    + router/index.js中routes下配置{path: '/', redirect:'/recommend'},
7. jsonp原理：利用动态创建一个script标签，因为script标签是没有同源策略限制的，然后把script的src指向我们请求支持的服务端地址，地址后面有个callback函数
8. jsonp使用：
    + 安装： npm i jsonp
    + 封装一个jsonp:src/common/js/jsonp.js（具体见代码注释）
    + 封装获取数据的jsonp的方法：src/api/recommend.js（具体见代码注释）
    + 调用方法获取数据：src/components/recommend.vue
        ```
        src/components/recommend.vue
        1. 引入：import { getRecommend} from 'api/recommend'
                 import { ERR_OK } from 'api/config'
        2. 创建方法
            methods:{
                _getRecommend(){
                  getRecommend().then((res) => {
                    不是直接使用数字，是为了语义化更好
                    if(res.code == ERR_OK){
                      console.log(res.data.slider);
                    }
                  })
                },
            }
        3. 在生命周期函数created时候执行
            created(){
                this._getRecommend()
            },
        ```
9. 轮播图组件
    + src下创建base目录，base下创建silder文件夹，然后创建silder.vue组件(具体见代码注释)
    + 在components/recommend.vue文件中引入插件
        ```
        1. 引入：import Slider from 'base/slider/slider'
        2. components: {
            Slider,
          },
        3. 在template中添加插件
            <div class="slider-wrapper">
                <slider>
                  <div v-for="">     
                  </div>
                </slider>
            </div>
        ```
    + 渲染轮播图组件
        ```
        1. jsonp获取数据成功后，用recommends接收数据
            data(){
                return{
                  recommends: [],
                }
              },
            if(res.code == ERR_OK){
              // 当jsonp获取数据成功后，用数组接收数据，然后用来渲染轮播图组件
              this.recommends = res.data.slider;
            } 
        2. 用得来的数据渲染轮播图组件
            <slider>
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl">
                </a>
              </div>
            </slider>
        ```
    + 编写轮播图js(见src/base/slider.vue,有详细注释)
    + 在slider.vue中使用better-scroll：
    ```
        官网：https://github.com/ustbhuangyi/better-scroll
             https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
        1. 引入：import BScroll from 'better-scroll'
        2. 定义相关方法
        3. 在生命周期函数mounted时候执行方法
    ```
    + 轮播图整体功能：
        ```
        1. 设置每个子元素宽度，保证样式正确，获取整个轮播图的图片总宽度
        2. 实现轮播图下面点dots的问题，怎么确定当前页，并且更改的点的样式
        3. 设置轮播图属性，例如：是否能循环播放，间隔等
        4. 自动播放方法autoPlay实现，
        ```
    + 出现问题：报错
        ```
        1. 单纯报错
            原因：见src/base/slider和src/components/recommend组件
            因为我获取数据执行周期是created,而且是异步的
            数据渲染的执行周期是mounted
            但是此时可能还没有 得到数据，所以会报错
        2. 轮播图滑动不连续，轮播图小点不在图片下面，在整个页面最底部
                better-scroll源码有更新，现在的使用方法，和原来的有差异
                小点父元素position没有定位，相对的元素是body，所以在页面最底部 
        3. 轮播图自动播放到最后一页就停了，
                新版api改变了，或者就继续用这种方法，或者用next，不过动画效果没有了
        4. 手机端，电脑端切换时候轮播图宽度出现错误
                监听 窗口改变 事件，当改变时候重新计算宽度
                但是没每次重新计算时候，_setSliderWidth中的width都会width += 2 * sliderWidth，这样是不对
                所以，我们在_setSliderWidth中传入一个参数，判断此时方法的执行是不是重新resize过来的，然后再重新渲染轮播图
                剩余详细见代码注释src/base/slider
        5. 在手机模式下，点击轮播图，不能进行页面跳转
            由于better-scroll穿了一个参数是click为true
            然后它在better-scroll内部实现的时候，会阻止浏览器默认的click
            然后自己开发一个click，然后，它开发的click恰好又被fastClick这个库监听到
            ，然后它又阻止了这个事件，导致click不能被执行，
            解决：就是删掉click:true，因为a链接本身就能实现跳转，所以不需要监听click
        ```
    + 优化：
        ```
        1. 当我们推荐页面切换到歌手页面，再切回来的时候，会出现闪烁的效果
            原因：我们每切换一次的话，都会重新发送一个数据请求，所有dom都会重新渲染，
            生命周期都会重新走一遍获取数据，然后重新初始化slider，体验不好，且没有必要
            解决：给App.vue中添加keep-alive,这样就可以将他们的dom都缓存到内存中
                    这样就不会多发送请求，其次也不会有闪的效果
                    <keep-alive>
                      <router-view></router-view>
                    </keep-alive>
        2. 当slider被切走的时候实际上会调用destroyed()，然后在这里把定时器等资源进行清理，有利于内存的释放
        ```
10. 歌单组件（src/components/recommend.vue包含歌单组件）
    + 数据的抓取
        ```
        见同目录8的详细方法
        1. 在src/api/recommend.js中封装获取歌单数据的jsonp的方法
        2. 在src/components/recommend.vue中调用歌单数据
        ```
    + 问题：
        ```
        获取数据失败，因为有一个host和referer的限制，前端之间不能修改request-header的，通过后端代理的方式处理
        那么后端代理怎么做呢？
        开发vue时会启动一个server，这个server就是nodejs气的devServer的逻辑
        那么需要我们手动代理这样的请求
        1. 在build/webpack.dev.conf.js下写服务器代理
            第一步
                // 接口代理绕过主机和引用程序
                // browser: XMLHttpRequst, node.js: http
                const axios = require('axios')
                var apiRoutes = express.Router()
                // 最后一步，将api注册使用
                app.use('/api', apiRoutes)
            第二步
                在devServer中配置接口，因为直接请求会出错，referer和host不一样，不让请求
                通过axios该改变headers之后带着浏览器发送过来的参数，重新发送请求
        2. src/api/recommend.js封装获取歌单数据的ajax的方法
        见webpack.dev.conf.js文件和src/api/recommend.js，有详细注释 
        课外：大公司是怎么防止我们抓取数据的呢？
            可以设置：获取数据时候带一个独有的签名，我才给你数据
        ```
    + 数据的渲染,见src/components/recommend.vue，其实和轮播图获取数据一样的
    + 优化：
        ```
        1. 想实现可滑动，但是总写很多次better-scroll很麻烦
            那我就将可滑动的部分封装成一个单独的组件，然后将所有可滑动的部分都放scroll组件中去
            better-scroll详细解释在src/base/slider.vue中有
        2. 什么时候重新refresh计算的
        （1）在src/components/recommend.vue组件中，为什么向scroll组件中传的是discList，而不是recommends？
            因为轮播图接口获取的数据优先于歌单获取的数据，就是当歌单获取的discList，
            再调用refresh的时候轮播图部分高度已经撑开了，也就是说scroll是可以正确计算到高度的
            若是我们延迟1s获取轮播图数据，那么就是discList先获取到，然后计算完scroll的高度之后，recommends才获取到数据
            那么造成的问题就是，我们的歌单下面有一部分滚动不了，因为它把轮播图的高度算在了scroll高度中
            那么歌单部分就有差不多轮播图高度的部分不能滑动
            那么说明，我refresh时机不对，不应该是watch到data改变之后refresh()
        （2）那么什么时候重新计算滚动区高度也就是refresh呢？
            在图片加载完，将上面的部分撑起来了，这个时候我才refresh，
            但是我不需要等到所有图片加载完，只要一个图片撑开就可以了，
            所以设置一个变量记录this.checkloaded
        ```
    + 图片懒加载:src/main.js和src/components/recommend.vue
        ```
        官网：https://github.com/hilongjw/vue-lazyload
        1. 安装：npm i vue-lazyload
        2. src/main.js中引入组件
        3. 注册
            Vue.use(VueLazyload, {
              loading: require('common/image/default.png')
            })
        4. 图片路径不用src，用v-lazy
        5. 最好看一下lazyload源码
        ```
    + 问题：src/components/recommend.vue
        ```
        better-scroll和fastclick冲突时候，可以利用class="needsclick"解决
        就是当fastclick监听到某个dom结点上的点击事件的时候，发现有class="needsclick"
        它就不会手动拦截这个过程，详细见recommend.vue
        ```
    + loadin组件，就是当歌单列表没有获取来之前，展示一个转圈的loading
        ```
        见src/base/loading和src/components/recommend.vue
        ```
11. 歌手组件
    + 封装获取数据的jsonp的方法：src/api/singer.js（具体见代码注释）
    + 获取数据：在src/components/singer.vue中,具体见此文件中的注释
        ```
            data() {
                return {
                    singers: []
                }
            },
            created() {
                this._getSingerList() // get singer data
            },
            methods:{
                _getSingerList() {
                    getSingerList().then(res => {
                        if (res.code === ERR_OK) {
                          console.log(res.data.list);
                        }
                    })
                },
            }
        ```
    + 数据处理：src/components/singer.vue
        ```
        1. 将数据分类：
            1. 热门数据，(前10条数据)
            2. 按字母分类的数据('A', 'B', 'C' ......)
        2. 因为获取数据过程中，有很多重复的操作或者数据，所以需要优化：
            单独封装一个歌手类，见src/common/singer.js
        3. 将数据格式化：将数据处理成我们需要的数据格式
        ```
    + 数据渲染：
        ```
        将歌手列表单独封装成一个组件src/base/listview.vue，代码有详细注释
        然后在src/components/singer.vue中引入组件
        ```

12. 快速入口组件，字母列表(src/base/listview.vue)
    + 根据title，得到字母集合
        ```
        computed: {
            shortcutList() { // ['A','B','C'...]
              return this.data.map(group => {
                return group.title.substr(0, 1)
            })
        },
        ```
    + 绑定事件，当触摸字母列表时候可以实现一些功能
        ```
        1. 点击某个字母，左侧可以直接定位到这个字母下的歌手名(详细见src/base/listview.vue)
            better-scroll本身有个api就是scrollToElement，可以滚动到某个元素 
            (1)先将每个字母绑定一个属性data-index，用来唯一标识字母
            (2)在给每个字母绑定方法，touchstart触发"onShortCutTouchStart"方法
            (3)"onShortCutTouchStart"先获取当前字母data-index
            (封装一个单独的类(src/common/js/dom.js)用来获取data-index)
            (4)scrollToElement跳到左侧这个索引指定位置
        2. 指尖滑动时候，左侧也跟着一起滑动
                通过计算pageY值
        3. 左侧滚动，右侧字母表有高亮的效果
            (1)先在src/base/scroll/scroll.vue中添加相应属性及方法
                // 要不要监听滚动事件
                props: {
                    listenScroll: {
                      type: Boolean,
                      default: false
                    },
                },
                methods: {
                    _initScroll() {
                        if (this.listenScroll) {
                            const that = this
                            // 监听scroll的滚动事件，并且拿到位置，也就是事件的回调
                            this.scroll.on('scroll', pos => {
                              that.$emit('scroll', pos)
                            })
                        }
                    }
                }
            (2) src/base/listview中的相应组件传递给子组件值，并且获取子组件传来的值
                <scroll @scroll="scroll" :listenScroll="listenScroll"></scroll>
                然后大致思路就是根据偏移值，计算当前在哪个字母下，然后让右侧该字母高亮
            详细将代码listview.vue
        ```
    + 出现问题：
        ```
        1. 手指滑动，左侧跟着动，但是滑动位置不对，索引相加的时候没有转化为整型，记得加上一个parseInt
        2. 写字母高亮功能的时候，左侧计算出来的索引位置不对，因为src/base/scroll/scroll.vue中设置probeType:1，改为3就好了
        3. 当歌手列表滚动到最顶部的时候将滚动逻辑进行优化，src/base/listview.vue
            分为三种情况
                (1) 当滚动到最顶部的时候
                (2) 当滚动到中间部分
                (3) 当滚动到最底部的时候 
        4. 直接点击右侧字母表，并不会高亮
            因为直接点击并不会触发滚动事件，所以不会派发一个pos事件，我们这里手动设置
            this.scrollY = -this.listHeight[index]，实现高亮
        5. 点击字母表上下两个区块的时候是有问题的，是可以点击的，但是我们不想让那部分可点击
            所以加上判断，如果点击部分为null那么不做任何事情，返回
            if (!index && index !== 0) { // click on the blank
                return
            }
        6. 当拖动时候，拖动到顶部，或者拖动到底部时候做一个边界处理
        ```
    + 整体思路：5-8的6:36部分重新捋了一下
    + 滚动固定标题实现src/base/listview.vue
        ```
         <div class="list-fixed" ref="fixed">
          <h2 class="fixed-title">{{fixedTitle}}</h2>
        </div>    
        list-fixed使用了绝对定位，所以会定到那里
        ```
    + 问题：
        ```
        1. 当我们滑动到最底部，又滑回到最顶部的时候，会出现两个热门的title，这样是不对的
            解决：当 当前滑动的scrollY为正数时，设置fixedTitle为''，
            然后上面的list-fixed结构，添加v-show，如果fixedTitle为空就不显示
        2. 当滑动时候，两个fixedTitle相遇后的效果不好
            是下面那个慢慢上去，然后一点一点覆盖的，这样的体验是不好的
            解决：通过计算两个title的差值diff，当差值大于0，什么都不变，当title小于0，就让上面的title偏移差值距离，就会实现下一个往上顶的效果
        3. 数据没有请求到的时候，有一个loading的效果
            (1)先引入import loading from 'base/loading/loading'
            (2)注册组件 components: {
                        loading
                    },
            (3)如果没有数据，就显示这个组件
                <div class="loading-container" v-show="!data.length">
                  <loading></loading>
                </div>
        ```
13. 歌手详情页面组件src/components/singer-detail,这个组件主要就是负责数据部分，然后传递给子组件，最后，调用子组件
    + 引入路由
        ```
        (1) 先在router/index.js中引入，并且添加路由
            import SingerDetail from 'components/singer-detail/singer-detail'
            {
                path: '/singer', 
                component: Singer,
                children: [
                  {
                  // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
                  path: ':id',
                  component: SingerDetail,
                  }
                (3)在src/base/listview.vue中添加事件,当某个歌手被点击了，向外派发一个事件，告诉外部我被点击了，并且被点击的元素是什么
            selectItem(item) {
              this.$emit('select', item)
            },
        (4)父组件src/components/singer.vue接受子组件传来的值，然后利用this.$router.push分，跳转到该歌手页面
        (5)在src/components/singer-detail上给路由加上动画效果
            <transition name="slide">
                <div class="singer-detail"></div>
            </transition>
        ```
    + 使用vuex管理状态,将歌手存进去
    + 抓取数据
        ```
        1. 利用jsonp抓取数据，见src/api/singer.js中getSingerDetail，有详细注释
        2. 在src/components/singer-detail中获取数据
            (1)先引入
                import { getSingerDetail } from 'api/singer'
                import { ERR_OK } from 'api/config'
            (2)定义好方法，然后再created生命周期时候执行

        ```
    + 封装歌曲数据
        ```
        因为有很多组件都需要整个歌曲的数据，所以将歌曲的数据封装成一个单独的src/api/song.js文件，用来获取歌曲的数据
        见src/common/js/song.js有详细注释
        1. 先创建一个歌曲类Song
        2. 每次都需要new，然后传进去很多参数，很麻烦，所以，再新建一个方法createSong,在这里返回一个new的实例对象
            实际上这也是一种工厂方法模式，就是不直接new，是调用一个方法，返回一个实例对象
        3. 在src/components/singer-detail中使用
        ```
14. vuex
    + 用state.管理状态，详情都见store文件夹，都有注释
    + 调用vuex存储数据
        ```
        1. 在main.js中引入import store from './store'
        2. 在main.js中注册
                new Vue({
                  store
                })
        3. 在src/components/singer中使用
            import {mapMutations} from 'vuex'
            methods:{
                  // 经过这个映射，在代码中就可以调用this.setSinger
                ...mapMutations({
                  setSinger: 'SET_SINGER'
                })
              }
        ```
15. 歌手详情页面src/components/music-list.vue
    + 引入并传入数据
        ```
            import MusicList from 'components/music-list/music-list'
            <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
             components: {
                MusicList
              },
        ```
    + 写dom结构，完善歌手详情页面
    + 将显示歌曲列表的部分封装成一个单独的组件src/base/song-list.vue，因为有很多地方都需要用
    + 还有一点就是，把这个歌曲列表放到scroll组件中，因为歌单列表也是需要滚动效果的
16. 显示歌曲列表的组件src/base/song-list.vue(会在music-list中使用)
    + 很简单，就是从父组件获得歌曲列表所有值，然后在组件中进行渲染
    + 出现问题
        ```
        1. src/components/music-list中歌曲列表显示位置不对，直接跑到了最顶部
            将上面图片的高度计算出来，然后让显示歌曲列表组件的top设置成图片高度
        ```
17. 歌曲列表：src/components/music-list(会在sing-detail中被使用)
    + 在滑动歌曲列表时，想要实现在手指往上滑的时候，歌曲列表是要适当覆盖最上面歌手图片的
        ```
        (1) 先将scroll组件样式中的overflow: hidden去掉
        (2) 只滚上去是不够的，要实现当手指往上滑的时候，字的后面背景部分(不是图片)也要一起向上滚
            在scroll组件上面放一个div，然后监听滚动距离，然后让这个div和字一起滚动
        ```
    + 但是，当向上滑了一段距离之后，就出现问题了
        ```
        因为bg-layer高度设置的是100%，也就是屏幕高度
        所以当手指滑动过屏幕高这么多距离之后，这个bg-layer就滑走了，就没有背景颜色显示了
        将最上方图片的高度记录下来，然后设置bg-layer最多滚动的距离不超过图片的高度
        ```
    + 但是我们要是实现这样的效果，就是不让歌曲列表滚动到顶部，顶部预留一些地方来
        ```
        那么只要调整背景的最多偏移量就可以了，就是设置最多偏移量小一点
        this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT， // bg-layer minTransalteY
        ```
    + 当向上滚动的时候，顶部的字覆盖在了图片的上面，我想要实现的效果是图片覆盖在字上面
        ```
        当滚动到顶部,还要再往上的时候，就设置图片的高度为RESERVED_HEIGHT,并且更改图片的zIndex值
        如果没滚动到顶部的时候，一切恢复原样(图片的高度)
        ```
    + 当往底下拉的时候，我想要实现图片跟随者放大或者缩小的效果
        ```
        当往底下拉的时候，通过percent = newY/this.imageHeight来设置图片放大的比例
        当new>0的时候，设置放大比例scale为scale = 1 + percent，并且zIndex为10，这样保证图片放大的时候，歌单列表不会覆盖图片
        为什么是这个比例呢？因为当往下拉的时候，以这个比例，图片增加的高度就是newY的大小
        ```
    + 为什么图片放大的时候总是从头部开始放大，因为bg-image设置了transform-origin为top，所以图片放大的时候总是从头部开始放大
    + 当我们手指往上滑的过程中，想要实现图片的模糊效果，并且，越往上，就越模糊
        ```
        设置一个属性blur，代表模糊的程度
        然后this.$refs.filter.style[backdrop] = `blur(${blur}px)`，通过css3来设置模糊效果
        ```
    + 因为不同浏览器前缀不一样，js中怎么自动加上呢？
        ```
        css中不用写浏览器前缀的原因是因为，vue-loader用到了autoprefixer插件，会帮我们自动补全前缀
        但是js中就不会了，就需要我们自己判断，那么我们可以封装一个方法来判断浏览器前缀是什么
        见src/common/js/dom.js文件
        ```
    + 随机播放全部按钮
        ```
        首先要等得到歌曲列表数据之后才显示
        其次，当我们手指向上滑动的过程中，因为按钮设置的位置是bottom为20，所以当图片高度改变了，按钮位置也改变了
            但是我们要的效果是，当手指滑动到最顶部的时候，整个按钮是消失的，所以
                // 设置随机播放全部的按钮，在滑动到最顶端时候消失
                this.$refs.playBtn.style.display = 'none'
                // 设置随机播放全部的按钮在正常情况下，display = ''，让它正常显示
                this.$refs.playBtn.style.display = ''
        ```
    + 在没有获取到数据的时候显示loading
        ```
        (1)引入import Loading from 'base/loading/loading'
        (2)注册组件
            components: {
                Loading
              },
        (3)在组件中应用
            <div v-show="!songs.length" class="loading-container">s
                <loading></loading>
            </div>
        ```
18. 播放器页面src/components/player/player.vue
    + 数据的存放：考虑多个组件都可以操作播放器，所以控制播放器的数据一定是个全局的，所以通过vuex来管理
        ```
        src/store/state.js              定义和组件相关的，最底层的数据
        src/store/getter.js             对数据的映射，可以是一个函数，函数类似计算属性，根据state.js中的值计算出新的值
        src/store/mutation-types.js     见代码，理清和mutations.js的关系
        src/store/mutations.js          定义数据修改的逻辑，但是定义mutations之前，先定义mutation-types
        ```
    + 显示播放器组件的流程：src/components/player/player（见代码）
        ```
        1. 在app.vue下引用src/components/player/player
            因为不是和路由相关的组件，切换到任何组件都不影响播放
        2. 在app.vue下不能默认展示player.vue这个组件，要在src/components/player/player中引入vuex，
            通过取vuex中的变量playlist,计算长度length，来控制player组件的显示，不能默认显示
        3. 因为点击歌曲，下回触发这个组件，所以src/base/song.list组件要添加部分事件逻辑
            当点击歌曲时候，触发事件selectItem，然后这个函数将触发的事件和当前歌曲索引传递给父组件src/music-list/music-list.vue
            问：为什么传递索引呢，因为播放歌曲列表的时候，要从当前歌曲开始播放，所以要获取索引
        4. 当点击歌曲列表的某首歌的时候要触发
            (1)设置playlist和sequencelist
            (2)根据点击的索引设置currentlist
            (3)设置playing，设置歌曲播放还是暂停的状态，因为点击的时候，歌曲要播放，
            (4)默认展开大的播放器，设置fullScreen
            注意：因为要改变很多state，所以封装一个action(见src/store/action.js)
        5. 因为要改变state，索引要使用action，所以要在src/components/music-list.vue中引入mapActions
        6. 总结流程：
            点击歌曲(src/base/song-list)
            提交action(src/components/music-list)
            提交mutation(src/store/action.js)修改state
            playlist.length > 0(src/components/player.vue)
            然后显示player.vue组件
        ```
    + 播放器交互动画(src/components/player.vue)
        ```
        给播放器添加样式
        1. 样式1(player.vue)：当切换展开的播放器或者缩小的播放器时有动画效果，样式详见player.scss
            (1)给展开的播放器添加transition样式为normal
            (2)给缩小版的播放器添加transition样式为mini
        2. 样式2 (player.vue)：当由缩小版的播放器切换为展开版的播放器时，左下的CD封面也会由小拉到大的 动画
            (1)我们要通过js方式获取css动画，所以引入了create-keyframe-animation插件
            因为设置动画需要获取参数，我们要定义的_getPosAndScale函数来获得相应参数
            在enter中设置动画
        3. 样式3(player.vue)：当由放大版的的播放器切换为缩的播放器时，CD封面从中间移到左下角的实现，不过没有样式2那种动画，是直接用js操作css样式实现的
            因为设置动画需要获取参数，我们要定义的_getPosAndScale函数来获得相应参数
            在leave中设置动画
        4. 样式4(player.scss)：当别的页面切换为大的播放器页面的时候动画效果
            效果1：背景有一个渐隐渐现的效果,纯利用transition和css3一起实现的
            效果2：头部和底部又一个回弹的效果，这个效果是利用贝塞尔曲线cubic-bezier实现的
        5. 点击播放后 大的，小的播放器实现CD封面旋转的样式
            样式已经写好了.play,.pause.pause，在src/components/player/player.scss
            <img class="image" :src="currentSong.image" :class="cdcls"/>
             cdCls() {
              return this.playing ? 'play' : 'play pause'
             },
        ```
    +　给样式填充数据
        ```
        填充数据
            1. 唱片图片:src="currentSong.image"
            2. 歌曲名： v-html="currentSong.name"
            3. 歌曲名称： v-html="currentSong.singer"
        添加方法
            1. 点击右上角的按钮实现返回：添加back方法，back方法中用Vuex的mutations设置fullScreen为false
            2. 点击小型播放器后显示大的播放器：在小型播放器样式上绑定@click="open",open方法中设置fullScreen为true
        ```
    + 播放功能：利用html5的audio实现
        ```
        1. 添加audio标签，当currentSong改变时候play方法执行，但是遇到了问题，见下面问题的1,有具体解决方法
        2. 设置歌曲播放和暂停：
            (1)在class名为i-center的dom元素上绑定方法togglePlaying，切换暂停或者播放状态
            (2)togglePlaying() { 
                this.setPlayingState(!this.playing)
                //setPlayingState: 获取更改state中playing的mutations方法
                //playing:这个playing就是通过getters从vuex state获取的playing
                }
            (3)仅通过改变状态是不能控制歌曲的播放或者暂停的
              我们可以watch这个playing，然后触发audio的play或者pause方法
              但是因为我点击歌曲的时候，就会触发watch的playing属性
              然后就会执行play，所以还是会出现问题1，解决方法也是一样
            (4)播放或着暂停的圆圈圈样式改变
                1. 添加计算属性
                     playIcon() {
                        return this.playing ? 'icon-pause' : 'icon-play'
                     },
                2. 添加样式<i :class="playIcon" @click="togglePlaying"></i>
            (5)小的播放器图标的改变miniIcon 同理 大播放器
                注意：当点击小的播放器播放按钮的时候，会产生冒泡事件，需要阻止冒泡事件
                    <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
            (6)播放时候CD封面转圈，停止的时候CD封面停止
                1. 给大的播放器CD绑定样式(小的同理)
                    <div class="cd" :class="cdCls">
                        <img class="image" :src="currentSong.image"/>
                    </div>
                2. 设置样式
                    cdCls() {
                      return this.playing ? 'play' : 'play pause'
                    },
        3. 点击播放下一首或者上一首歌曲
            因为我们在state中记录了当前歌曲的索引，并且我们也有当前歌曲列表
            所以向上或者向下只要改变索引就可以了
            (1)给播放下一首歌曲按钮绑定事件(播放上一首歌曲按钮同理)
                <div class="icon i-right">
                  <i @click="next" class="icon-next"></i>
                </div>
            (2)事件逻辑
                next() {
                    let index = this.currentIndex + 1
                    // 如果当前歌曲是最后一首歌
                    if (index === this.playlist.length) {
                      index = 0
                    }
                    this.setCurrentIndex(index)
                  this.songReady = false
                },
        ```
    + 大的播放器底部进度条src/base/progress-bar/progress-bar.vue：
        ```
        1.获取当前播放时间和总时间
            (1)设置标签实现进度条<div class="progress-wrapper">
            (2)因为当audio标签中歌曲播放的时候会派发一个事件就是@timeupdate="updateTime"
            (3)updateTime(e) {
              // update会传进来一个e的事件，这个事件有一个target属性就是audio标签
              // 这个audio还有一个可以获取到当前播放时间的属性就是currenTime,
              // 这个currentTime是一个时间戳的形式,是可读写属性
              this.currentTime = e.target.currentTime // <audio> current time
            },
            (4)编写一个函数format，将currentTime格式化为分和秒的形式
        2. 设置单独的组件显示进度条,接受父组件src/components/player/player.vue传过来的百分比的值
            (1)根据百分比，求走过的距离，然后设置样式
            (2)根据百分比，用transform设置小球的偏移
        3. 拖拽或者点击，小球实现歌曲的实时播放
        ```
    + 小的播放器转圈圈的播放按钮src/base/progress-circle/progress-circle.vue：
        ```
        引入：import ProgressCircle from 'base/progress-circle/progress-circle'
        注册：
            components: {
                ProgressCircle,
            },
        dom中使用
              <progress-circle :radius="radius" :percent="percent">
                <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
              </progress-circle>
            这个i标签会在progress-circle组件中的slot标签中生效
        progress-circle里面放置了两个circle，一个是默认全部高亮，一个是设置偏移量，剩下部分高亮
        ```
    + 播放模式
        ```
        
        ```
    + 遇到问题
        ```
        1. 当设置<audio ref="audio" :src="currentSong.url"></audio>
            并且：
            watch: {
                currentSong(newSong, oldSong) { 
                    this.$refs.audio.play()//只写这一句是会报错的
                }
            }
            报错：The play() request was interrupted by a new request
            原因：dom异常，这时候调用play时候，我们同时请求src是不可以的，这个dom还没有ready
            解决：我们设置一个延迟
                // 设置一个延迟
                this.$nextTick(() => {
                  this.$refs.audio.play()//只写这一句是会报错的
                })
        2. 获取播放源错误
            解决：https://blog.csdn.net/a151913232/article/details/85034283
        3. 点击按钮(播放上一首)后，发现歌曲虽然跳到了下一首，但是图标并没有，图标还是处于暂停状态
        解决：在next方法下添加如下语句
            if (!this.playing) {
              this.togglePlaying()
            }
        4. 不停点击下一首那个按钮，会报问题1的错误(pre同理)
            解决：查看audio官方文档，发现audio标签会派发两个事件，一个是canplay 和 error
            (1)<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error">
            (2)所以根据这个，我们data中设置一个标志位，
                data() {
                    return {
                      songReady: false,
                      }
                  }
            (3)然后
                ready() {
                  this.songReady = true
                  this.savePlayHistory(this.currentSong)
                },
            (4)然后next
                next(){
                    if (!this.songReady) {
                        return
                    }
                    // 点击之后this.songReady = false,确保下一首歌曲准备好时 才可以点击
                    this.songReady = false
                }
            (5)容错处理:当前歌曲播放不出来的话也可以实现点击下一首的功能
                事件：
                error(){
                    this.songReady = true
                }
                样式也要体现：当 当前歌曲出错的时候，图标有一个变灰的样式
                <div class="icon i-left" :class="disableCls">
                  <i @click="pre" class="icon-prev" ></i>
                </div>
        5. 进度条的小球拖拽过程中，进度条会出现跳的情况
            原因：当拖拽过程中，有两个事件改变进度条，
                一个是拖拽事件，一个是歌曲播放事件
                所以我们要设当拖拽过程中，拖拽事件权重更大一点
            解决：if (newPercent >= 0 && !this.touch.init)
                当没有拖拽事件的时候，才设置歌曲播放改变进度条
        6. 当拖拽完之后，进度条虽然同步了，但是已播放秒数还是没有改变
            拖拽完之后，重新计算进度条的百分比，然后改变audio的currentTime,然后进一步改变秒数 
            progressTouchEnd() {
              this._triggerPercent()
            },
            _triggerPercent() {
              const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
              const percent = this.$refs.progress.clientWidth / progressBarWidth 
              this.$emit('percentChange', percent)
            },
        ```
    
