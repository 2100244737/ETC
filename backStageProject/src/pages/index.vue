<template>
    <div class="view">
        <div class="content">
            <div class="nva-letf">
                <div v-if="!active" class="profile">
                    <img class="profile-img" src="../assets/img/profile-img.png" alt="">
                    <div class="user-message">
                        <p>{{timeState}}，{{this.$cookie.get('username')}}</p>
                        <p>手机号：{{this.$cookie.get('phone')}}</p>
                        <p v-if="this.$cookie.get('companyName') !='null'">单位名称：{{this.$cookie.get('companyName')}}</p>
                    </div>
                    <p class="line-box"></p>
                </div>
                <div v-if="active" class="user-box">
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <div>
                            <p>{{timeState}}，{{this.$cookie.get('username')}}</p>
                            <p>手机号：{{this.$cookie.get('phone')}}</p>
                            <p v-if="this.$cookie.get('companyName')!='null'">单位名称：{{this.$cookie.get('companyName')}}</p>
                        </div>
                        <img slot="reference" class="user-picture" src="../assets/img/profile-img.png" alt="">
                    </el-popover>
                    <p class="line-user"></p>
                </div>
                <NavMenu  class="NavMenu"/>

                <div v-if="!active" class="operation">
                    <p class="line-box2"></p>
                    <div class="operation-message">
                        <div @click="loginOut" class="operation-item">
                            <i class="el-icon-switch-button"></i>
                            <span>退出登录</span>
                        </div>
                        <div class="operation-item">
                            <i id="hamburger-container" :class="[ active? 'el-icon-s-unfold': 'el-icon-s-fold' ]"
                               @click="handleClick"></i>
                            <span>收起导航</span>
                        </div>
                    </div>

                </div>
                <div v-if="active" class="operation">
                    <div class="operation-message-tow">
                        <div @click="loginOut" class="operation-item">
                            <i class="el-icon-switch-button"></i>
                        </div>
                        <div class="operation-item">
                            <i :class="[ active? 'el-icon-s-unfold': 'el-icon-s-fold' ]"
                               @click="handleClick"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <header class="header">
                    <Breadcrumb></Breadcrumb>
                </header>
                <div class="tabs">
                    <el-tabs
                        class="template-tabs"
                        v-model="activeIndex"
                        type="border-card"
                        closable
                        @tab-click="tabClick"
                        @tab-remove="tabRemove">
                        <el-tab-pane
                            :key="item.name"
                            v-for="(item) in options"
                            :label="item.title"
                            :name="item.name">
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <div v-loading="loading"
                     element-loading-text="拼命加载中..."
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="#fff" class="main">
                    <div class="routerView">
                        <keep-alive :include="cached">
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </div>

                <!--        <footer class="footer">底部</footer>-->
            </div>
        </div>

    </div>
</template>

<script>
    //  侧边栏组件
    import NavMenu from "../components/NavMenu";
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import {loginfile} from '@/uitls/filenamme';
    import screenfull from 'screenfull';
    import Breadcrumb from '../components/Breadcrumb'

    export default {
        name: 'index',
        data() {
            return {
                timeState:'上午好',
                loginForm: {
                    openId: '',
                    accessToken: ''
                },
                menusList: [],
                fullImg: true,// 全屏 背景图
                fullAll1: require('../assets/img/all1.png'),
                fullAll2: require('../assets/img/all.png'),
                allText: true,
                username: this.$cookie.get('username'), // 用户名称
                phone: this.$cookie.get('phone'), // 手机号
                cached: [], // 缓存的组件
                routePath: '',
                isActive: false,
                current: 0,
            }
        },
        components: {
            NavMenu,
            Breadcrumb
        },
        computed: {
            active() {
                return this.$store.state.sidebar
            },
            loading() {
                return this.$store.state.loading
            },
            options() {
                this.cached = [];
                this.$store.state.options.forEach(item => {
                    this.cached.push(item.name)
                });
                return this.$store.state.options;
            },
            activeIndex: {
                get() {
                    return this.$store.state.activeIndex;
                },
                set(val) {
                    this.$store.commit('set_active_index', val);
                }
            }
        },
        watch: {
            $route(to, from) {
                var _t = this;
                let flag = false;
                for (var option of _t.options) {
                    if (option.name === to.name) {
                        flag = true;
                        _t.$store.commit('set_active_index', to.name);
                        break;
                    }
                }
                if (!flag) {
                    if(to.name != 'err') {
                        _t.$store.commit('add_tabs', {
                            route: to.path,
                            title: to.meta.title,
                            name: to.name
                        });
                        _t.$store.commit('set_active_index', to.name);
                    }

                }
            },
        },
        mounted() {

        },
        methods: {
            handleClick() {
                this.$store.commit('toggleSideBar', this.active)
            },
            buttoncli() {
                // 需要注意的是 如果判断!screenfull.enabled 显示的是不支持全屏的话 是因为谷歌的版本问题  判断改为 !screenfull.isEnabled  就可以了
                if (!screenfull.isEnabled) {
                    this.$message({
                        message: '该浏览器版本不支持全屏！',
                        type: 'warning'
                    })
                    return false
                } else {
                    this.fullImg = !this.fullImg
                    this.allText = !this.allText
                    screenfull.toggle()
                }
            },
            tabClick(tab) {
                // tab切换时，动态的切换路由
                var _t = this;
                if (tab.name !== _t.$route.name) {
                    _t.$router.push({name: _t.activeIndex});
                }
            },
            // 删除页签
            tabRemove(path) {
                var _t = this;
                // 首页不可删除
                if (path === 'index') {
                    return;
                }
                this.cached.forEach((item, index) => {
                    if (item == path) {
                        this.cached.splice(index, 1)
                    }
                });
                _t.cached.push(path);
                // 删除当前页签
                _t.$store.commit('delete_tabs', path);
                _t.routePath = path;
                // 判断是否删除当前 若是:激活前一项
                if (_t.activeIndex === path) {
                    // 设置当前激活的路由
                    if (_t.options && _t.options.length >= 1) {
                        _t.$store.commit('set_active_index', _t.options[_t.options.length - 1].name);
                        _t.$router.push({name: _t.activeIndex});
                    } else {
                        _t.$router.push({name: 'index'});
                    }
                }
            },
            clearCache() {
                // 清除数据
                this.$cookie.delete('openId');
                this.$cookie.delete('accessToken');
                this.$cookie.delete('phone');
                this.$cookie.delete('username');
                this.$cookie.delete('roleName');
                this.$cookie.delete('roleId');
                this.$cookie.delete('companyName');
                localStorage.removeItem("DEVICE_MENU_LIST");
            },
            loginOut() {
                var _t = this;
                //退出
                window.close()

                var url = 'https://'+ location.hostname + '/device/webLogin/common/logout?openId=' + _t.$cookie.get('openId')+ '&accessToken=' + _t.$cookie.get('accessToken')
                window.location.replace(url)
                _t.clearCache()
                // window.open(url);    //跳转

            },
               getTimeState () {
                // 获取当前时间
                let timeNow = new Date();
                // 获取当前小时
                let hours = timeNow.getHours();
                // 设置默认文字
                // 判断当前时间段
                if (hours >= 0 && hours <= 10) {
                    this.timeState = `早上好`;
                } else if (hours > 10 && hours <= 14) {
                    this.timeState = `中午好`;
                } else if (hours > 14 && hours <= 18) {
                    this.timeState = `下午好`;
                } else if (hours > 18 && hours <= 24) {
                    this.timeState = `晚上好`;
                }
                // 返回当前时间段对应的状态
            },
            // 获取菜单权限
            getMenu () {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = 'DEVICE_USER_LOGIN_REQ_99999925_' + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.loginForm.accessToken);
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {

                    } else {
                        var alertName = ''

                        if(res.statusCode == '701') {
                            alertName = 'openId不能为空！'
                        }else {
                            alertName = res.errorMsg
                        }
                        var url ='https://'+ location.hostname + '/device/webLogin'
                        _t.$confirm(alertName, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {

                            window.location.replace(url)
                        }).catch(() => {
                            window.location.replace(url)
                            return false
                        });
                    }
                })
            },
        },
        created() {
             this.getMenu()
             this.getTimeState()
            this.$store.state.options = [];
            this.$store.state.activeIndex = '';
        }

    }
</script>

<style scoped>

    /deep/ .el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .loginOut {
        height: 50px;
        width: 50px;
        cursor: pointer;
        margin-left: 30px;
    }

    h3 span {
        display: inline-block;
        transition: width 1s;
        -webkit-transition: width 1s; /* Safari */
    }

    .active {
        position: relative;
        top: -5px;
        font-size: 40px; /*no*/
        color: #1A98FF;
    }

    /deep/ .el-tabs .el-tabs__item:first-child .el-icon-close:before {
        content: ''
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item + .el-tabs__item, .el-tabs--border-card > /deep/ .el-tabs__header .el-tabs__item:first-child {
        /*// 标签页首页移动*/
        margin-left: 1px;

    }

    .el-tabs /deep/ .el-tabs__item {
        color: rgba(154, 157, 172, 1);
        height: 30px !important; /*no*/
        line-height: 30px !important; /*no*/
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(188, 188, 188, 0.5);
        border-radius: 30px;
        margin-right: 25px;
    }

    /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
        /*标签页选中背景颜色*/
        color: #fff;
        background: linear-gradient(270deg, rgba(137, 215, 248, 1) 0%, rgba(80, 147, 252, 1) 100%);
        box-shadow: 0px 0px 4px 0px rgba(134, 211, 248, 0.5);
        border-radius: 30px
    }

    .headerimg .img {
        width: 130px;
        height: 130px;
        margin-left: 30px;
        margin-top: 20px;
    }

    .view {
        height: 100%;
        width: 100%;
        background: #5093FC;
        /*min-width: 1440px;*/
        /*overflow: auto;*/
        /*background: #F0F2F5;*/
    }

    .main {
        width: 100%;
        height: calc(100vh - 110px);
        overflow-y: auto;
        margin-top: 20px;
        box-sizing: border-box;
    }

    .routerView {

        padding: 0 19px;
    }

    .content {
        display: flex;
        height: 100%;
        width: 100%;
        color: #333;
    }


    .NavMenu {
        flex: 1;
        width: 100%;
        overflow: hidden;
    }

    NavMenu::-webkit-scrollbar {
        display: none;
    }

    .nva-letf {
        display: flex;
        position: relative;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    .nva-letf .profile {
        width: 225px;
    }

    .nva-letf .profile, .nva-letf .operation {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: rgba(255, 255, 255, 1);
    }

    .nva-letf .operation {
        width: 100%;
        cursor: pointer;
        font-size: 12px;
        /*position: absolute;*/
        /*bottom: 0;*/
    }

    .user-box {
        /*width: 60px;*/
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .user-picture {
        width: 50px;
        height: 50px;
        margin-top: 30px;
    }

    .line-box2 {
        width: 49px;
        height: 2px;
        background: rgba(199, 224, 255, 1);
        border-radius: 1px;
        margin-bottom: 20px;
    }

    .operation-message {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        justify-content: space-around;
        padding: 0 15px;
        margin-bottom: 15px;
    }

    .operation-message-tow {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
    }

    .operation-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .el-icon-switch-button, .el-icon-s-unfold, .el-icon-s-fold {
        padding: 7px;
        font-size: 22px;
        background: #ffffff;
        color: rgba(154, 157, 174, 1);
        border-radius: 50px;
        margin-bottom: 10px;
    }

    .user-message {
        text-align: center;
    }

    .profile-img {
        height: 80px; /*no*/
        width: 80px; /*no*/
        margin-top: 20px;
    }

    .line-box {
        width: 49px;
        height: 2px;
        margin-top: 5px;
        margin-bottom: 5px;
        background: rgba(199, 224, 255, 1);
        border-radius: 1px;
    }

    .line-user {
        width: 29px;
        height: 2px;
        margin-top: 34px;
        margin-bottom: 26px;
        background: rgba(199, 224, 255, 1);
        border-radius: 1px;
    }

    .right {
        overflow: hidden;
        /*width: 100%;*/
        /*height: 100%;*/
        flex: 1;
        padding-top: 20px;
        background: rgba(245, 247, 250, 1);
        border-radius: 31px 0px 0px 31px;
    }

    .tabs {
        padding: 0 20px;
    }
    /deep/.el-tabs--border-card>.el-tabs__content {
        display: none;
    }
    .template-tabs {
        height: 30px;
        margin-left: -1px;
    }

    .header {
        width: 100%;
        padding: 0 13px;
    }

    .fullAll {
        width: 50px;
        cursor: pointer;
        height: 50px;
        margin-right: 50px;
    }

    @keyframes run {
        to {
            transform: rotate(0deg)
        }
        from {
            transform: rotate(360deg)
        }
    }

</style>
