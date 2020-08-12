<template>
    <div>
        <!--        代收关系查询-->
        <div class="formBox-top">
            <el-form ref="provinceForm" :model="formItem" class="clearFix" inline>
                <el-form-item label="收费站名称">
                    <el-input clearable size="mini" v-model="formItem.stationName" placeholder="请输入收费站名称"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
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
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn" size="mini" round @click="setAddHandle">添加</el-button>
                    <el-button class="redBtn" size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="80px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="province" label="省份" header-align="center" align="center"/>
                <el-table-column prop="stationName" label="收费站" header-align="center" align="center"/>
                <el-table-column prop="plazaName" label="收费广场" header-align="center" align="center"/>
                <el-table-column prop="gantryId" label="代收门架编号" header-align="center" align="center"/>
                <el-table-column  label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button  class="blueTableBtn" size="mini" round @click="amendRelation(scope.row)">修改</el-button>
                        <el-button class="redTableBtn" size="mini" round @click="deleteRole(scope.row)">删除</el-button>
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
        <!--    添加-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">代收关系--添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addCollection" label-width="150px">
                <el-form-item label="省份" prop="province">
                    <el-select clearable  @change="getStation(addEdit.province)" v-model="addEdit.province" filterable placeholder="请选择查询省份">
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
                <el-form-item label="收费站：" prop="stationId">
                    <el-select clearable @change="getPlazaId(addEdit.stationId)" v-model="addEdit.stationId" filterable
                               placeholder="请输入收费站">
                        <el-option
                            v-for="(item,index) in stationList"
                            :key="index"
                            :label="item.stationName"
                            :value="item.stationId"/>
                    </el-select>


                </el-form-item>
                <el-form-item label="收费广场：" prop="plazaId">
                    <el-select clearable  v-model="addEdit.plazaId" filterable placeholder="请输入收费广场">
                        <el-option
                            v-for="(item,index) in plazaIdList"
                            :key="index"
                            :label="item.plazaName"
                            :value="item.plazaId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="代收门架编号：">
                    <el-input clearable v-model="addEdit.gantryId" placeholder="请输入代收门架编号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    修改-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetAmend"
            :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">代收关系--修改</span>
            </div>
            <el-form :model="amend" :rules="rules" ref="amend" label-width="150px">

                <el-form-item label="代收门架编号：">
                    <el-input clearable v-model="amend.gantryId" placeholder="请输入代收门架编号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAmend">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amendADD">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time';
    import api from '../../uitls/api/basic'; //基础数据
    export default {
        name: "collectionRelation",
        data() {
            return {
                formItem: {
                    province: '',
                    plazaId: '',
                    stationId: '',
                    stationName: ''
                },
                amend:{
                    gantryId:''
                },
                rules: {

                    province: [
                        {required: true, message: '请选择省份', trigger: 'change'},
                    ],
                    plazaId: [
                        {required: true, message: '请输入收费广场编号', trigger: 'blur'}
                    ],
                    stationId: [
                        {required: true, message: '请输入收费站编号', trigger: 'change'}
                    ],
                    gantryId: [
                        {required: true, message: '请输入代收门架编号', trigger: 'blur'},
                    ],

                },
                addVisible: false,
                amendVisible: false,
                addEdit: {
                    province: '',
                    gantryId: '',
                    plazaId: '',
                    stationId: '',
                },
                plazaIdList: [],
                stationList: [],
                tableData: [],
                keyData: this.$store.state.province, // 省份
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
            // 修改保存
            amendADD () {
                var _t = this
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            gantryId: _t.amend.gantryId,
                            province: _t.amend.province,
                            plazaId: _t.amend.plazaId,
                            stationId: _t.amend.stationId,
                        };
                        var filename = api.AGENCY_UPDATE + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetAmend();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                                // _t.resetCode();
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 修改代收关系
            amendRelation (row) {
                this.amendVisible = true
                this.amend.gantryId = row.gantryId
                this.amend.province = row.provinceId
                this.amend.plazaId = row.plazaId
                this.amend.stationId = row.stationId
            },
            // 修改取消
            resetAmend () {
                this.amendVisible = false
                this.amend.gantryId = '';
                this.resetForm('amend')
            },
            // 删除
            deleteRole(row) {
                var _t = this;
                _t.$confirm('你确定要删除此代收关系吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        province: row.provinceId,
                        plazaId:  row.plazaId,
                        stationId:  row.stationId,
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.AGENCY_DELETE + getDataTime() + '.json';
                    var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.alertMessageTip(_t, res.errorMsg);
                            _t.getData();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg);
                        }
                    })

                }).catch(() => {
                    return false
                });
            },
            // 获取收费车站
            getStation(row) {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    provinceId: row,
                };
                var filename = api.PAGE_STATION + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.stationList = JSON.parse(res.bizContent).data;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            //收费广场编号
            getPlazaId(row) {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    stationId: row,
                };
                var filename = api.PAGE_PLAZA + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    console.log(res);
                    if (res.statusCode == 0) {
                        _t.plazaIdList = JSON.parse(res.bizContent).data;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            // 新增 取消
            resetCode() {
                this.addVisible = false
                this.addEdit.province = '';
                this.addEdit.gantryId = '';
                this.addEdit.plazaId = '';
                this.addEdit.stationId = '';
                this.resetForm('addCollection')
            },
            // 添加
            setAddHandle() {
                this.addVisible = true
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 新增保存
            amendData() {
                var _t = this
                _t.$refs.addCollection.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            province: _t.addEdit.province,
                            gantryId: _t.addEdit.gantryId,
                            plazaId: _t.addEdit.plazaId,
                            stationId: _t.addEdit.stationId,
                        };
                        var filename = api.AGENCY_ADD + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.addVisible = false;
                                _t.stationIdList = JSON.parse(res.bizContent).data;
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetCode();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                                // _t.resetCode();
                            }
                        })
                    } else {
                        return false
                    }
                })

            },
            resetHandle() {
                // 重置
                this.formItem.province = '';
                this.formItem.stationName = '';
                this.getData()
            },

            getData() {
                var _t = this;

                _t.$store.commit('set_loading', true);
                // 查询
                const params = {
                    openId: _t.$cookie.get('openId'),
                    province: _t.formItem.province ? _t.formItem.province : null,
                    plazaId: _t.formItem.plazaId,
                    stationId: _t.formItem.stationId,
                    stationName: _t.formItem.stationName,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };

                var filename = api.AGENCY_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));

                _t.$api.post('/api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        _t.tableData.forEach(item => {
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    item.provinceId = item.province
                                    item.province = _t.keyData[int]
                                }
                            }
                        })
                        _t.$store.commit('set_loading', false);
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                    } else {
                        _t.$store.commit('set_loading', false);
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
            // if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId')) {
            //     this.$router.replace('/login');
            // }
            this.getData()
        }
    }
</script>

<style scoped>

</style>
