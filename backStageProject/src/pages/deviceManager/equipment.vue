<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="设备编号：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150"
                              v-model="formItem.equipmentNumber" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="厂商：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150"
                              v-model="formItem.factoryName" placeholder="请输入厂商名"></el-input>
                </el-form-item>
                <el-form-item label="使用单位：">
                    <el-input size="mini" @keyup.enter.native="getData" clearable maxlength="150"
                              v-model="formItem.buyerName" placeholder="请输入使用单位"></el-input>
                </el-form-item>

                <el-form-item label="备案时间：">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        size="mini"
                        v-model="formItem.insertDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn" size="mini" round @click="setAddHandle">添加</el-button>
                    <el-button class="blueBtn" size="mini" round @click="importHandle">批量导入</el-button>
                    <el-button class="redBtn" size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" ref="table" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="deviceId" label="设备编号" header-align="center" align="center"/>
                <el-table-column prop="factoryName" label="厂商" header-align="center" align="center"/>
                <el-table-column label="使用单位" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.buyerName">{{scope.row.buyerName}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column width="180px" label="备案时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.insertTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="290px" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="details(scope.row)">详情</el-button>
                        <el-button v-if="scope.row.status =='0'" class="blueTableBtn" size="mini" round
                                   @click="designateUnit(scope.row)">选定使用单位
                        </el-button>
                        <el-button class="redTableBtn" v-if="scope.row.roleName =='1'" size="mini" round
                                   @click="deleteDevice(scope.row)">删除
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
            center
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案-添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addDevice" label-width="150px">
                <el-form-item label="设备编号：" prop="deviceId">
                    <el-input clearable maxlength="50" v-model="addEdit.deviceId" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备型号：">
                    <el-input maxlength="150" v-model="addEdit.model" placeholder="请输入设备型号"></el-input>
                </el-form-item>
                <el-form-item label="客户单位名称：" prop="companyName">
                    <el-input maxlength="150" v-model="addEdit.companyName" placeholder="请输入客户单位名称"></el-input>
                </el-form-item>
                <el-form-item label="厂商：" v-if=" this.$cookie.get('roleName') == '1'">
                    <el-select
                        clearable
                        v-model="addEdit.factoryName">
                        <el-option v-for="(item,index) in factoryList " :key="index" :label="item.name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="LICENSE授权码：" prop="licence">
                    <el-input maxlength="150" v-model="addEdit.licence" placeholder="请输入LICENSE授权码"></el-input>
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
                <span class="title">设备备案-选定使用单位</span>
            </div>
            <el-form :model="designate" :rules="rules" ref="designate" label-width="140px">
                <el-form-item label="客户单位名称：" prop="unitName">
                    <el-input clearable maxlength="50" v-model="designate.unitName" placeholder="请输入客户单位名称"></el-input>
                </el-form-item>
                <el-form-item label="设备编号：">
                    <el-input disabled maxlength="50" v-model="designate.deviceId" placeholder="请输入设备编号"></el-input>
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
            width="80%"
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resedata"
            :visible.sync="allAddVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案-批量导入</span>
            </div>
            <el-form :model="addEdit" ref="addEdit" label-width="26px">
                <el-form-item>
                    <el-upload
                        ref="upload"
                        class="upload-demo"
                        action="#"
                        accept=".csv, .CSV"
                        :on-change="handleChange"
                        :http-request="Upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :before-upload="BeforeUpload">
                        <el-button class="blueTableBtn" size="mini" round>点击上传</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传csv文件格式，且不超过1M <span style="margin-left: 5px; color: red"> '请按以下格式输入相关信息：'设备编号,设备型号,客户单位名称,厂商,LICENSE授权码;'每条数据以英文逗号分隔字段，以分号结尾换行，最多支持导入100条数据。'</span></div>
                    </el-upload>
                </el-form-item>
                <el-table :data="newTableData"  ref="table" size="small" stripe>
                    <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                    <el-table-column prop="device" label="设备编号" header-align="center" align="center"/>
                    <el-table-column prop="factoryName" label="厂商" header-align="center" align="center"/>
                    <el-table-column label="使用单位" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.buyerName">{{scope.row.buyerName}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="license" label="授权码" header-align="center" align="center"/>
                    <el-table-column  label="状态" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.pass? 'success-row': 'warning-row'">{{scope.row.msg}}</span>
                        </template>
                    </el-table-column>
                </el-table>
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
                <span class="title">设备备案-详情</span>
            </div>
            <el-form :model="detailsData" ref="addEdit" label-width="120px">
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
                                <el-input :disabled="true" v-model="detailsData.buyerName"
                                          placeholder="使用单位"></el-input>
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
                                <el-input :disabled="true" v-model="detailsData.insertTime"
                                          placeholder="添加时间"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="芯片编号：">
                            <el-tooltip :content="detailsData.seNo" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.seNo" placeholder="设备编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="状态更新时间：">
                            <el-tooltip :content="detailsData.insertTime" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.updateTime"
                                          placeholder="添加时间"></el-input>
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
                newTableData: [],//  表格数据
                addVisible: false, // 添加设备显示
                allAddVisible: false, // 批量加载显示
                detailsVisible: false, // 详情
                // 表单数据
                formItem: {
                    equipmentNumber: '', // 设备编号
                    chipNumber: '', // 芯片编号
                    manufacturer: '', // 厂商
                    deviceStatus: '', // 设备状态
                    factoryName: '',//厂商
                    buyerName: '',// 使用单位
                    insertDate: '',
                },
                designate: {
                    deviceId: '',
                    unitName: ''
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
                        {required: true, message: '请输入客户单位名称', trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '请输入客户单位名称', trigger: 'blur'}
                    ],
                },
                factoryList: [],
                // 添加表单对象
                addEdit: {
                    deviceId: '',
                    model: '',
                    factoryName: '',
                    companyName: '',
                    sysVersion: '',
                    hardVersion: '',
                    appVersion: '',
                    licence: '',
                },
                allPass: true,
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
                fileList: [],
                newFile: '',
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
        computed: {},
        methods: {

            getUploadTable() {
                var _t = this;
                var newArr = []
                var ArrList = []
                var arr = []
                _t.newFile.split(";").forEach(item => {
                    if (item.trim() !== "") {
                        arr = item.split(",").join(',')
                        ArrList.push(arr)
                    }
                })
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    list: ArrList // 数组
                };
                var filename = api.DEVICE_IMPCHK + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        var list = JSON.parse(res.bizContent).list;
                        _t.allPass =  JSON.parse(res.bizContent).allPass
                        list.forEach(item => {
                            item.listArr = item.originalData.split(",")
                            item.device = item.listArr[0];
                            item.size = item.listArr[1];
                            item.buyerName = item.listArr[2];
                            item.factoryName = item.listArr[3];
                            item.license = item.listArr[4];

                        })
                        _t.newTableData = list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                        _t.resetCode();
                    }
                })
            },
            // 上传覆盖
            handleChange(file, fileList) {
                var _t = this
                if (fileList.length > 0) {
                    _t.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
                }
            },
            Upload(param) {
                var _t = this
                _t.upload = false;
                var reader = new FileReader()
                reader.onload = function (ect) {
                    _t.newFile = ect.target.result;
                    _t.getUploadTable()
                }
                reader.readAsText(param.file)
            },
            handlePreview(file) {
                console.log(888);
            },
            handleRemove(file, fileList) {
                this.newFile = '';
                this.allPass = true;
                this.newTableData= []
            },
            BeforeUpload(file, fileList) {
                var _t = this
                if (file) {
                    const extension = file.name.split('.')[1] === 'csv' || file.name.split('.')[1] === 'CSV';
                    if (!extension) {
                        _t.alertDialogTip(_t, '上传模板只能是 csv 格式!');
                        _t.fileList = []
                    }
                    const isLt2M = file.size / 1024 / 1024 < 1;
                    if (!isLt2M) {
                        _t.alertDialogTip(_t, '大小不能超过1M!');
                    }
                    return extension && isLt2M
                } else {
                    return false;
                }
            },
            // 获取厂商
            getFactoryName() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    companyType: '2'
                };
                var filename = api.COMPANY_LIST + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.factoryList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            designateUnit(row) {
                this.designateVisible = true
                this.designate.deviceId = row.deviceId
            },
            // 选定使用单位 取消
            resetDesignate() {
                this.designateVisible = false
                this.resetForm('designate')
            },
            // 选定单位保存
            designateData() {
                var _t = this;
                _t.$refs.designate.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            deviceId: _t.designate.deviceId.trim(), //	设备编号
                            companyName: _t.designate.unitName,
                        };
                        var filename = api.DEVICE_ASSIGN + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.designateVisible = false;
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            deleteDevice(row) {
                var _t = this;
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
            resedata() {
                // 批量导入取消
                this.addEdit.textarea = '';
                this.newFile = '';
                this.fileList = [];
                this.newTableData = [];
                this.allAddVisible = false;
                this.allPass = true;
            },
            settime(row) {
                // 编辑 table 备案时间
                return row.replace("T", ' ')
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
                this.formItem.factoryName = ''
                this.formItem.insertDate = ''
                this.formItem.buyerName = ''
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
                _t.detailsData.deviceId = row.deviceId; //	设备编号
                _t.detailsData.factory = row.factoryName; //	设备厂商
                _t.detailsData.status = row.status != 0 ? '已指定' : '未指定'; //	设备状态
                _t.detailsData.model = row.model ? row.model : '-'; //设备型号
                _t.detailsData.buyerName = row.buyerName ? row.buyerName : '-';
                _t.detailsData.seNo = row.seNo;
                _t.detailsData.openId = row.openId; //	操作人id
                _t.detailsData.insertTime = row.insertTime.replace("T", ' '); //	插入时间
                _t.detailsData.updateTime = row.updateTime.replace("T", ' '); //	更新时间

            },
            amendData() {
                // 添加保存
                var _t = this;

                _t.$refs.addDevice.validate((valid) => {
                    if (valid) {
                        if (_t.addEdit.deviceId.indexOf('@') != -1) {
                            const seNodata = _t.addEdit.deviceId.split('@')[1]
                            const params = {
                                accessToken: _t.$cookie.get('accessToken'),
                                openId: _t.$cookie.get('openId'),
                                deviceId: _t.addEdit.deviceId.trim(), //	设备编号
                                model: _t.addEdit.model, //		设备型号
                                appVersion: _t.addEdit.appVersion,
                                licence: _t.addEdit.licence,
                                factoryId: _t.addEdit.factoryName,
                                companyName: _t.addEdit.companyName
                            };
                            var filename = api.DEVICE_ADD + getDataTime() + '.json';
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
                                    // _t.resedata();
                                }
                            })
                        } else {
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
                    factoryName: _t.formItem.factoryName ? _t.formItem.factoryName : null,
                    insertDate: _t.formItem.insertDate ? _t.formItem.insertDate : null,
                    buyerName: _t.formItem.buyerName ? _t.formItem.buyerName : null,
                    deviceId: _t.formItem.equipmentNumber ? _t.formItem.equipmentNumber : null,
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.DEVICE_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        _t.tableData.forEach(item => {
                            item.roleName = _t.$cookie.get('roleName')
                        })
                        var pages = JSON.parse(res.bizContent).totalCount;
                        _t.options.total = pages ? pages : 0;
                    } else {
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

                if (_t.newTableData.length > 0) {

                    if(_t.allPass) {
                        _t.newTableData.forEach(item => {
                            ArrList.push(item.originalData)
                        })
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            list: ArrList // 数组
                        };
                        var filename = api.DEVICE_IMPORT + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resedata();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                     }else {
                        _t.alertDialogTip(_t, '请检查数据');
                        return false
                    }

                } else {
                    _t.alertDialogTip(_t, '你保存内容为空！,');
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

    .warning-row {
        color:  #EC4F52;
    }

      .success-row {
        color: #08B8D9;
    }
</style>
