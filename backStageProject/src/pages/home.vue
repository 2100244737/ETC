<template>
    <div class="comtent">
        <img class="theme-img" src="../assets/img/ikon-home.png" alt="">
        <h1 class="slogan">欢迎使用 联网收费业务处理终端管理系统</h1>
    </div>
</template>
<script>
    export default {
        name: 'home',
        methods: {
            getApp() {
                //     this.$confirm('你要下载此APP?', '提示', {
                //         confirmButtonText: '确定',
                //         cancelButtonText: '取消',
                //         type: 'warning'
                //     }).then(() => {
                //
                //         window.location.href= 'https://tqappupdate.oss-cn-beijing.aliyuncs.com/1/V1.1.1.apk'
                //
                //     }).catch(() => {
                //         this.$message({
                //             type: 'info',
                //             message: '已取消'
                //         });
                //     });
            }
        },
        created() {
            // if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId') ) {
            //     this.$router.replace('/login');
            // }
            this.$store.commit('set_loading', false);
            // setTimeout(() => {
            //     this.$store.commit('set_loading', false);
            // }, 800);
        }
    }
</script>
<style scoped>
    .comtent {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: calc(100vh - 160px);
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 11px 5px rgba(227, 227, 227, 0.5);
        border-radius: 10px;
    }

    .theme-img {
        display: inline-block;
        width:38vw;
        height: 55vh;
    }
    .theme {
        width: 671px;
        height: 619px;
        box-sizing: border-box;
        margin: 0 auto;
    }
    .slogan {
        display: inline-block;
        width:660px;
        height:21px;
        margin-top: 52px;
        font-size:36px;
        font-weight:600;
        color:rgba(56,67,118,1);
        line-height:21px;
    }

</style>
<!--<style scoped>-->

<!--    .comtent {-->
<!--        display: flex;-->
<!--        justify-content: space-between;-->
<!--        padding: 20px 100px;-->
<!--        height: 100%;-->
<!--        width: 100%;-->
<!--        box-sizing: border-box;-->
<!--    }-->
<!--    .left {-->
<!--        width: 35%;-->
<!--        height: 100%;-->
<!--    }-->
<!--    /*.left .leftImg {*/-->
<!--    /*    display: block;*/-->
<!--    /*    width: 100%;*/-->
<!--    /*    height: 50%;*/-->
<!--    /*    border-radius: 8px;*/-->
<!--    /*}*/-->
<!--    .right {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        flex-direction: row-reverse;-->
<!--        width: 30%;-->
<!--        height: 60%;-->
<!--        padding-top: 50px;-->
<!--    }-->
<!--    .rightContent {-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        align-items: center;-->
<!--        justify-content: center;-->
<!--        /*border: 1px solid #ccc;*/-->
<!--        background: #fff;-->
<!--        border-radius: 8px;-->
<!--        text-align: center;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        padding-top:5%;-->
<!--        /*box-shadow: 0 0 10px -1px #ccc inset*/-->
<!--    }-->
<!--    /*.rightImg {*/-->
<!--    /*    width: 100%;*/-->
<!--    /*    height: 150px;*/-->
<!--    /*    border-radius: 8px;*/-->
<!--    /*}*/-->
<!--    .buttonImg {-->
<!--        margin-top: 50px;-->
<!--        border-radius: 8px;-->
<!--    }-->
<!--    h1 {-->
<!--        font-size: 20px;-->
<!--    }-->
<!--    .btn {-->
<!--        margin-top: 50px;-->
<!--        width: 150px;-->
<!--        margin-bottom: 50px;-->
<!--    }-->
<!--    @media screen and (max-device-width: 1920px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1680px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1600px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 190px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1400px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1366px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1280px) and (max-height: 1024px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 320px;-->
<!--            height: 270px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1280px ) and (max-height: 960px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 320px;-->
<!--            height: 200px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->

<!--</style>-->
