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
                this.$cookie.delete('roleId');
                this.$cookie.delete('companyName');
                localStorage.removeItem("DEVICE_MENU_LIST");

            },
            // 获取openId
            getTokenAndId () {
                 this.loginForm.openId = this.GetQueryValue1('openId')
                 this.loginForm.accessToken = this.GetQueryValue1 ('accessToken')
                // this.loginForm.openId = '266b5c9e6c244ff891db9cc70685ab02'
                // this.loginForm.accessToken = 'd0c9f14d1c4e44bc85446a123f49ccf5'
                var millisecond = new Date().getTime();
                var expiresTime = new Date(millisecond + 60 * 1000 *60 * 6);
                this.$cookie.set('openId', this.loginForm.openId);
                if(this.loginForm.accessToken) {
                    this.loginForm.accessToken= this.loginForm.accessToken.slice(0, this.loginForm.accessToken.length-1)
                }
                this.$cookie.set('accessToken', this.loginForm.accessToken);


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
                        localStorage.setItem("DEVICE_MENU_LIST", JSON.stringify(menuList));
                        const mobile = JSON.parse(res.bizContent).mobile;
                        const name = JSON.parse(res.bizContent).name;
                        const roleId = JSON.parse(res.bizContent).roleId;
                        const companyName = JSON.parse(res.bizContent).companyName;
                        const roleName = JSON.parse(res.bizContent).roleName ? JSON.parse(res.bizContent).roleName: '';
                        _t.$cookie.set('username', name); // 用户名
                        _t.$cookie.set('phone', mobile); // 手机号
                        _t.$cookie.set('roleId', roleId); // 角色Id
                        _t.$cookie.set('companyName', companyName); // 单位名称
                        _t.$cookie.set('roleName', roleName); // 角色  1:数软 ，2：厂商， 3：客户
                        _t.$nextTick(function () {
                            _t.handleLogin()
                        })

                    } else {
                        var alertName = ''

                        if(res.statusCode == '701') {
                            alertName = 'openId不能为空！'
                        }else {
                            alertName = res.errorMsg
                        }
                        _t.$confirm(alertName, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            var url ='https://'+ location.hostname + '/device/webLogin'
                            window.location.replace(url)
                        }).catch(() => {
                            var url ='https://'+ location.hostname + '/device/webLogin'
                            window.location.replace(url)
                            return false
                        });
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
               // 正式
               var url ='https://'+ location.hostname + '/device/html/#/index'
                //测试
              // var url ='/device/html/#/index'
                window.location.replace(url)
                //_t.$router.replace("/index");
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


</style>
