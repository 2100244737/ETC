<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="手机号：">
                    <el-input size="mini"  @keyup.enter.native="refreshHandle" clearable v-model="formItem.phoneNumber" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="单位：" >

                    <el-select clearable  v-model="formItem.factoryName" filterable placeholder="请选择单位">
                        <el-option
                            v-for="(item,index) in factoryNameList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select
                        clearable
                        placeholder="请选择角色"
                        v-model="formItem.roleId">
                        <el-option
                            v-for="(item,index) in roleList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="role">
                    <el-select
                        clearable
                        placeholder="请选择状态"
                        v-model="formItem.userStatus">
                        <el-option label="启用" value="1"/>
                        <el-option label="停用" value="2"/>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button  class="yellowBtn"  size="mini" round @click="refreshHandle">查询</el-button>
                    <el-button  class="cyanBtn"  size="mini" round @click="synchronization">添加</el-button>
                    <el-button  class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="nickName" label="姓名" header-align="center" align="center"/>
                <el-table-column prop="roleId" label="角色" header-align="center" align="center"/>
                <el-table-column prop="mobile" label="手机号" header-align="center" align="center"/>
                <el-table-column prop="factoryName" label="所属单位" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.factoryName">{{scope.row.factoryName}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userStatus" label="状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userStatus =='1'">启用</span>
                        <span v-else>停用</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="changeRoleBtn(scope.row)">修改</el-button>
                        <el-button v-if="scope.row.userStatus == 1" class="redTableBtn" size="mini" round @click="startRoStop(scope.row)">停用</el-button>
                        <el-button v-if="scope.row.userStatus == 2" class="blueTableBtn" size="mini" round @click="startRoStop(scope.row)">启用</el-button>
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

        <!--    修改-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetamend"
            :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-修改</span>
            </div>
            <el-form :model="amend" :rules="rules" ref="amend" label-width="120px">
                <el-form-item label="角色：" prop="role">
                    <el-select
                        clearable
                        placeholder="请选择角色"
                        v-model="amend.role">
                        <el-option
                            v-for="(item,index) in roleList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetamend">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    同步查询确认-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="synchronizationVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-添加用户</span>
            </div>
            <div class="synPhone">
                <div class="box">
                    <el-form :model="addEdit" :rules="rules" ref="addSynBtn" label-width="150px">
                        <el-form-item label="手机号：" prop="cellPhone">
                            <div class="synbox">
                                <el-input  clearable maxlength="11" v-model="addEdit.cellPhone" placeholder="请输入手机号"></el-input>
                                <el-button class="synBtn cyanBtn"  size="mini" round @click="synBtn">查询</el-button>
                            </div>
                        </el-form-item>
                    </el-form>


                </div>
            </div>

            <el-form v-show="synForm" :rules="rules" :model="addEdit" ref="addEditSyn" label-width="150px">
                <el-form-item label="角色：" prop="user">
                    <el-select
                        clearable
                        v-model="addEdit.user">
                        <el-option v-for="(item) in roleList" :label="item.name" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型：" prop="UserType">
                    <el-select
                        clearable
                        v-model="addEdit.UserType">
                        <el-option  label="数软" value="1"></el-option>
                        <el-option  label="厂商" value="2"></el-option>
                        <el-option  label="客户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input disabled maxlength="11"  clearable v-model="addEdit.Phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input  clearable  disabled v-model="addEdit.synname" placeholder="姓名"></el-input>
                </el-form-item>
<!--                <el-form-item class="staruser" label="应用编号列表：" prop="checkList">-->
<!--                    <el-checkbox-group @change="handleCheckedCitiesChange" v-model="checkList">-->
<!--                        <el-checkbox label="99999925">特情终端管理后台</el-checkbox>-->
<!--                        <el-checkbox label="88000504">阿里APP</el-checkbox>-->
<!--                        <el-checkbox label="88000505">无限APP</el-checkbox>-->
<!--                    </el-checkbox-group>-->
<!--                    <span v-show="checkShow" class="colorRed">必填项不能为空</span>-->
<!--                </el-form-item>-->
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="synData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {SSO_FIND, SSO_ADD, USER_PAGE} from '@/uitls/filenamme';
    import {getDataTime} from '@/assets/js/time'
    import api from '../../uitls/api/system'
    import Pages from "../../components/pages"; // 分页
    import {Debounce} from '@/uitls/Debounce'
    export default {
        name: 'userManagement',
        data() {
            return {
                userList: [],// 角色数组
                tableData: [],//  表格数据
                roleList: [], // 角色数据
                factoryNameList: [],
                extendompetenceList: [], // 权限范围
                configurationVisible: false, // 配置
                synchronizationVisible: false, // 同步查询
                amendVisible: false, // 修改角色
                synForm: false, // 同步数据显示
                textShow: false, // 提示字体
                checkList: [], // 复选框组
                rules: {
                    user: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    role: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    UserType: [
                        {required: true, message: '请选择用户类型', trigger: 'change'},
                    ],
                    cellPhone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                },
                // 表单数据
                formItem: {
                    phoneNumber: '', // 手机号
                    userStatus:'',
                    roleId:'',
                    factoryName:'',
                },
                amend: {
                    roleId:'',
                    mobile:'',
                },
                checkShow: false,
                // 新增对象
                addEdit: {
                    UserType:'',
                    type: '', // 类型
                    role: '', // 角色
                    name: '', // 姓名
                    cellPhone: '', // 同步手机号
                    Phone: '', // 返回手机号
                    synname: '', //同步姓名
                    user: '', // 角色
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
        methods: {
            getFactory() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = api.COMPANY_LIST + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {

                        _t.factoryNameList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            startRoStop(row) {
                var _t = this;
                if(row.userStatus == '1') {
                    _t.$confirm('你确定要停用此用户吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const params = {
                            mobile: row.mobile,
                            userStatus:2,
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                        };
                        var filename = api.USER_STATUS + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);

                                _t.refreshHandle();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })

                    }).catch(() => {
                        return false
                    });
                }else {
                    _t.$confirm('你确定要启用此用户吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const params = {
                            mobile: row.mobile,
                            userStatus: 1,
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                        };
                        var filename = api.USER_STATUS + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.refreshHandle();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })

                    }).catch(() => {
                        return false
                    });

                }

            },
            desposeTable (row) {
                // 处理 table
               return row.join(', ')
            },
            handleCheckedCitiesChange(val) {
                if (val.length > 0) {
                    this.checkShow = false
                } else {
                    this.checkShow = true;
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetCode() {
                // 取消
                this.configurationVisible = false;
                this.amendVisible = false;
                this.synchronizationVisible = false;
                this.synForm = false;
                this.textShow = false;
                this.addEdit.cellPhone = ''; // 同步手机号
                this.addEdit.Phone = ''; // 返回手机号
                this.addEdit.synname = ''; //同步姓名
                this.checkList = []
                this.addEdit.user = ''
                this.resetForm('addEditSyn') // 清除验证
                this.resetForm('addSynBtn') // 清除验证
            },
            synData:Debounce(function () {
                // 同步保存
                var _t = this;
                let go = false
                // _t.checkShow = false;
                // if (_t.checkList.length > 0) {
                //     _t.checkShow = false;
                //     go = true
                // } else {
                //     _t.checkShow = true;
                //     go = false
                // }
                if (_t.synForm) {
                    _t.$refs.addEditSyn.validate((valid) => {
                        if (valid ) {
                            // 提交
                            const params = {
                                accessToken: _t.$cookie.get('accessToken'),
                                openId: _t.$cookie.get('openId'),
                                mobile: _t.addEdit.cellPhone, // 手机号
                                appIds: _t.checkList, // 应用编号列表
                                roleId: _t.addEdit.user,
                                name: _t.addEdit.synname,
                                UserType: _t.addEdit.UserType,
                            };
                            var filename = api.USER_ADD + getDataTime() + '.json';
                            var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                            _t.$api.post('api/json', data, function (res) {
                                if (res.statusCode == 0) {
                                    _t.synchronizationVisible = false;
                                    _t.refreshHandle();
                                    _t.alertDialogTip(_t, res.errorMsg);
                                    _t.resetCode()
                                } else {
                                    _t.resetCode()
                                    _t.alertDialogTip(_t, res.errorMsg)
                                }
                            })
                        }
                    })
                } else {
                    _t.alertDialogTip(_t, '请你先同步手机号！')
                }
            },600),
            getRoleLIst () {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    //roleIds:''
                };
                var filename = api.ROLE_LIST + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.roleList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                })
            },
            synBtn:Debounce(function () {
                var _t = this;

                _t.$refs.addSynBtn.validate((valid) => {
                    if (valid) {
                        _t.textShow = false;
                        _t.getRoleLIst()
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            mobile: _t.addEdit.cellPhone, // 手机号
                        };
                        var filename = api.SSO_FIND + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.synForm = true;
                                var getData = JSON.parse(res.bizContent)
                                _t.addEdit.Phone = getData.mobile
                                _t.addEdit.synname = getData.name
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    } else {
                        _t.textShow = true
                    }
                })
            },600),
            synchronization() {
                // 同步查询
                var _t = this;
                _t.synchronizationVisible = true;
            },
            refreshHandle() {
                // 查询功能
                var _t = this
                const params = {
                    userStatus: _t.formItem.userStatus,
                    roleId: _t.formItem.roleId,
                    factoryId: _t.formItem.factoryName,
                    mobile: _t.formItem.phoneNumber,
                    // mapAppType: _t.formItem.user,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.USER_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.tableData = JSON.parse(res.bizContent).data?JSON.parse(res.bizContent).data:[];
                        // _t.disposeData(list)
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                        // if (JSON.parse(res.bizContent).data) {
                        //
                        // }else {
                        //      _t.tableData = [];
                        //     // _t.alertDialogTip(_t,'查询数据为空！')
                        // }

                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                    // _t.tableData = JSON.parse(res.bizContent).data

                })
            },

            resetHandle() {
                // 重置功能
                this.formItem.phoneNumber = ''; // 手机号
                this.formItem.roleId = '';
                this.formItem.factoryName = '';
                this.formItem.userStatus = '';
                this.refreshHandle();

            },
            changeRoleBtn(row) {
                // 修改
                this.amend.mobile = row.mobile
                this.amend.roleId = row.roleId
                this.amendVisible = true;
                this.getRoleLIst()
            },
            // 修改取消
            resetamend () {
                this.amendVisible = false;
                this.amend.role = ''
                this.resetForm('amend') // 清除验证
            },
            amendData() {
                // 修改保存
                var _t = this;
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            mobile: _t.amend.mobile, // 手机号
                            roleId:_t.amend.role,
                        };
                        var filename = api.USER_ROLE + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.resetamend()
                                _t.refreshHandle()
                                _t.alertMessageTip(_t, res.errorMsg);
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    }else {
                        return false
                    }
                })

            },

            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.refreshHandle()
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.refreshHandle()
            },
        },
        created() {
            this.$store.commit('set_loading', true);
            this.refreshHandle()
            this.getRoleLIst()
            this.getFactory()
        }
    }
</script>

<style scoped>
    .synPhone {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .synbox {
        display: flex;

    }

    .text {
        margin-top: 5px;
        margin-left: 119px;
    }

    .synBtn {
        margin: 0 50px;
    }

    .synPhone .syninput {
        margin-left: 119px;
    }

    /*提示功能*/
    .staruser {
        position: relative;
        color: red;
    }

    .staruser:after {
        content: '*';
        color: red;
        margin-right: 5px;
        position: absolute;
        top: 10px;
        left: 29px;
    }
</style>
