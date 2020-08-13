<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="省份：">
                    <el-select size="mini" clearable v-model="formItem.province" filterable placeholder="请选择查询省份">
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
                <el-form-item label="设备ID：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150" v-model="formItem.deviceId" placeholder="请输入设备ID"></el-input>
                </el-form-item>
                <el-form-item label="收费站ID：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150" v-model="formItem.stationId" placeholder="请输入收费站ID"></el-input>
                </el-form-item>
                <el-form-item label="收费站名称：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150" v-model="formItem.stationName"
                              placeholder="请输入收费站名称"></el-input>
                </el-form-item>
                <br>
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn"  size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn"  size="mini" round @click="AddSever">添加</el-button>
                    <el-button class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="province" width="120px" label="省份" header-align="center" align="center"/>
                <el-table-column prop="stationName" label="收费站名称" header-align="center" align="center"/>
                <el-table-column prop="stationId" label="收费站ID" header-align="center" align="center"/>
                <el-table-column prop="deviceId" label="设备ID" header-align="center" align="center"/>
                <el-table-column width="150px" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="details(scope.row)">详情</el-button>
                        <el-button class="redTableBtn" size="mini" round @click="relieve(scope.row)">解绑</el-button>
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
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetdetails"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">地址配置--详情</span>
            </div>
            <el-form :model="detailsData" ref="addEdit" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="收费站名称：">
                            <el-tooltip :content="detailsData.stationName" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.stationName"
                                          placeholder="收费站名称"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="省份：">
                            <el-tooltip :content="detailsData.province" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.province" placeholder="省份"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="省级网关地址：">
                            <el-tooltip :content="detailsData.gatewayUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.gatewayUrl"
                                          placeholder="网关地址"></el-input>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="云服务商类型：">
                            <el-tooltip :content="detailsData.appServiceType" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.appServiceType"
                                          placeholder="云服务商类型"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="省级计费模块地址：">
                            <el-tooltip :content="detailsData.serverUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.serverUrl"
                                          placeholder="省级计费模块地址"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="收费站ID：">
                            <el-tooltip :content="detailsData.stationId" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.stationId"
                                          placeholder="收费站ID"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="支付地址：">
                            <el-tooltip :content="detailsData.payUrl" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.payUrl" placeholder="支付地址"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetdetails">关闭</el-button>
            </div>
        </el-dialog>
        <!--        添加-->
        <el-dialog
            append-to-body
            width="70%"
            top="10vh"
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetADD"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">地址配置--添加</span>
            </div>
            <div class="addBody">
                <div class="steps">
                    <el-steps :active="stepsNumber" align-center finish-status="success">
                        <el-step title="选择设备"></el-step>
                        <el-step title="选择地址"></el-step>
                        <el-step title="确认"></el-step>
                    </el-steps>
                </div>

                <div v-show="steps1" class="stepsNumber1">
                    <el-form :model="stepsData" inline>
                        <el-form-item label="省份：">
                            <el-select clearable v-model="stepsData.province" filterable placeholder="请选择查询省份">
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
                        <el-form-item label="设备ID：">
                            <el-input clearable  @keyup.enter.native="getDeviceData" maxlength="150" v-model="stepsData.deviceId"
                                      placeholder="请输入设备ID"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button class="yellowBtn"  size="mini" round @click="getDeviceData">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="deviceData" ref="steps1Table" border stripe  @selection-change="handleSelectionChange" @row-click="deciceChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column prop="province" width="120px" label="省份" header-align="center" align="center"/>
                        <el-table-column prop="deviceId" label="设备id" header-align="center" align="center"/>
                    </el-table>
                    <el-pagination
                        class="pagesTop"
                        @size-change="deviceIDSizeChangeSub"
                        @current-change="deviceIDCurrentChange"
                        :current-page="deviceID.currentPage"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="deviceID.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="deviceID.total">
                    </el-pagination>
                </div>
                <div v-show="steps2" class="stepsNumber1">
                    <el-form :model="siteData" inline>
                        <el-form-item label="省份：">
                            <el-select clearable v-model="siteData.province" filterable placeholder="请选择查询省份">
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

                        <el-form-item>
                            <el-button class="yellowBtn"   size="mini" round @click="getSiteData">查询</el-button>

                        </el-form-item>
                    </el-form>
                    <el-table :data="siteListeData" border stripe @row-click="siteChange">
                        <el-table-column width="50px" label="选择">
                            <template slot-scope="scope">
                                <el-radio v-model="siteData.siteRadio" :label="scope.row.id">
                                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="province" width="120px" label="省份" header-align="center" align="center"/>
                        <el-table-column prop="gatewayUrl" label="省级网关地址" header-align="center" align="center"/>
                        <el-table-column prop="payUrl" label="支付地址" header-align="center" align="center"/>
                        <el-table-column prop="serverUrl" label="省级计费模块地址" header-align="center" align="center"/>
                    </el-table>
                    <el-pagination
                        class="pagesTop"
                        @size-change="siteIDSizeChangeSub"
                        @current-change="siteIDCurrentChange"
                        :current-page="siteID.currentPage"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="siteID.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="siteID.total">
                    </el-pagination>
                </div>
                <div style="margin-top: 20px;" class="steps3" v-show="steps3">

                    <h3>已选设备ID</h3>
                    <div v-for="(item,index) in stepsData.selection" :key="item.deviceId">
                        <span>{{item.deviceId}}</span>
                    </div>
                    <h3 style="margin-top: 20px;">已选地址ID</h3>
                    <div>
                        <span>{{siteData.siteRadio}}</span>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetADD">取消</el-button>
                <el-button v-show="steps2"  class="blueTableBtn" size="medium" round @click="addPrev">上一步</el-button>
                <el-button v-show="steps3" class="blueTableBtn" size="medium" round @click="addPrev">上一步</el-button>
                <el-button v-if="addNextBtn" :disabled="disabledBtn" class="blueTableBtn" size="medium" round @click="addNext">下一步</el-button>
                <el-button v-if="AddBut" class="blueTableBtn" size="medium" round @click="amendData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../uitls/api/device";
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    export default {
        name: "siteConfiguration",
        data() {
            return {
                formItem: {
                    province: '',
                    stationName: '',
                    stationId: '',
                    deviceId: ''
                },
                disabledBtn: true,
                steps1: true,
                steps2: false,
                steps3: false,
                AddBut: false,
                addNextBtn: true,
                stepsData: {
                    province: '',
                    deviceId: '',
                    selection: [],
                },
                siteData: {
                    province: '',
                    deviceId: '',
                    siteRadio: ''
                },
                siteListeData: [],
                deviceData: [],
                stepsNumber: 1,
                detailsVisible: false,
                addVisible: false,
                keyData: this.$store.state.province, // 省份
                tableData: [],
                rules: {
                    province: [
                        {required: true, message: '请选择省份', trigger: 'change'},
                    ],
                },
                detailsData: {
                    id: '',
                    stationName: '',
                    serverUrl: '',
                    payUrl: '',
                    gatewayUrl: '',
                    province: '',

                    stationId: '',
                    appServiceType: ''
                },
                // 地址分页

                siteID: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
                },
                //设备id 分页
                deviceID: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
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
            // 解绑
            relieve (row) {
                var _t = this;
                _t.$confirm('你确定解绑此设备吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        accessToken: _t.$cookie.get('accessToken'),
                        deviceId: row.deviceId,
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.ADDRESS_UNBIND + getDataTime() + '.json';
                    var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.getData();
                            _t.alertMessageTip(_t, res.errorMsg);
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg)
                        }
                    });
                }).catch(() => {
                    _t.$message({
                        type: 'info',
                        offset: 200,
                        message: '解绑已取消'
                    });
                });
            },
            handleSelectionChange (val) {
                this.disabledBtn = false
                this.stepsData.selection = val
                if(val.length == 0){
                    this.disabledBtn = true
                }
            },
            siteChange(row) {
                this.disabledBtn = false
                this.siteData.siteRadio = row.id
            },
            // 选择设备点击行
            deciceChange(row) {
                this.disabledBtn = false
                this.$refs.steps1Table.toggleRowSelection(row)
            },
            addPrev () {
                this.disabledBtn = false
                this.stepsNumber--
                if (this.stepsNumber == 2) {
                    this.steps1 = false;
                    this.steps2 = true;
                    this.steps3 = false;
                    this.addNextBtn = true;
                    this.AddBut = false;
                } else if (this.stepsNumber == 3) {
                    this.AddBut = true;
                    this.steps1 = false;
                    this.steps2 = false;
                    this.steps3 = true;
                    this.addNextBtn = false;
                } else {
                    this.AddBut = false;
                    this.addNextBtn = true;
                    this.steps1 = true;
                    this.steps2 = false;
                }
                if(this.siteData.siteRadio) {
                    this.disabledBtn = false
                }
            },
            addNext() {
                this.disabledBtn = true
                this.stepsNumber++
                if (this.stepsNumber == 2) {
                    this.steps1 = false;
                    this.steps2 = true;

                } else if (this.stepsNumber == 3) {
                    this.AddBut = true;
                    this.steps1 = false;
                    this.steps2 = false;
                    this.steps3 = true;
                    this.addNextBtn = false;
                } else {
                    this.AddBut = false;
                    this.addNextBtn = true;
                    this.steps1 = false;
                    this.steps2 = false;
                }
                if(this.siteData.siteRadio) {
                    this.disabledBtn = false
                }
            },
            // 获取地址查询
            getSiteData() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    province: _t.siteData.province,
                    pageNo: _t.deviceID.currentPage, // 当前页
                    pageSize: _t.deviceID.pageSize, // 显示条数
                };
                var filename = api.ADDRESS_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.siteListeData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        _t.siteListeData.forEach(item => {
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    item.province = _t.keyData[int]
                                }
                            }
                        })
                        var pages = JSON.parse(res.bizContent).totalCount;
                        _t.siteID.total = pages ? pages : 0;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },
            // 查询 设备
            getDeviceData() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    province: _t.stepsData.province,
                    deviceId: _t.stepsData.deviceId,
                    pageNo: _t.deviceID.currentPage, // 当前页
                    pageSize: _t.deviceID.pageSize, // 显示条数
                };
                var filename = api.BIND_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.deviceData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        var pages = JSON.parse(res.bizContent).totalCount;
                        _t.deviceID.total = pages ? pages : 0;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },
            // 添加
            AddSever() {
                this.addVisible = true
            },
            // 添加取消
            resetADD() {
                this.addVisible = false
                this.addNextBtn = true
                this.steps1 = true;
                this.disabledBtn = true
                this.steps2 = false;
                this.steps3 = false;
                this.AddBut = false;
                this.siteData.deviceRadio = ''
                this.siteData.siteRadio = ''
                this.stepsData.province = '';
                this.stepsData.deviceId = '';
                this.siteData.province = '';
                this.deviceData = []
                this.siteListeData = []
                this.stepsNumber = 1
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 添加保存
            amendData() {
                var _t = this;
                var arrId = [];
                _t.stepsData.selection.forEach(item => {
                    arrId.push(item.deviceId)
                })
                const params = {
                    openId: _t.$cookie.get('openId'),
                    deviceIds:arrId,
                    addressConfId:_t.siteData.siteRadio
                };
                var filename = api.ADDRESS_BIND + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.resetADD()
                        _t.getData()
                        _t.alertMessageTip(_t, res.errorMsg);
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })

            },
            // 重置
            resetHandle() {
                this.formItem.province = '';
                this.formItem.stationName = '';
                this.formItem.stationId = '';
                this.formItem.deviceId = '';
                this.getData()
            },
            resetdetails() {
                this.detailsVisible = false
            },
            // 详情
            details(row) {
                var _t = this;
                _t.detailsData.stationName = row.stationName
                _t.detailsData.id = row.id
                _t.detailsData.payUrl = row.payUrl
                _t.detailsData.serverUrl = row.serverUrl
                _t.detailsData.gatewayUrl = row.gatewayUrl
                _t.detailsData.stationId = row.stationId
                _t.detailsData.appServiceType = row.appServiceType == 1 ? '阿里巴巴' : '华为';
                _t.detailsData.province = row.province
                _t.detailsVisible = true
            },
            getData() {
                // 查询

                var _t = this;
                this.$store.commit('set_loading', true);
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    province: _t.formItem.province,
                    stationName: _t.formItem.stationName,
                    stationId: _t.formItem.stationId,
                    deviceId: _t.formItem.deviceId,

                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.ADDRESS_BINDPAGE + getDataTime() + '.json';
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
            siteIDSizeChangeSub() {
                var _t = this;
                _t.siteID.pageSize = val;
                _t.getSiteData();
            },

            siteIDCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.siteID.currentPage = val;
                _t.getSiteData();
            },
            deviceIDCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.deviceID.currentPage = val;
                _t.getDeviceData();
            },

            deviceIDSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.deviceID.pageSize = val;
                _t.getDeviceData();
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .blueTableBtn.is-disabled, .blueTableBtn.is-disabled:focus, .blueTableBtn.is-disabled:hover {
       color: #ffffff;
       background:linear-gradient(270deg,rgba(137,215,248,1) 0%,rgba(80,147,252,1) 100%);
       box-shadow:0px 0px 4px 2px rgba(134,211,248,0.5);
    }
   /deep/ .el-pagination .el-select .el-input .el-input__inner {
       width: 108px;/*no*/
       height: 30px;/*no*/
   }
    .stepsNumber1 {
        margin-top: 40px;
    }

    .steps3 {
        margin-left: 60px;
    }

    .steps {
        /*padding: 0 300px;*/
    }

    .pagesTop {
        margin-top: 40px;
    }
</style>
