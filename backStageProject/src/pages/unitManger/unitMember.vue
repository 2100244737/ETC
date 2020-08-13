<template>
    <div>
        <div class="formBox-top">
            <el-form ref="provinceForm" :model="formItem" class="clearFix" inline>
                <el-form-item label="手机号">
                    <el-input clearable @keyup.enter.native="getData" size="mini" v-model="formItem.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select clearable size="mini" v-model="formItem.roleId" filterable placeholder="请选择角色">
                        <el-option v-for="(item) in roleList" :label="item.name" :key="item.id"
                                   :value="item.id"></el-option>
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
            <el-table :data="tableData"  size="small" stripe>
                <el-table-column type="index" width="80px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="userName" label="姓名" header-align="center" align="center"/>
                <el-table-column prop="roleName" label="角色" header-align="center" align="center"/>
                <el-table-column prop="mobile" label="手机号" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="amendRole(scope.row)">修改角色</el-button>
                        <el-button class="redTableBtn" size="mini" round @click="deleteRole(scope.row)">移除</el-button>
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
                <span class="title">单位成员-添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addCollection" label-width="150px">
                <el-form-item label="手机号：" prop="mobile">
                    <div style="display: flex; align-items: center;">
                        <el-input @keyup.enter.native="getSSO(addEdit.mobile,'add')" :disabled="formAddItem" clearable v-model="addEdit.mobile"
                                  placeholder="请输入手机号"></el-input>
                        <el-button style="margin: 0 30px;" class="yellowBtn" size="mini" round
                                   @click="getSSO(addEdit.mobile,'add')">查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item v-if="formAddItem" label="名称：" prop="userName">
                    <el-input disabled v-model="addEdit.userName" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item v-if="formAddItem" label="角色：" prop="roleId">
                    <el-select clearable v-model="addEdit.roleId" filterable placeholder="请选择角色">
                        <el-option v-for="(item) in roleList" :label="item.name" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="addData">保存</el-button>
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
                <span class="title">单位成员-修改</span>
            </div>
            <el-form :model="amend" :rules="rules" ref="amend" label-width="70px">
                <el-form-item label="角色：" prop="roleId">
                    <el-select clearable size="mini" v-model="amend.roleId" filterable placeholder="请选择角色">
                        <el-option v-for="(item) in roleList" :label="item.name" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>

                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAmend">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amendData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time';
    import api from '../../uitls/api/basic'; //基础数据
    export default {
        name: "unitMember",
        data() {
            return {
                formItem: {
                    mobile: '',
                    roleId: '',
                },
                formAddItem: false,
                rules: {

                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    userName: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号添加', trigger: 'blur'}
                    ],
                },
                amendVisible: false,
                addVisible: false,
                addEdit: {
                    userName: '',
                    mobile: '',
                    roleId: '',
                    roleName: '',
                    userOpenId: ''
                },
                roleList: [],
                amend: {
                    roleId:''
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
            getSSO(row, lt) {
                var _t = this;
                const params = {
                    mobile: row,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = api.SSO_FIND + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        if (lt == 'add') {
                            console.log(JSON.parse(res.bizContent));

                            _t.addEdit.userName = JSON.parse(res.bizContent).name
                            _t.addEdit.userOpenId = JSON.parse(res.bizContent).userOpenId

                            if (_t.addEdit.userName) {
                                _t.formAddItem = true;
                            }
                        }
                        if (lt == 'updata') {
                            _t.updataAdd.managerName = JSON.parse(res.bizContent).name
                        }
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 修改取消
            resetAmend() {
                this.amendVisible = false
                this.amend.roleId = ''
                this.resetForm('amend')
            },
            // 修改
            amendRole(row) {
                this.amendVisible = true;
                this.amend.id = row.id
            },
            // 修改保存
            amendData() {
                var _t = this;
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            roleId: _t.amend.roleId,
                            id: _t.amend.id
                        };
                        var filename = api.COMPANYUSER_UPDAT + getDataTime() + '.json';
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
            // 删除
            deleteRole(row) {
                console.log(row);
                var _t = this;
                _t.$confirm('你确定要删除此成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        id: row.id,
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.COMPANYUSER_DELETE + getDataTime() + '.json';
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


            // 新增 取消
            resetCode() {
                this.addVisible = false
                this.formAddItem = false;
                this.addEdit.userName = '';
                this.addEdit.mobile = '';
                this.addEdit.roleId = '';
                this.addEdit.userOpenId = '';
                this.resetForm('addCollection')
            },
            // 添加
            setAddHandle() {
                this.addVisible = true
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            getRole() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = api.COMPANYUSER_ROLE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.roleList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 新增保存
            addData() {
                var _t = this
                _t.$refs.addCollection.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            userName: _t.addEdit.userName,
                            mobile: _t.addEdit.mobile,
                            roleId: _t.addEdit.roleId,
                            userOpenId: _t.addEdit.userOpenId,
                        };
                        console.log(params);
                        var filename = api.COMPANYUSER_ADD + getDataTime() + '.json';
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
                this.formItem.mobile = ''
                this.formItem.roleId = ''
                this.getData()
            },

            getData() {
                var _t = this;
                _t.$store.commit('set_loading', true);
                // 查询
                const params = {
                    openId: _t.$cookie.get('openId'),
                    mobile: _t.formItem.mobile ? _t.formItem.mobile : null,
                    roleId: _t.formItem.roleId ? _t.formItem.roleId : null,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };

                var filename = api.COMPANYUSER_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));

                _t.$api.post('/api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        console.log(_t.tableData);
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
            this.getRole()
        }
    }
</script>

<style scoped>

</style>
