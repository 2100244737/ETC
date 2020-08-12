// import Axios from 'axios'
// import _this from "../main";
// import{store} from "./vuex";
// import {
//     message
// } from './resetMessage';
// Axios.interceptors.request.use(
//     config => {
//         _this.NProgress.start()
//         // 该处可以将config打印出来看一下，该部分将发送给后端（server端）
//         if (!_this.$cookie.get('openId')) {
//             _this.$router.push('/login')
//             message.warning('openId不存在，请重新登录');
//         }
//         return config  // 对config处理完后返回，下一步将向后端发送请求
//     },
//     error => {  // 当发生错误时，执行该部分代码
//         return Promise.reject(error)
//     }
// )
// Axios.interceptors.response.use(function (response) {
//     // 处理响应数据
//     _this.NProgress.done()
//     return response.data
// }, function (error) {
//     _this.NProgress.done()
//     // 处理响应失败
//     if (error && error.response){
//         // 关闭loading
//         store.commit('set_loading', false);
//         switch (error.response.status) {
//
//             case 400:
//                 message.warning('错误请求....');
//                 break
//             case 401:
//                 message.warning('未授权，请重新登录(401)......');
//                 break;
//             case 403:
//                 message.warning('拒绝访问(403)......');
//                 break;
//             case 408:
//                 message.warning('请求超时(408)......');
//                 break;
//             case 404:
//                 message.warning('请求错误，未找到资源股......');
//                 break
//             case 500:
//                 message.warning('服务器出错......');
//                 break
//             case 502:
//                 message.warning('网络出错......');
//                 break
//             case 501:
//                 message.warning('服务未实现(501)......');
//                 break;
//             case 503:
//                 message.warning('服务不可用......');
//                 break
//             case 504:
//                 message.warning('网络超时......');
//                 break
//             case 505:
//                 message.warning('HTTP版本不受支持(505)......');
//                 break;
//             default:
//                 message.warning('连接出错......');
//         }
//     }else {
//         message.warning('网络出现问题, 请稍后再试......')
//     }
//     return Promise.reject(error)
// })
// export default Axios
