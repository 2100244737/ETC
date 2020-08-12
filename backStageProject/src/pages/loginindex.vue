<template>
    <div style="width: 100%;height: 100%"  v-loading="loading"
         element-loading-text="页面初始化中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#fff"
    >

    </div>
</template>

<script>
    import {getDataTime} from '@/assets/js/time'
    export default {
        name: 'loginindex',
        data() {
            return {
                loading: true,
                loginForm: {
                    openId: '',
                    accessToken: ''
                }
            }
        },
        mounted() {

        },
        methods: {
            // 清除数据
            clearString() {
                this.$cookie.delete('openId');
                this.$cookie.delete('accessToken');
                this.$cookie.delete('phone');
                this.$cookie.delete('username');
                this.$cookie.delete('roleName');
                sessionStorage.removeItem("MENU_LIST");
                sessionStorage.removeItem ('openId')
            },
            // 获取openId
            getTokenAndId () {
                this.loginForm.openId = this.GetQueryValue1('openId')
                this.loginForm.accessToken = this.GetQueryValue1 ('accessToken')
                this.$cookie.set('openId', this.loginForm.openId);
                this.$cookie.set('accessToken', this.loginForm.accessToken);
                sessionStorage.setItem("openId", JSON.stringify(this.loginForm.openId))
            },
            // 获取菜单权限
            getMenu () {
                var _t = this;
                const params = {
                    openId: _t.loginForm.openId,
                    accessToken:_t.loginForm.accessToken
                };
                var filename = 'DEVICE_USER_LOGIN_REQ_99999925_' + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.loginForm.accessToken);
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        var menuList = JSON.parse(res.bizContent).menus
                        sessionStorage.setItem("MENU_LIST", JSON.stringify(menuList));
                        const mobile = JSON.parse(res.bizContent).mobile;
                        const name = JSON.parse(res.bizContent).name;
                        const roleName = JSON.parse(res.bizContent).roleName ? JSON.parse(res.bizContent).roleName: '';
                        _t.$cookie.set('username', name); // 用户名
                        _t.$cookie.set('phone', mobile); // 手机号
                        _t.$cookie.set('roleName', roleName); // 角色
                          _t.handleLogin()
                    } else {

                        if(res.statusCode == '701') {
                               _t.$confirm('openId不能为空！', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    var url = 'https://testdevice.datasw.cn/device/webLogin/common/logout?openId='
                                    window.location.replace(url)
                                }).catch(() => {
                                    var url = 'https://testdevice.datasw.cn/device/webLogin /common/logout?openId='
                                    window.location.replace(url)
                                    return false
                                });
                        }else {
                            _t.alertDialogTip(_t, res.errorMsg)
                        }
                    }
                })
            },
            // 获取url 地址
            GetQueryValue1(queryName) {
                var text = queryName? queryName: ''
                var reg = new RegExp("(^|&)" + text + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(r[2]);
                } else {
                    return null;
                }
            },
            handleLogin() {
                var _t = this;
               // var url ='https://testweb.datasw.cn/device/html/#/index'

                // 测试
                // var url = 'http://10.10.10.155:8080/smpw/html/#/index'
                 var url = '/device/html/#/index'
                window.location.replace(url)
                // _t.$router.replace("/smpw/html/index");
            },
        },
        created() {
            this.clearString()
            this.getTokenAndId()
            this.getMenu()
        }
    }
</script>

<style scoped>

    .title-container {
        color: #333;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .login-container {
        display: flex;
        flex-direction:row-reverse;
        box-sizing: border-box;
        padding-top: 10%;
        padding-right: 10%;
        width: 100%;
        height: 100%;
        background: url("../assets/img/login.jpg") no-repeat;
        background-size: 100% 100%;

    }

    .login-form {
        margin-top: 20px;
        width: 350px;
        height: 230px;
        max-width: 350px;
        min-width: 300px;
        padding: 20px;
        border-radius: 8px;
        background:hsla(0 ,0% ,100%,.3);
        /*opacity: .8;*/
        /*box-shadow: 0 0 10px -1px #ccc inset*/
    }

    .width {

    }
</style>
