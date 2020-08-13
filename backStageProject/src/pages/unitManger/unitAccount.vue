<template>
    <div>
        <div class="formBox-top">
            <el-form ref="provinceForm" :model="formItem" class="clearFix" inline>

                <el-form-item label="单位名称">
                    <el-input clearable size="mini" @keyup.enter.native="getData" v-model="formItem.name" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="单位类型">
                    <el-select clearable size="mini" v-model="formItem.companyType" filterable placeholder="请输入单位类型">
                        <el-option label="数软" value="1"></el-option>
                        <el-option label="设备厂商" value="2"></el-option>
                        <el-option label="客户" value="3"></el-option>
                    </el-select>
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
                <el-table-column prop="name" label="单位名称" header-align="center" align="center"/>
                <el-table-column prop="creditCode" label="统一社会信用代码" header-align="center" align="center"/>
                <el-table-column label="单位类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.companyType == '1'">数软</span>
                        <span v-if="scope.row.companyType == '2'">设备厂商</span>
                        <span v-if="scope.row.companyType == '3'">客户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="省份" header-align="center" align="center"/>
                <el-table-column prop="managerName" label="管理员名称" header-align="center" align="center"/>
                <el-table-column prop="managerTel" label="管理员手机号" header-align="center" align="center"/>
                <el-table-column label="操作" width="300px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="amendData(scope.row)">修改</el-button>
                        <el-button class="blueTableBtn" size="mini" round @click="amendUser(scope.row)">更改管理员
                        </el-button>
                        <el-button v-if="scope.row.companyStatus =='1'" class="redTableBtn" size="mini" round
                                   @click="stopUser(scope.row)">停用
                        </el-button>
                        <el-button v-if="scope.row.companyStatus =='2'" class="blueTableBtn" size="mini" round
                                   @click="stopUser(scope.row)">启用
                        </el-button>
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
                <span class="title">单位账户管理--添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addEdit" label-width="170px">
                <el-form-item label="单位名称：" prop="name">
                    <el-input clearable v-model="addEdit.name" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="单位类型：" prop="companyType">
                    <el-select
                        clearable
                        placeholder="请选择单位类型"
                        v-model="addEdit.companyType">
                        <el-option label="数软" value="1"></el-option>
                        <el-option label="厂商" value="2"></el-option>
                        <el-option label="客户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="licence">
                    <el-input clearable v-model="addEdit.licence" placeholder="请输入统一社会信用代码"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-select clearable @change="getStation(addEdit.province)" v-model="addEdit.province" filterable
                               placeholder="请选择查询省份">
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
                <el-form-item label="管理员手机号：">
                    <div style="display: flex; align-items: center;">
                        <el-input clearable   @keyup.enter.native="getSSO(addEdit.managerTel, 'add')" v-model="addEdit.managerTel" placeholder="请输入管理员手机号"></el-input>
                        <el-button style="margin: 0 30px;" class="yellowBtn" size="mini" round

                                   @click="getSSO(addEdit.managerTel, 'add')">查询
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="姓名：" prop="managerName">
                    <el-input disabled v-model="addEdit.managerName" placeholder="姓名"></el-input>
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
            :before-close="resetAmned"
            :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">单位账户管理--修改</span>
            </div>
            <el-form :model="amend" :rules="rules" ref="amend" label-width="170px">
                <el-form-item label="单位名称：" prop="name">
                    <el-input clearable v-model="amend.name" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-select clearable v-model="amend.province" filterable
                               placeholder="请选择查询省份">
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
                <el-form-item label="统一社会信用代码：" prop="licence">
                    <el-input clearable v-model="amend.licence" placeholder="请输入统一社会信用代码"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAmned">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amnedADD">保存</el-button>
            </div>
        </el-dialog>
        <!--    更换管理员-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetUpdata"
            :visible.sync="updataVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">单位账户管理--更换管理员</span>
            </div>
            <el-form :model="updataAdd" :rules="rules" ref="updataAdd" label-width="150px">
                <el-form-item label="姓名：">
                    <el-input disabled v-model="updataAdd.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input disabled clearable v-model="updataAdd.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="新管理员手机号：">
                    <div style="display: flex; align-items: center;">
                        <el-input clearable    @keyup.enter.native="getSSO(updataAdd.managerTel,'updata')" v-model="updataAdd.managerTel" placeholder="请输入管理员手机号"></el-input>
                        <el-button style="margin: 0 30px;" class="yellowBtn" size="mini" round

                                   @click="getSSO(updataAdd.managerTel,'updata')">查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="姓名：" prop="managerName">
                    <el-input disabled v-model="updataAdd.managerName" placeholder="姓名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetUpdata">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="updataADD">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time';
    import api from '../../uitls/api/basic'; //基础数据
    export default {
        name: "unitAccount",

        data() {
            return {
                formItem: {
                    province: '',
                    name: '',
                    licence: '',
                    companyType: ''
                },

                rules: {
                    province: [
                        {required: true, message: '请选择省份', trigger: 'change'},
                    ],
                    name: [
                        {required: true, message: '请输入单位名称', trigger: 'blur'},
                    ],
                    managerTel: [
                        {required: true, message: '请输入管理员手机号', trigger: 'blur'},
                    ],
                    licence: [
                        {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                    ],
                    companyType: [
                        {required: true, message: '请输入单位类型', trigger: 'blur'},
                    ],
                    managerName: [
                        {required: true, message: '请同步手机号', trigger: 'blur'},
                    ],

                },
                updataVisible: false,
                amendVisible: false,
                addVisible: false,
                amend: {
                    id: '',
                    name: '',
                    province: '',
                    licence: '',
                },
                addEdit: {
                    name: '',
                    licence: '',
                    companyType: '',
                    province: '',
                    managerId: '',
                    managerName: '',
                    managerTel: '',
                },
                updataAdd: {
                    id: '',
                    phone: '',
                    name: '',
                    managerName: '',
                    managerTel: '',
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
            // 修改管理员取消
            resetUpdata() {
                this.updataVisible = false
                this.updataAdd.managerTel = '';
                this.updataAdd.managerName = '';
                this.resetForm('updataAdd')
            },
            // 修改管理员保存
            updataADD() {
                var _t = this
                _t.$refs.updataAdd.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            id: _t.updataAdd.id,
                            managerName: _t.updataAdd.managerName,
                            managerTel: _t.updataAdd.managerTel,
                        };
                        var filename = api.COMPANY_MANAGER + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetUpdata();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 修改管理员
            amendUser(row) {
                this.updataVisible = true;
                this.updataAdd.id = row.id;
                this.updataAdd.name = row.name;
                this.updataAdd.phone = row.managerTel;

            },
            //修改
            amendData(row) {
                this.amendVisible = true;
                this.amend.id = row.id;
                this.amend.name = row.name;
                this.amend.province = row.provinceId;
                this.amend.licence = row.creditCode;
            },
            // 修改 保存
            amnedADD() {
                var _t = this
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            province: _t.amend.province,
                            id: _t.amend.id,
                            name: _t.amend.name,
                            creditCode: _t.amend.licence,
                        };
                        var filename = api.COMPANY_UPDATE + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetAmned();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 修改取消
            resetAmned() {
                this.amendVisible = false;
                this.resetForm('amend')
            },
            getSSO(row, lt) {
                var _t = this;
                if(!_t.updataAdd.managerTel && lt == 'updata') {
                    _t.alertMessageTip(_t, '请先输入手机号');
                    return
                }
                if(!_t.addEdit.managerTel && lt == 'add') {
                    _t.alertMessageTip(_t, '请先输入手机号');
                    return
                }
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
                            _t.addEdit.managerName = JSON.parse(res.bizContent).name
                        }
                        if(lt == 'updata') {
                            _t.updataAdd.managerName =JSON.parse(res.bizContent).name
                        }
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 移除
            stopUser(row) {
                var _t = this;
                var name = '你确定要停用该用户吗？'
                if (row.companyStatus == '1') {
                    name = '你确定要停用该用户吗？'
                } else {
                    name = '你确定要启用该用户吗？'
                }
                _t.$confirm(name, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        id: row.id,
                        companyStatus: row.companyStatus == '1' ? '2' : '1',
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.COMPANY_STATUS + getDataTime() + '.json';
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
                this.addEdit.licence = '';
                this.addEdit.companyType = '';
                this.addEdit.province = '';
                this.addEdit.managerId = '';
                this.addEdit.managerName = '';
                this.addEdit.name = '';
                this.addEdit.managerTel = '';
                this.resetForm('addEdit')
            },
            // 添加
            setAddHandle() {
                this.addVisible = true
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 新增保存
            addData() {
                var _t = this
                _t.$refs.addEdit.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            province: _t.addEdit.province,
                            name: _t.addEdit.name,
                            creditCode: _t.addEdit.licence,
                            companyType: _t.addEdit.companyType,
                            managerId: _t.addEdit.managerId,
                            managerName: _t.addEdit.managerName,
                            managerTel: _t.addEdit.managerTel,
                        };
                        var filename = api.COMPANY_ADD + getDataTime() + '.json';
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
                this.formItem.name = '';
                this.formItem.companyType = '';
                 this.getData()
            },

            getData() {
                var _t = this;

                _t.$store.commit('set_loading', true);
                // 查询
                const params = {
                    openId: _t.$cookie.get('openId'),
                    province: _t.formItem.province ? _t.formItem.province : null,
                    name: _t.formItem.name,
                    licence: _t.formItem.licence,
                    companyType: _t.formItem.companyType,
                    stationName: _t.formItem.stationName,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };

                var filename = api.COMPANY_PAGE + getDataTime() + '.json';
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
