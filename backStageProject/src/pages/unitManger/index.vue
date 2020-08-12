<template>
    <div>
        <router-view />
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {}
        },
        components: {},
        mounted() {
        },
        methods: {
            getData() {
                // 查询
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>

</style>
