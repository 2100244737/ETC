<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="省份：">
                    <el-select clearable size="mini"  v-model="formItem.province" filterable placeholder="请选择查询省份">
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
<!--                <el-form-item label="车站名称：">-->
<!--                    <el-input clearable maxlength="150" v-model="formItem.stationName" placeholder="请输入车站名称"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item class="fr" >
                    <el-button  class="yellowBtn"  size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn" size="mini" round @click="AddSever">添加</el-button>
                    <el-button class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
<!--                <el-table-column prop="stationName" label="车站" header-align="center" align="center"/>-->
                <el-table-column prop="province" width="120px" label="省份" header-align="center" align="center"/>
                <el-table-column prop="gatewayUrl" label="省级网关地址" header-align="center" align="center"/>
                <el-table-column prop="payUrl" label="支付地址" header-align="center" align="center"/>
                <el-table-column prop="serverUrl" label="appServer地址" header-align="center" align="center"/>
                <el-table-column width="150px" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="details(scope.row)">详情</el-button>
                        <el-button class="cyanTableBtn" size="mini" round @click="update(scope.row)">更新</el-button>
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
<!--        详情-->
        <el-dialog
            width="50%"
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetdetails"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">地址管理-详情</span>
            </div>
            <el-form :model="detailsData" ref="addEdit" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
<!--                        <el-form-item label="车站名称：">-->
<!--                            <el-tooltip :content="detailsData.stationName" placement="top-start" effect="light">-->
<!--                                <el-input :disabled="true" v-model="detailsData.stationName" placeholder="车站名称"></el-input>-->
<!--                            </el-tooltip>-->
<!--                        </el-form-item>-->
                        <el-form-item label="省份：">
                            <el-tooltip :content="detailsData.province" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.province" placeholder="省份"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="省级网关地址：">
                            <el-tooltip :content="detailsData.gatewayUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.gatewayUrl" placeholder="网关地址"></el-input>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="云服务商类型：">
                            <el-tooltip :content="detailsData.appServiceType" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.appServiceType" placeholder="云服务商类型"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="appServer地址：">
                            <el-tooltip :content="detailsData.serverUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.serverUrl" placeholder="appServer地址"></el-input>
                            </el-tooltip>
                        </el-form-item>
<!--                        <el-form-item label="车站ID：">-->
<!--                            <el-tooltip :content="detailsData.stationId" placement="top-start" effect="light">-->
<!--                                <el-input :disabled="true" v-model="detailsData.stationId" placeholder="车站ID"></el-input>-->
<!--                            </el-tooltip>-->
<!--                        </el-form-item>-->
                        <el-form-item label="支付地址：">
                            <el-tooltip :content="detailsData.payUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.payUrl" placeholder="支付地址"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
<!--            <div slot="footer">-->
<!--                <el-button class="redTableBtn" size="medium" round  @click="resetdetails">关闭</el-button>-->
<!--            </div>-->
        </el-dialog>
<!--        添加-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetADD"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">地址管理-添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addSite" label-width="150px">
                <el-form-item label="省份：" prop="province">
                    <el-select clearable v-model="addEdit.province" filterable placeholder="请选择查询省份">
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
                <el-form-item label="云服务商类型：" prop="appServiceType">
                    <el-select
                        clearable
                        v-model="addEdit.appServiceType">
                        <el-option label="阿里巴巴" value="1"/>
                        <el-option label="华为" value="2"/>
                    </el-select>
                </el-form-item>
                  <el-form-item label="版本类型：" prop="versionType">
                    <el-select
                        clearable
                        v-model="addEdit.versionType">
                        <el-option label="测试版本" value="0"/>
                        <el-option label="正式版本" value="1"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="省级网关地址：" prop="gatewayUrl">
                    <el-input  clearable maxlength="50" v-model="addEdit.gatewayUrl" placeholder="请输入省级网关地址"></el-input>
                </el-form-item>
                <el-form-item label="支付地址：" prop="payUrl">
                    <el-input maxlength="150" v-model="addEdit.payUrl" placeholder="请输入支付地址"></el-input>
                </el-form-item>
                <el-form-item label="appServer地址：" prop="serverUrl">
                    <el-input maxlength="150" v-model="addEdit.serverUrl" placeholder="请输入appServer地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round  @click="resetADD">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round  @click="amendData">保存</el-button>
            </div>
        </el-dialog>
<!--        更新-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetUpDate"
            :visible.sync="upDateVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">地址管理-更新</span>
            </div>
            <el-form :model="upDateItem" :rules="rules" ref="upDateForm" label-width="150px">
                <el-form-item label="地址配置编号：" prop="id">
                    <el-input disabled maxlength="150" v-model="upDateItem.id" placeholder="请输入地址配置编号"></el-input>
                </el-form-item>
                <el-form-item label="云服务商类型：" prop="appServiceType">
                    <el-select
                        clearable
                        v-model="upDateItem.appServiceType">
                        <el-option label="阿里巴巴" value="1"/>
                        <el-option label="华为" value="2"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本类型：" prop="versionType">
                    <el-select
                        clearable
                        v-model="upDateItem.versionType">
                        <el-option label="测试版本" value="0"/>
                        <el-option label="正式版本" value="1"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="省级网关地址：" prop="gatewayUrl">
                    <el-input  clearable maxlength="50" v-model="upDateItem.gatewayUrl" placeholder="请输入省级网关地址"></el-input>
                </el-form-item>
                <el-form-item label="支付地址：" prop="payUrl">
                    <el-input maxlength="150" v-model="upDateItem.payUrl" placeholder="请输入支付地址"></el-input>
                </el-form-item>
                <el-form-item label="appServer地址：" prop="serverUrl">
                    <el-input maxlength="150" v-model="upDateItem.serverUrl" placeholder="请输入appServer地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetUpDate">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="upDataSaver">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import api from '../../uitls/api/device'
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    export default {
        name: "siteAdministration",
        data() {
            return {
                formItem: {
                    province: '',
                    stationName: ''
                },
                upDateItem: {
                    id:'',
                    appServiceType:'',
                    serverUrl:'',
                    payUrl:'',
                    gatewayUrl: '',
                    versionType:''
                },
                detailsVisible: false,
                upDateVisible: false,
                addVisible: false,
                keyData: this.$store.state.province, // 省份
                tableData: [],
                rules: {
                    province: [
                        {required: true, message: '请选择省份', trigger: 'change'},
                    ],
                    appServiceType: [
                        {required: true, message: '请选择云服务商类型', trigger: 'change'},
                    ],
                     versionType: [
                        {required: true, message: '请选择版本类型', trigger: 'change'},
                    ],
                    gatewayUrl: [
                        {required: true, message: '请输入省级网关地址', trigger: 'blur'}
                    ],
                    id: [
                        {required: true, message: '请输入地址配置编号', trigger: 'blur'}
                    ],
                    payUrl: [
                        {required: true, message: '请输入支付地址', trigger: 'blur'}
                    ],
                    serverUrl: [
                        {required: true, message: '请输入appServer地址', trigger: 'blur'}
                    ],
                },
                detailsData: {
                    id: '',
                    stationName: '',
                    serverUrl:'',
                    payUrl:'',
                    gatewayUrl: '',
                    province: '',

                    stationId:'',
                    appServiceType:''
                },
                addEdit: {
                    serverUrl:'',
                    payUrl:'',
                    province:'',
                    gatewayUrl: '',
                    appServiceType:'',
                    versionType:''
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
            // 更新
            update(row) {

                this.upDateVisible = true;
             this.upDateItem.id = row.id;
             this.upDateItem.appServiceType = row.serverType+ '';
             this.upDateItem.serverUrl = row.serverUrl;
             this.upDateItem.payUrl = row.payUrl;
             this.upDateItem.gatewayUrl = row.gatewayUrl;
             this.upDateItem.versionType = row.versionType+'';

            },
            // 更新取消
            resetUpDate () {
                this.upDateVisible = false
                this.resetForm('upDateForm') // 清除验证
            },
            //更新保存
            upDataSaver() {
                var _t = this;
                _t.$refs.upDateForm.validate((valid) => {
                    if (valid) {
                        const params = {
                            openId: _t.$cookie.get('openId'),
                            id: _t.upDateItem.id,
                            serverUrl: _t.upDateItem.serverUrl,
                            payUrl:_t.upDateItem.payUrl,
                            gatewayUrl: _t.upDateItem.gatewayUrl,
                            serverType:_t.upDateItem.appServiceType,
                            versionType: _t.upDateItem.versionType,
                            province: _t.upDateItem.province,
                        };
                        var filename = api.ADDRESS_UPDATE + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.getData()
                                _t.resetUpDate()
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
            // 添加
            AddSever () {
                this.addVisible = true
            },
            // 添加取消
            resetADD () {
                this.addVisible = false
                this.addEdit.serverUrl = '';
                this.addEdit.payUrl = '';
                this.addEdit.gatewayUrl = '';
                this.addEdit.appServiceType = '';
                this.addEdit.province = '';
                this.resetForm('addSite') // 清除验证
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 添加保存
            amendData () {
                var _t = this;
                _t.$refs.addSite.validate((valid) => {
                    if (valid) {
                        const params = {
                            openId: _t.$cookie.get('openId'),
                            serverUrl: _t.addEdit.serverUrl,
                            payUrl:_t.addEdit.payUrl,
                            gatewayUrl: _t.addEdit.gatewayUrl,
                            serverType:_t.addEdit.appServiceType,
                            versionType: _t.addEdit.versionType,
                            province: _t.addEdit.province,
                        };
                        var filename = api.ADDRESS_ADD + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.resetADD()
                                _t.getData()
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
            resetdetails () {
                this.detailsVisible = false
            },
            // 详情
            details (row) {
                var _t = this;
                const params = {
                    openId: _t.$cookie.get('openId'),
                    addressConfId: row.id
                };
                var filename = api.ADDRESS_FIND + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                       _t.detailsVisible = true
                        var item = JSON.parse(res.bizContent)
                        _t.detailsData.stationName = item.stationName
                       _t.detailsData.id = item.id
                       _t.detailsData.payUrl = item.payUrl
                       _t.detailsData.serverUrl = item.serverUrl
                       _t.detailsData.gatewayUrl = item.gatewayUrl
                       _t.detailsData.stationId = item.stationId
                       _t.detailsData.appServiceType = item.appServiceType == 1? '阿里巴巴':'华为'
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    _t.detailsData.province = _t.keyData[int]
                                }
                            }
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },

            // 重置
            resetHandle() {
                this.formItem.province = '';
                this.formItem.stationName = ''
                this.getData()
            },
            getData() {
                // 查询
                var _t = this;
                this.$store.commit('set_loading', true);
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    province: _t.formItem.province,
                   // stationName: _t.formItem.stationName,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.ADDRESS_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        _t.tableData.forEach(item => {
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    item.province = _t.keyData[int]
                                }
                            }
                        })
                        _t.$store.commit('set_loading', false);
                        var pages = JSON.parse(res.bizContent).totalCount;
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
                _t.getData();
            },

            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>

</style>
