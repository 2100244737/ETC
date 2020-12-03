<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="证书状态：">
                    <el-select
                        placeholder="请选择证书状态"
                        size="mini"
                        clearable
                        v-model="formItem.licenceStatus">
                        <el-option label="未使用" value="0"/>
                        <el-option label="已使用" value="1"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围：">
                    <el-date-picker
                        size="small"
                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        v-model="formItem.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class=" fr marBottom7">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn" size="mini" round @click="setAddHandle">添加</el-button>
                    <el-button class="redBtn" size="mini" round @click="refreshHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="80px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="appId" label="appId" header-align="center" align="center"/>
                <el-table-column prop="comment" label="设备编号" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deviceId">{{scope.row.deviceId}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="licence" label="许可证" header-align="center" align="center"/>
                <el-table-column  label="证书状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.licenceStatus == '1'"> 已使用</span>
                        <span v-else> 未使用</span>
                    </template>
                </el-table-column>

                <el-table-column prop="comment" label="备注信息" header-align="center" align="center"/>
<!--                <el-table-column label="操作" header-align="center" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button  class="redTableBtn" size="mini" round-->
<!--                                   @click="deleteRole(scope.row)">删除-->
<!--                        </el-button>-->

<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
            <Pages
                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--    添加弹框-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="dialogVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">许可证管理-添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addEdit" label-width="80px">
                <el-form-item label="appId：" prop="appId">
                    <el-input clearable v-model="addEdit.appId" placeholder="请输入appId"></el-input>
                </el-form-item>
                <el-form-item label="数量：" prop="count">
                    <el-input clearable v-model="addEdit.count" placeholder="请输入数量"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="comment">
                    <el-input
                        class="textarea"
                        type="textarea"
                        placeholder="请输入备注"
                        v-model="addEdit.comment">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="addCodeData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getDataTime} from '@/assets/js/time'
    import api from '../../uitls/api/device'
    import Pages from "../../components/pages"; // 分页
    export default {
        name: "licence",
        data() {
            return {
                dialogVisible: false,
                tableData: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                formItem: {
                    licenceStatus: '',
                    time:[]
                }, // 表单数据
                addEdit: {
                    appId: '',
                    count: '',
                    comment: ''
                },
                rules: {
                    appId: [
                        {required: true, message: '请输入appId', trigger: 'blur'},
                    ],
                    count: [
                        {required: true, message: '请输入数量', trigger: 'blur'}
                    ],
                    comment: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                },
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
            // 删除
            deleteRole(row) {
                var _t = this;
                _t.$confirm('你确定要删除此许可证吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        licence: row.licence,
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.LICENCE_DELETE + getDataTime() + '.json';
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
            // 添加
            setAddHandle() {
                this.dialogVisible = true
            },
            // 添加取消
            resetCode() {
                this.dialogVisible = false
                this.addEdit.appId = ''
                this.addEdit.count = ''
                this.addEdit.comment = ''
                this.resetForm('addEdit')
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 添加保存
            addCodeData() {
                var _t = this;
                _t.$refs.addEdit.validate((valid) => {
                    if (valid) {
                        const params = {
                            appId: _t.addEdit.appId,
                            count: _t.addEdit.count,
                            comment: _t.addEdit.comment,
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                        };
                        var filename = api.LICENCE_ADD + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetCode();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 重置
            refreshHandle() {
                this.formItem.licenceStatus = '';
                this.formItem.time = [];
                this.getData()
            },
            getData() {
                // 查询
                var _t = this
                const params = {
                    licenceStatus: _t.formItem.licenceStatus,
                    endTime:_t.formItem.time[1],
                    startTime:_t.formItem.time[0],
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                _t.$store.commit('set_loading', true);
                var filename = api.LICENCE_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {

                        _t.$store.commit('set_loading', false);
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;

                    } else {
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
            this.$store.commit('set_loading', false);
        }
    }
</script>

<style scoped>

</style>
