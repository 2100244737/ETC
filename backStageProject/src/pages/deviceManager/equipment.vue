<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix"  inline>
                <el-form-item label="设备编号：">
                    <el-input size="mini"  @keyup.enter.native="getData" clearable maxlength="150"  v-model="formItem.equipmentNumber" placeholder="设备编号"></el-input>
                </el-form-item>
                <el-form-item label="厂商：">
                    <el-select
                        clearable
                        size="mini"
                        v-model="formItem.manufacturer">
                        <el-option label="北京无限感测科技有限公司" value="0"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用单位：">
                    <el-select
                        size="mini"
                        clearable
                        @change="StatusChange(formItem.deviceStatus)"
                        v-model="formItem.deviceStatus">
                        <el-option label="已部署车道" value="2"/>
                        <el-option label="厂家部署" value="0"/>
                        <el-option label="客户确认" value="1"/>
                        <el-option label="已注销" value="3"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="备案时间：">
                    <el-date-picker
                        size="mini"
                        v-model="formItem.deviceStatus"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn"  size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn"  size="mini" round @click="setAddHandle">添加</el-button>
                    <el-button class="blueBtn"  size="mini" round @click="importHandle">批量导入</el-button>
                    <el-button class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" ref="table"   size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="deviceId" label="设备编号" header-align="center" align="center"/>
                <el-table-column prop="factoryName" label="厂商名" header-align="center" align="center"/>
                <el-table-column prop="buyerName" label="使用单位" header-align="center" align="center"/>
                <el-table-column width="180px"  label="备案时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.insertTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="300px" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">

                        <el-button class="blueTableBtn" size="mini" round @click="details(scope.row)">详情</el-button>
                        <el-button v-if="scope.row.status =='0'" class="blueTableBtn" size="mini" round @click="designateUnit(scope.row)">选定使用单位</el-button>
                        <el-button class="redTableBtn" size="mini" round @click="deleteDevice(scope.row)">删除</el-button>
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
            center
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案--添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addDevice" label-width="150px">
                <el-form-item label="设备编号：" prop="deviceId">
                    <el-input  clearable maxlength="50" v-model="addEdit.deviceId" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备型号：">
                    <el-input maxlength="150" v-model="addEdit.model" placeholder="请输入设备型号"></el-input>
                </el-form-item>
                <el-form-item label="单位名称：" prop="companyName">
                    <el-input maxlength="150" v-model="addEdit.companyName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="厂商：" v-if=" this.$cookie.get('roleName') == '1'">
                    <el-select
                        clearable
                        v-model="addEdit.factoryName">
                        <el-option v-for="(item,index) in factoryList " :key="index"  :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="LICENSE授权码：" prop="licence">
                    <el-input maxlength="150" v-model="addEdit.licence" placeholder="请输入app版本号"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    选定使用单位-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetDesignate"
            :visible.sync="designateVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案--选定使用单位</span>
            </div>
            <el-form :model="designate" :rules="rules" ref="designate" label-width="120px">
                <el-form-item label="单位名称：" prop="unitName">
                    <el-input  clearable maxlength="50" v-model="designate.unitName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="设备编号：">
                    <el-input disabled v-model="designate.deviceId" placeholder="请输入设备编号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetDesignate">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="designateData">保存</el-button>
            </div>
        </el-dialog>
        <!--    批量加载-->
        <el-dialog
            center
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resedata"
            :visible.sync="allAddVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备管理-批量导入</span>
            </div>
            <el-form :model="addEdit" ref="addEdit" label-width="150px">
                <el-form-item label="批量导入字段：" class="textarea">
                    <el-input
                        class="textarea"
                        type="textarea"
                        placeholder="请输入内容:
 例如:设备编号,厂商; 以英文逗号隔开,以分号结尾,最多100条。"
                        v-model="addEdit.textarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resedata">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="allamendData">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            width="50vw"
            center
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetdetails"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案--详情</span>
            </div>
            <el-form  :model="detailsData" ref="addEdit" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="设备编号：">
                            <el-tooltip :content="detailsData.deviceId" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.deviceId" placeholder="设备编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="设备厂商：">
                            <el-tooltip :content="detailsData.factory" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.factory" placeholder="设备厂商"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="设备状态：">
                            <el-tooltip :content="detailsData.status" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.status" placeholder="设备状态"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="使用单位：">
                            <el-tooltip :content="detailsData.buyerName" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.buyerName" placeholder="设备状态"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备型号：">
                            <el-tooltip :content="detailsData.model" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.model" placeholder="设备型号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="备案时间：">
                            <el-tooltip :content="detailsData.insertTime" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.insertTime" placeholder="添加时间"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="备案更新时间：">
                            <el-tooltip :content="detailsData.insertTime" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.updateTime" placeholder="添加时间"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>
<!--            <div slot="footer">-->
<!--                <el-button class="redTableBtn" size="medium" round @click="resetdetails">关闭</el-button>-->
<!--            </div>-->
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import api from '../../uitls/api/device'
    export default {
        name: 'equipment',
        data() {
            return {
                manufacturerList: [], // 厂商数据
                manufacturersList: [], // 添加厂商数据
                unitList: [], // 添加 设备型号数据
                softwareVersionList: [], // 软件版本
                tableData: [],//  表格数据
                addVisible: false, // 添加设备显示
                allAddVisible: false, // 批量加载显示
                detailsVisible: false, // 详情
                // 表单数据
                formItem: {
                    equipmentNumber: '', // 设备编号
                    chipNumber: '', // 芯片编号
                    manufacturer: '', // 厂商
                    deviceStatus: '', // 设备状态
                },
                designate:{
                    deviceId:'',
                    unitName:''
                },
                designateVisible: false,
                rules: {
                    deviceId: [
                        {required: true, message: '请输入设备编号', trigger: 'blur'}
                    ],

                    hardVersion: [
                        {required: true, message: '请输入硬件版本号', trigger: 'blur'}
                    ],
                    appVersion: [
                        {required: true, message: '请输入app版本号', trigger: 'blur'}
                    ],
                    licence: [
                        {required: true, message: '请输入授权码', trigger: 'blur'}
                    ],
                    unitName: [
                        {required: true, message: '请输入单位名称', trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '请输入单位名称', trigger: 'blur'}
                    ],
                },
                factoryList :[],
                // 添加表单对象
                addEdit: {
                   deviceId:'',
                    model:'',
                    factoryName:'',
                    companyName:'',
                    sysVersion:'',
                    hardVersion:'',
                    appVersion:'',
                    licence:'',
                },
                tableHeight:'300',
                detailsList: {},
                detailsData: {
                    deviceId: '', //	设备编号
                    factory: '', //	设备厂商
                    status: '', //	设备状态
                    model: '', //设备型号
                    seNo: '', //	设备se芯片编号
                    buyerName: '',
                    stationId: '',//	收费站编号
                    tollPlazaId: '',//	收费广场编号
                    tollLaneId: '',//	收费车道编号
                    openId: '', //	操作人id
                    insertTime: '', //	插入时间
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
            this.$nextTick(function () {
                this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 120;

                // 监听窗口大小变化
                let self = this;
                window.onresize = function() {
                    self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 120
                }
            })
        },
        computed:{
        },
        methods: {
            // 获取厂商
            getFactoryName () {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    companyType:'2'
                };
                var filename = api.COMPANY_LIST + getDataTime() + '.json';
                var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.factoryList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            designateUnit (row) {
                this.designateVisible = true
                this.designate.deviceId = row.deviceId
            },
            // 选定使用单位 取消
            resetDesignate () {
                this.designateVisible = false
                this.resetForm('designate')
            },
            // 选定单位保存
            designateData () {
                var _t = this;
                _t.$refs.designate.validate((valid) => {
                    if(valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            deviceId: _t.designate.deviceId.trim(), //	设备编号
                            companyName:_t.designate.unitName,
                        };
                        var filename = api.DEVICE_ASSIGN + getDataTime() + '.json';
                        var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.designateVisible = false;
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    }else {
                        return false
                    }
                })
            },
            deleteDevice (row) {
                var _t  = this;
                _t.$confirm('你确定要删除此设备吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        deviceId: row.deviceId,
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = api.DEVICE_DELETE + getDataTime() + '.json';
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
            resedata () {
               // 批量导入取消
                this.addEdit.textarea = ''
                this.allAddVisible = false;
            },
            settime (row) {
              // 编辑 table 备案时间
              return   row.replace("T", ' ')
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            StatusChange() {
                // 设备状态
                this.getData();
            },
            resetCode() {
                // 取消功能
                this.addVisible = false;
                this.allAddVisible = false;
                this.detailsVisible = false;
                this.addEdit.deviceId = ''; //	设备编号
                this.addEdit.model = ''; //		设备型号
                this.addEdit.appVersion = '';
                this.addEdit.companyId = '';
                this.addEdit.companyName = '';
                this.addEdit.factoryName = '';
                this.resetForm('addDevice')
            },
            resetdetails() {
                this.detailsVisible = false;
            },
            resetHandle() {
                // 重置
                this.formItem.equipmentNumber = ''
                this.formItem.chipNumber = ''
                this.formItem.manufacturer = ''
                this.formItem.deviceStatus = ''
                this.getData()
            },
            setAddHandle() {
                // 添加功能
                this.addVisible = true;
                this.getFactoryName()
            },
            details(row) {
                var _t = this;
                _t.detailsVisible = true;
                _t.detailsData.deviceId =row.deviceId; //	设备编号
                 _t.detailsData.factory = row.factoryName; //	设备厂商
                 _t.detailsData.status = row.status != 0? '已指定':'未指定'; //	设备状态
                 _t.detailsData.model = row.model; //设备型号
                _t.detailsData.buyerName = row.buyerName;
                _t.detailsData.openId = row.openId; //	操作人id
                _t.detailsData.insertTime = row.insertTime.replace("T", ' '); //	插入时间
                _t.detailsData.updateTime = row.updateTime.replace("T", ' '); //	更新时间

            },
            amendData() {
                // 添加保存
                var _t = this;

                _t.$refs.addDevice.validate((valid) => {
                    if(valid) {
                        if(_t.addEdit.deviceId.indexOf('@')!=-1) {
                            const seNodata = _t.addEdit.deviceId.split('@')[1]
                            const params = {
                                accessToken: _t.$cookie.get('accessToken'),
                                openId: _t.$cookie.get('openId'),
                                deviceId: _t.addEdit.deviceId.trim(), //	设备编号
                                model: _t.addEdit.model, //		设备型号
                                appVersion:_t.addEdit.appVersion,
                                licence:_t.addEdit.licence,
                                factoryId: _t.addEdit.factoryName,
                                companyName: _t.addEdit.companyName
                            };
                            var filename = api.DEVICE_ADD + getDataTime() + '.json';
                            var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
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
                        }else {
                            _t.alertDialogTip(_t, '输入设备编号格式错误!')
                        }
                    }
                })
            },
            getData() {
                // 查询功能
                var _t = this;
                _t.$store.commit('set_loading', true);
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                   // page: 'device',
                    openId: _t.$cookie.get('openId'),
                    status:_t.formItem.deviceStatus?_t.formItem.deviceStatus:null,
                    licence:_t.formItem.licence?_t.formItem.licence: null,
                    companyName:_t.formItem.manufacturer?_t.formItem.manufacturer: null,
                    deviceId:_t.formItem.equipmentNumber?_t.formItem.equipmentNumber: null,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.DEVICE_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.tableData = JSON.parse(res.bizContent).data? JSON.parse(res.bizContent).data:[];
                        var pages = JSON.parse(res.bizContent).totalCount;
                        _t.options.total = pages ? pages : 0;
                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },
            importHandle() {
                // 批量导入
                this.allAddVisible = true;
            },
            allamendData() {
                // 批量导入 保存
                var _t = this;
                const ArrList = []
                var text =''
                if (_t.addEdit.textarea) {
                    _t.addEdit.textarea.split(";").forEach(item => {
                        if (item.trim() !== "") {
                            text = item.split(',')[0]+','+item.split(',')[0].split('@')[1]+ ','+ item.split(',')[1]
                            ArrList.push(text)
                        }
                    })
                    const params = {
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                        list: ArrList // 数组
                    };
                    var filename = api.DEVICE_IMPORT + getDataTime() + '.json';
                    var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.alertMessageTip(_t, res.errorMsg);
                            _t.getData();
                            _t.resetCode();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg);
                            _t.resetCode();
                        }
                    })
                } else {
                    _t.alertDialogTip(_t, '你保存内容为空！');
                }

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
    .el-textarea /deep/ .el-textarea__inner {
        height: 100%;
    }

    .el-textarea {
        height: 250px;
    }

    /deep/ textarea::-webkit-input-placeholder {
        color: red;
    }

    /deep/ textarea:-moz-placeholder {
        color: red;
    }

    /deep/ textarea::-moz-placeholder {
        color: red;
    }

    /deep/ textarea:-ms-input-placeholder {
        color: red;
    }

    .upload-demo {
        display: inline-block;
        position: relative;
    }
</style>
