<template>
    <div>
<!--        收费车站查询-->
        <div class="formBox-top">
            <el-form ref="provinceForm"  :model="formItem" class="clearFix" inline>
                <el-form-item  label="省份：" prop="province">
                    <el-select clearable size="mini" v-model="formItem.province" filterable placeholder="请选择查询省份">
                        <el-option label="北京" value="11"></el-option>
                        <el-option label="天津" value="12"></el-option>
                        <el-option label="河北" value="13"></el-option>
                        <el-option label="山西" value="14"></el-option>
                        <el-option label="内蒙古" value="15"></el-option>
                        <el-option label="辽宁" value="21"></el-option>
                        <el-option label="吉林" value="22"></el-option>
                        <el-option label="黑龙江" value="23"></el-option>
                        <el-option label="上海" value="31"></el-option>
                        <el-option label="江苏" value="32"></el-option>
                        <el-option label="安徽" value="34"></el-option>
                        <el-option label="浙江" value="33"></el-option>
                        <el-option label="福建" value="35"></el-option>
                        <el-option label="江西" value="36"></el-option>
                        <el-option label="山东" value="37"></el-option>
                        <el-option label="河南" value="41"></el-option>
                        <el-option label="湖北" value="42"></el-option>
                        <el-option label="广东" value="44"></el-option>
                        <el-option label="广西" value="45"></el-option>
                        <el-option label="海南" value="46"></el-option>
                        <el-option label="重庆" value="50"></el-option>
                        <el-option label="四川" value="51"></el-option>
                        <el-option label="贵州" value="52"></el-option>
                        <el-option label="云南" value="53"></el-option>
                        <el-option label="西藏" value="54"></el-option>
                        <el-option label="陕西" value="61"></el-option>
                        <el-option label="甘肃" value="62"></el-option>
                        <el-option label="青海" value="63"></el-option>
                        <el-option label="宁夏" value="64"></el-option>
                        <el-option label="新疆" value="65"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ID：">
                    <el-input  clearable size="mini" @keyup.enter.native="getData" v-model="formItem.id" placeholder="请输入ID"></el-input>
                </el-form-item>
                <el-form-item label="Hex码：">
                    <el-input  clearable size="mini" @keyup.enter.native="getData"  v-model="formItem.laneHex" placeholder="请输入Hex码"></el-input>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn"  size="mini" round @click="getData">查询</el-button>
                    <el-button class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column  type="index" width="80px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="id" label="id" header-align="center" align="center"/>
                <el-table-column prop="province" label="省份" header-align="center" align="center"/>
                <el-table-column prop="laneHex" label="Hex码" header-align="center" align="center"/>
                <el-table-column label="状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '1' ">停用</span>
                        <span v-if="scope.row.status == '2' ">在用</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == '1' ">ETC车道</span>
                        <span v-if="scope.row.type == '2' ">MTC 车道</span>
                        <span v-if="scope.row.type == '3' ">混合车道</span>
                        <span v-if="scope.row.type == '4' ">复式混合车道</span>
                        <span v-if="scope.row.type == '5' ">虚拟车道(通过便携机收费)</span>
                    </template>
                </el-table-column>
                <el-table-column label="入出口类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.entryExitType == '1' ">入口</span>
                        <span v-if="scope.row.entryExitType == '2' ">出口</span>
                        <span v-if="scope.row.entryExitType == '3' ">潮汐</span>
                    </template>
                </el-table-column>
            </el-table>
            <Pages
                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
    </div>
</template>

<script>
    import Pages from "../../components/pages";
    import {getDataTime} from '@/assets/js/time'
    import api from '../../uitls/api/basic'; //基础数据
    export default {
        name: "TollLane",
        data() {
            return {
                formItem: {
                    province:'',
                    id: '',
                    laneHex: ''
                },
                tableData:[],
                keyData : this.$store.state.province, // 省份
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        components: {
            Pages
        },
        mounted() {
        },
        methods: {
            resetHandle () {
                // 重置
                this.formItem.province = '';
                this.formItem.id = '';
                this.formItem.laneHex = '';
                this.getData()
            },
            getData() {
                var _t = this;
                _t.$nextTick(function () {
                    _t.tableData = []
                })
                _t.$store.commit('set_loading', true);
                // 查询
                const params = {
                    openId: _t.$cookie.get('openId'),
                    province: _t.formItem.province?_t.formItem.province: null,
                    id: _t.formItem.id?_t.formItem.id:null,
                    laneHex: _t.formItem.laneHex?_t.formItem.laneHex:null,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.LANE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data?JSON.parse(res.bizContent).data:[];
                        _t.tableData.forEach(item =>{
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    item.province = _t.keyData[int]
                                }
                            }
                        })
                        _t.$store.commit('set_loading', false);
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                })
            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.getData()
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.getData()
            },
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>

</style>
