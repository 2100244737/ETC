//引入vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
import {MessageBox} from "element-ui";
//引入之后，对vuex进行引用
import Cookies from 'vue-cookie'
Vue.use(Vuex);
//创建且声明一个对象
export const store = new Vuex.Store({
    state: {
        options: [], // 缓存页面路由集合(页签集合)
        activeIndex: '', // tab当前页面
        loading: true, // loading 等待
        tableHeight:'300',
        sidebar: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false,
        province: {
            "11": "北京",
            "12": "天津",
            "13": "河北",
            "14": "山西",
            "15": "内蒙古",
            "21": "辽宁",
            "22": "吉林",
            "23": "黑龙江",
            "31": "上海",
            "32": "江苏",
            "33": "浙江",
            "34": "安徽",
            "35": "福建",
            "36": "江西",
            "37": "山东",
            "41": "河南",
            "42": "湖北",
            "43": "湖南",
            "44": "广东",
            "45": "广西",
            "46": "海南",
            "50": "重庆",
            "51": "四川",
            "52": "贵州",
            "53": "云南",
            "54": "西藏",
            "61": "陕西",
            "62": "甘肃",
            "63": "青海",
            "64": "宁夏",
            "65": "新疆",
        },
    },
    computed: {},
    mutations: {
        toggleSideBar (state,data) {
            state.sidebar = !state.sidebar
            if (state.sidebar) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
        },

        set_loading(state, data) {
            // loading状态
            state.loading = data
        },
        setShow(state, value) {
            state.disabledShow = value
        },
        // 置空options和activeIndex
        resetState(state, value) {
            if (value) {
                state.options = [];
                state.activeIndex = '';
            }
        },
        // 添加tabs
        add_tabs(state, data) {
            var _t = this;
            _t.state.options.push(data);
            if (_t.state.options.length <= 8) {
                // 删除下标为 1 的 作用: 一直加,加到最多时删除 除首页之外的第一项
                // _t.state.options.push(data);
                // if (_t.state.options.length == '3') {
                //   MessageBox.alert('标签页数量到达最大值!请关闭其他标签!');
                // }
            }
        },
        // 删除全部
        deleteAll(state, val) {
            this.state.options = [];
            this.state.options.push(val)
        },
        // 删除tabs
        delete_tabs(state, name) {
            var _t = this;
            let index = 0;
            for (let option of state.options) {
                if (option.name === name) {
                    break;
                }
                index++;
            }
            _t.state.options.splice(index, 1);
        },
        // 设置当前激活的tab
        set_active_index(state, index) {
            var _t = this;
            _t.state.activeIndex = index;
        },
    }
})
