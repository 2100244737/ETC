<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="文件名：">
                    <el-input @keyup.enter.native="getData" size="mini" clearable v-model="formItem.name"
                              placeholder="请输入文件名"></el-input>
                </el-form-item>
                <el-form-item label="版本类型：" prop="versionType">
                    <el-select size="mini" clearable v-model="formItem.versionType" filterable placeholder="请选择版本类型">
                        <el-option label="测试版本" value="0"></el-option>
                        <el-option label="正式版本" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否强制升级：" prop="versionType">
                    <el-select size="mini" clearable v-model="formItem.gradeType" filterable placeholder="请选择升级类型">
                        <el-option label="强制升级" value="1"></el-option>
                        <el-option label="非强制升级" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <!--                <el-form-item label="APP类型：" prop="appClientType">-->
                <!--                    <el-select size="mini" clearable v-model="formItem.appClientType" filterable placeholder="请选择APP类型">-->
                <!--                        <el-option label="阿里APP" value="1"></el-option>-->
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
                <el-table-column prop="name" label="名称" header-align="center" align="center"/>
                <el-table-column prop="version" label="版本" header-align="center" align="center"/>
                <el-table-column prop="ossKey" label="ossKey" header-align="center" align="center"/>
                <el-table-column prop="versionType" label="版本类型" header-align="center" align="center"/>
                <el-table-column prop="appClientType" label="APP类型" header-align="center" align="center"/>


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
            <div class="updateFile">
                <div class="steps">
                    <el-steps :active="stepsNumber" align-center finish-status="success">
                        <el-step title="获取凭证"></el-step>
                        <el-step title="选择上传文件"></el-step>
                        <el-step title="选择信息"></el-step>
                    </el-steps>
                </div>
            </div>
            <div style="margin-top: 50px" v-show='steps1'>
                <el-form :model="upDataForm" :rules="rules" ref="steps1" label-width="100px">
                    <el-form-item label="文件名：" prop="fileName">
                        <el-input clearable v-model="upDataForm.fileName" @keyup.enter.native="getKey" placeholder="请输入文件名"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div  v-loading="loading"
                  element-loading-text="正在上传，请耐心等候。。。"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="#fff" style="margin-top: 50px" v-show='steps2'>
                <el-form :model="upDataForm" :rules="rules" ref="steps2" label-width="245px">
                    <el-form-item label="上传文件：">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            multiple
                            accept=".apk,.udf"
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
            </div>
            <div style="margin-top: 50px" v-show='steps3'>
                <el-form :model="upDataForm" :rules="rules" ref="upDataForm" label-width="150px">
                    <el-form-item label="APP类型：" prop="appClientType">
                        <el-select clearable v-model="upDataForm.appClientType" filterable placeholder="请选择APP类型">
                            <el-option label="阿里APP" value="1"></el-option>
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

            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="cancelUpdata">取消</el-button>
                <el-button v-show="steps3" class="blueTableBtn" size="medium" round @click="updataADD">保存</el-button>
                <el-button v-show="steps1" class="blueTableBtn steps1" size="medium" round @click="getKey">下一步
                </el-button>
                <el-button v-show="steps2" class="blueTableBtn steps2" size="medium" round @click="updataSave">下一步
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import api from '../../uitls/api/device'
    import axios from "axios";

    export default {
        name: "appManage",
        data() {
            return {
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

                    fileStr: '',
                    gradeType: '',
                    appClientType: '',
                    versionType: '',
                    name: '',
                    version: '',
                    description: ''
                },
                tempToken: '',
                ossKey:'',
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
            // 步骤一： 获取key 值
            getKey() {
                var _t = this;

                _t.$refs.steps1.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            fileName: _t.upDataForm.fileName
                        };
                        var filename = api.TOKEN_GAIN + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {

                                var token = JSON.parse(res.bizContent).accessToken
                                if (token) {
                                    _t.tempToken = token;
                                    _t.steps1 = false;
                                    _t.steps2 = true;
                                    _t.stepsNumber = 2
                                }
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);

                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            codeChange(file, fileList) {
                this.uploadFile = fileList
            },
            codeRemove(file, fileList) {
                this.uploadFile = null
            },
            httpRequest(param) {
                var _t = this
                let fd = new FormData()// FormData 对象
                console.log(param);
                fd.append('file', param.file)// 文件
                fd.append('tempToken', _t.tempToken)
                fd.append('path', 'app')
                fd.append('openId', _t.$cookie.get('openId'))

                axios.post('http://10.10.10.155:10081/csc/upload', fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data', withCredentials: true, upData: true,
                        openId: _t.$cookie.get('openId'),
                        accessToken: _t.$cookie.get('accessToken'),
                    }
                }).then(function (res) {
                    if (res.status == 200) {
                        _t.steps2= false;
                        _t.steps3= true;
                        _t.ossKey = res.data;
                        _t.alertMessageTip(_t, '成功');
                    }
                }).catch(err => {
                    _t.loading =false;
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
                this.steps1 = true;
                this.steps2 = false;
                this.steps3 = false;
                this.loading =false;
                this.upDataForm.fileStr = '';
                this.upDataForm.gradeType = '';
                this.upDataForm.appClientType = '';
                this.upDataForm.versionType = '';
                this.upDataForm.name = '';
                this.upDataForm.version = '';
                this.upDataForm.description = '';
                this.uploadFile = null
                this.resetForm('steps1')

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
                            appClientType:  _t.upDataForm.appClientType,// app类型
                            versionType:  _t.upDataForm.versionType,//版本类型
                            gradeType:  _t.upDataForm.gradeType,//是否强制升级
                            description:  _t.upDataForm.description//描述
                        };
                        var filename = api.APP_ADD + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.cancelUpdata()
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

                if (this.uploadFile) {
                    this.loading =true
                    this.$refs.upload.submit();
                } else {
                    this.alertDialogTip(this, '请你选择上传文件');
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
                    version: _t.formItem.version,
                    name: _t.formItem.name,
                    versionType: _t.formItem.versionType,
                    gradeType: _t.formItem.gradeType,

                    appClientType: _t.formItem.appClientType,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = api.APP_PAGE + getDataTime() + '.json';
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
