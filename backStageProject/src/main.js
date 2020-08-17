// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//  引入 element ui 库
import ElementUI from 'element-ui';
//  引入 element css
import 'element-ui/lib/theme-chalk/index.css';
// 引入初始化样式
import 'normalize.css/normalize.css'
// 引入element自定义样式
import "./assets/css/element.css"
// 自定义样式
import"./assets/css/base.css";
// 页面自适应
import 'lib-flexible/flexible'
// iconFont
import './assets/iconfont/iconfont.css'
// 引入axios 接口
import axios from './uitls/axios';
// 设置cookie
import vueCookie from 'vue-cookie'
// 引入 vuex
import Vuex from 'vuex';
// import md5 from 'js-md5'
// 引入vuex
import {store} from './uitls/vuex';
// // 防抖
// import debounce from 'v-debounce-throttle'
// 获取时间
import {getTime} from "./assets/js/time";
// 复制功能
import VueClipboard from 'vue-clipboard2'
import JSONView from 'vue-json-viewer'

var http1 = '';
if (process.env.NODE_ENV === "development") {
    // 开发环境
    http1 = '/json/api/json'
}else {
    // 生产环境
    http1 = 'https://testweb.datasw.cn/api/json'
}
// 调用api接口
Vue.prototype.$api = axios;
Vue.prototype.$http1 = http1;
// Vue.prototype.$md5 = md5;
Vue.config.productionTip = false;

import Router from 'vue-router'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 表格自适应高度
import adaptive from './uitls/el-table'
Vue.use(adaptive)

Vue.prototype.changeData = function (content,filename,token){
  var params = {
    "bizContent": JSON.stringify(content),
    "encryptType":"NONE",
    "filename": filename,
    "sign":"NONE",
    "signType":"NONE",
    "timestamp": getTime(),
    "version":"2.0",
    "tokenType":"USER_AUTH",
    "accessToken": token
  }
  return params
}
// json 高亮
Vue.use(JSONView)
//  复制挂载全局
Vue.use(VueClipboard)
// 挂载全局
Vue.use(ElementUI);
//  cookie 挂载到全局
Vue.use(vueCookie);
// Vue.use(debounce)
// this.$cookie.set('test', 'Hello world!', 1);
// this.$cookie.get('test');
// this.$cookie.delete('test');

// 调用vuex
Vue.use(Vuex);
// 全局错误提示方法
Vue.prototype.alertDialogTip = (name, message) => {
  name.$alert(message, '温馨提示', {
    confirmButtonText: '确定',
  }).then(() => {
    return false;
  });
};
// 全局成功提示方法
Vue.prototype.alertMessageTip = (name, message) => {
    name.$message({
        message: message,
        type: 'success',
        offset: 150
    });
};
// Vue.directive('antiShake', {
//   // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
//   /**
//    * el 指令所绑定的元素，可以用来直接操作 DOM 。
//    * binding 一个对象，包含绑定的值
//    */
//
//   inserted: function(el, binding) {
//     const { callback, time } = binding.value
//     el.callback = callback
//     el.time = time
//     el.timeCall = null
//     el.addEventListener('click', () => {
//       clearTimeout(el.timeCall)
//       el.timeCall = setTimeout(() => {
//         el.callback()
//       }, el.time || 500)
//     })
//   },
//   // 所在组件的 VNode 更新时调用
//   update: function(el, binding) {
//     const { callback, time } = binding.value
//     el.callback = callback
//     el.time = time
//   },
// })

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.prototype.NProgress = NProgress
NProgress.inc(0.2);
NProgress.configure({
    minimum: 0.3
});
import {
    MessageBox
} from 'element-ui';
router.beforeEach((to, from, next) => {
    NProgress.start();

    if(to.path == '/login') {
        next()
    }else {
        if(vueCookie.get('openId') !=null) {
            next()
        }else {
            MessageBox.confirm('openId不能为空！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var url = 'https://testweb.datasw.cn/device/webLogin'
                window.location.replace(url)
            }).catch(() => {
                var url = 'https://testweb.datasw.cn/device/webLogin'
                window.location.replace(url)
                return false
            });

        }
    }
});

router.afterEach(transition => {
    NProgress.done();
});
/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  watch: {
    "$route": 'checkLogin'
  },
  methods: {
    // 检查是否登录
    checkLogin(to,from) {
    },
  }
})

