<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="文件名：">
                    <el-input @keyup.enter.native="getData" size="mini" clearable  v-model="formItem.name"
                              placeholder="请输入文件名"></el-input>
                </el-form-item>
                <el-form-item label="版本类型：" prop="versionType">
                    <el-select size="mini" clearable v-model="formItem.versionType" filterable placeholder="请选择版本类型">
                        <el-option label="测试版本" value="0"></el-option>
                        <el-option label="正式版本" value="1"></el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="是否强制升级：" prop="versionType">-->
<!--                    <el-select size="mini" clearable v-model="formItem.gradeType" filterable placeholder="请选择升级类型">-->
<!--                        <el-option label="强制升级" value="1"></el-option>-->
<!--                        <el-option label="非强制升级" value="2"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="blueBtn" size="mini" round @click="upData">上传</el-button>
                    <el-button class="redBtn" size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="name" label="文件名称" header-align="center" align="center"/>
                <el-table-column prop="version" label="版本" header-align="center" align="center"/>
                <el-table-column prop="ossKey" label="ossKey" header-align="center" align="center"/>
                <el-table-column label="厂商" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.factory">{{scope.row.factory}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="versionType" label="版本类型" header-align="center" align="center"/>
                <el-table-column prop="appClientType" label="APP类型" header-align="center" align="center"/>
                <el-table-column  label="状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditStatus == '1'">未审核</span>
                        <span v-else>已审核</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button  v-if="scope.row.auditStatus == '1'" class="blueTableBtn" size="mini" round @click="audit(scope.row)">审核</el-button>
                        <span v-else>-</span>
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
        <el-dialog
            append-to-body
            top="13vh"
            width="60%"
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="cancelUpdata"
            :visible.sync="upDataVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">上传文件</span>
            </div>

            <div v-loading="loading"
                 element-loading-text="正在处理，请耐心等候。。。"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="#fff" style="margin-left: 30px">
                <div class="updateFile">
                    <div style="margin-left: -30px" class="steps">
                        <el-steps :active="stepsNumber" align-center finish-status="success">
                            <el-step title="选择上传文件"></el-step>
                            <el-step title="选择信息"></el-step>
                        </el-steps>
                    </div>
                </div>
                <el-form style="margin-top: 50px" :model="upDataForm" v-show='steps1' :rules="rules" ref="steps1"
                         label-width="215px">
                    <el-form-item label="上传文件：">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            multiple
                            accept=".udf"
                            :limit="1"
                            action="#"
                            :on-remove="codeRemove"
                            :on-change="codeChange"
                            :with-credentials="true"
                            :http-request="httpRequest"
                            :auto-upload="false"
                            drag
                            :data="upDataForm">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <!--                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 50px" v-show='steps2'>
                    <el-form :model="upDataForm" :rules="rules" ref="upDataForm" label-width="180px">
                        <el-form-item label="APP类型：" prop="appClientType">
                            <el-select clearable v-model="upDataForm.appClientType" filterable placeholder="请选择APP类型">
                                <el-option label="阿里APP" value="1"></el-option>
                            </el-select>
                        </el-form-item>
<!--                        <el-form-item label="APP服务端版本号：" prop="serverVersion">-->
<!--                            <el-input clearable maxlength="50" v-model="upDataForm.serverVersion"-->
<!--                                      placeholder="请输入APP服务端版本号"></el-input>-->
<!--                        </el-form-item>-->
                        <el-form-item label="版本号：" prop="version">
                            <el-input clearable maxlength="50" v-model="upDataForm.version"
                                      placeholder="请输入版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="厂商：" prop="factory">
                            <el-select clearable v-model="upDataForm.factory" filterable placeholder="请选择厂商">
                                <el-option label="北京无限感测科技有限公司" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本类型：" prop="versionType">
                            <el-select clearable v-model="upDataForm.versionType" filterable placeholder="请选择版本类型">

                                <el-option label="测试版本" value="0"></el-option>
                                <el-option label="正式版本" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否强制升级：" prop="gradeType">
                            <el-radio-group v-model="upDataForm.gradeType" size="small">
                                <el-radio label="1" border>强制升级</el-radio>
                                <el-radio label="2" border>非强制升级</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="upDataForm.description">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-progress v-show="progress" :stroke-width="16" status="success" :text-inside="true" style="margin-left: 50px" :percentage="progressPercent"></el-progress>

            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="cancelUpdata">取消</el-button>
                <el-button v-show="steps2" class="blueTableBtn" size="medium" round @click="updataADD">保存</el-button>
                <el-button v-show="steps1" class="blueTableBtn steps1" size="medium" round @click="updataSave">下一步
                </el-button>
            </div>
        </el-dialog>
        <!--        审核-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="cancelAudit"
            :visible.sync="auditVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">SDK管理-审核</span>
            </div>
            <el-form :model="auditForm" label-width="80px">
                <el-form-item label="描述：">
                    <el-input
                        autosize
                        disabled
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="auditForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="cancelAudit">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="auditADD">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import api from '../../uitls/api/device'
    import https from "axios";
    import axios from "axios";

    export default {
        name: "SDKManage",
        data() {
            return {
                auditForm: {
                    description:'',
                    id:''
                },
                auditVisible:false,
                progress: false,
                progressPercent:0,
                stepsNumber: 1,
                steps1: true,
                steps2: false,
                steps3: false,
                loading: false,
                rules: {
                    versionType: [
                        {required: true, message: '请选择版本类型', trigger: 'change'}
                    ],
                    appClientType: [
                        {required: true, message: '请选择APP类型', trigger: 'change'}
                    ],
                    gradeType: [
                        {required: true, message: '是否强制升级', trigger: 'change'}
                    ],
                    factory: [
                        {required: true, message: '请选择厂商', trigger: 'change'}
                    ],
                    serverVersion: [
                        {required: true, message: '请输入APP服务端版本号', trigger: 'blur'}
                    ],
                    version: [
                        {required: true, message: '请输入版本号', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入描述', trigger: 'change'}
                    ],
                    fileName: [
                        {required: true, message: '请输入文件名', trigger: 'blur'}
                    ],
                },
                formItem: {
                    version: '',
                    name: '',
                    versionType: '',
                    gradeType: '',
                    appClientType: '',
                },
                uploadFile: null,
                upDataForm: {
                    fileName: '',
                    factory: '',
                    serverVersion: '',
                    fileStr: '',
                    gradeType: '',
                    appClientType: '',
                    versionType: '',
                    name: '',
                    version: '',
                    description: ''
                },
                tempToken: '',
                ossKey: '',
                upDataVisible: false,
                tableData: [],
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
            // 审核取消
            cancelAudit () {
                this.auditVisible = false;
            },
            audit (row) {
                this.auditForm.id = row.id
                this.auditForm.description = row.description
                this.auditVisible = true;
            },
            //
            auditADD () {
                var _t = this
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    id: _t.auditForm.id
                };
                var filename = api.SDK_AUDIT + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.getData()
                        _t.auditVisible = false;
                        _t.alertMessageTip(_t, res.errorMsg)
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            codeChange(file, fileList) {
                var _t = this;
                _t.upDataForm.fileName = file.name
                const size = file.size / 1024 / 1024 > 0.1 ? `(${(file.size / 1024 / 1024).toFixed(1)}M)` : `(${(file.size / 1024).toFixed(1)}KB)`
                file.name.indexOf('M') > -1 || file.name.indexOf('KB') > -1 ? file.name : file.name += size
                _t.uploadFile = fileList
                _t.loading = true
                const params = {
                    openId: _t.$cookie.get('openId'),
                    fileName: _t.upDataForm.fileName
                };
                var filename = api.TOKEN_GAIN + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.loading = false
                        var token = JSON.parse(res.bizContent).accessToken
                        if (token) {
                            _t.tempToken = token;
                        }
                    } else {
                        _t.loading = false
                        _t.$refs.upload.clearFiles()
                        _t.alertDialogTip(_t, res.errorMsg);

                    }
                })
            },
            codeRemove(file, fileList) {
                this.uploadFile = null
                this.tempToken = ''
            },
            httpRequest(param) {
                var _t = this
                _t.progress = true
                let fd = new FormData()// FormData 对象

                fd.append('file', param.file)// 文件
                fd.append('tempToken', _t.tempToken)
                fd.append('path', 'sdk')
                fd.append('openId', _t.$cookie.get('openId'))
                var url = "https://" + location.hostname + '/csc/upload'
                axios.post(url, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data', withCredentials: true, upData: true,
                        openId: _t.$cookie.get('openId'),
                        accessToken: _t.$cookie.get('accessToken'),
                    }
                }).then(function (res) {
                    if (res.status == 200) {
                        _t.loading = false;
                        _t.steps1 = false;
                        _t.steps2 = true;
                        _t.progress = false
                        _t.ossKey = res.data;
                        _t.alertMessageTip(_t, '成功');
                    }
                }).catch(err => {
                    _t.loading = false;
                    _t.progress = false
                    _t.$refs.upload.clearFiles()
                    _t.alertDialogTip(_t, err.response.data.message);
                })
            },
            //上传取消
            cancelUpdata() {
                this.upDataVisible = false;
                this.$refs.upload.clearFiles()
                this.upDataForm.fileName = '';
                this.tempToken = '';
                this.stepsNumber = 1;
                this.progressPercent = 0;
                this.steps1 = true;
                this.steps2 = false;
                this.steps3 = false;
                this.progress = false;
                this.loading = false;
                this.upDataForm.fileStr = '';
                this.upDataForm.gradeType = '';
                this.upDataForm.appClientType = '';
                this.upDataForm.versionType = '';
                this.upDataForm.serverVersion = '';
                this.upDataForm.name = '';
                this.upDataForm.version = '';
                this.upDataForm.description = '';
                this.uploadFile = null
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            updataADD() {
                var _t = this;

                _t.$refs.upDataForm.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            fileName: _t.upDataForm.fileName,
                            ossKey: _t.ossKey,//osskey
                            version: _t.upDataForm.version,
                            factory: _t.upDataForm.factory,
                            appClientType: _t.upDataForm.appClientType,// app类型
                            serverVersion: _t.upDataForm.serverVersion,//APP服务端版本号
                            versionType: _t.upDataForm.versionType,//版本类型
                            gradeType: _t.upDataForm.gradeType,//是否强制升级
                            description: _t.upDataForm.description//描述
                        };
                        var filename = api.SDK_ADD + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.cancelUpdata()
                                _t.getData()
                                _t.alertMessageTip(_t, res.errorMsg)
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 步骤2上传保存
            updataSave() {

                if (this.uploadFile && this.tempToken) {
                    this.loading = true
                    this.$refs.upload.submit();
                } else {
                    this.alertDialogTip(this, '请你重新上传文件');
                    return false
                }


            },
            upData() {
                this.upDataVisible = true;
            },
            // 重置
            resetHandle() {
                this.formItem.version = '';
                this.formItem.name = '';
                this.formItem.versionType = '';
                this.formItem.gradeType = '';
                this.formItem.appClientType = '';
                this.getData();
            },
            getData() {
                // 查询
                var _t = this
                const params = {
                    name: _t.formItem.name,
                    versionType: _t.formItem.versionType,
                    gradeType: _t.formItem.gradeType,
                    appClientType: _t.formItem.appClientType,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.SDK_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('/api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
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
            this.$store.commit('set_loading', false);
            this.getData()
        }
    }
</script>

<style scoped>

</style>
