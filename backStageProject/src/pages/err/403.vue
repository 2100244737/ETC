<template>
    <div>
        <div class="comtent">
            <img class="theme-img" src="../../assets/img/403.png" alt="">
            <h1 class="sloganNumber">403</h1>
            <h1 class="slogan">抱歉 你无权访问该页面</h1>
            <el-button class="btn" size="mini" round @click="toHome">返回首页</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "err",
        data() {
            return {}
        },
        components: {},
        mounted() {
        },
        methods: {
            getData() {
                // 查询
            },
            toHome () {
                this.$router.replace('/index')
            }
        },
        created() {
            this.getData()
            this.$store.commit('set_loading', false);
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
        width:25vw;
        height: 35vh;
    }

    .slogan {
        display: inline-block;
        height:21px;
        margin-top: 22px;
        font-size:36px;
        font-weight:600;
        color:rgba(56,67,118,1);
        line-height:21px;
    }
    h1 {
        margin: 0;
        padding: 0;
    }
    .sloganNumber {
        font-size:90px;
        color:rgba(56,67,118,1);
        letter-spacing:5px
    }
    .btn {
        font-size:21px;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin-top: 42px;
        width:290px;
        height:50px;
        background:linear-gradient(270deg,rgba(137,215,248,1) 0%,rgba(80,147,252,1) 100%);
        box-shadow:0px 0px 6px 3px rgba(134,211,248,0.5);
        border-radius:32px
    }
</style>
