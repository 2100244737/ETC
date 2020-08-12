<template>
    <div>
        <div class="formBox-top" >
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="文件名：">
                    <el-input size="mini" clearable  v-model="formItem.name"
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
                <el-form-item  class="fr">
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
            top="4vh"
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="cancelUpdata"
            :visible.sync="upDataVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">上传文件</span>
            </div>
            <el-form :model="upDataForm" :rules="rules" ref="upDataForm" label-width="150px">
                <el-form-item label="上传文件：" >
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
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="cancelUpdata">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="updataSave">保存</el-button>
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
                },
                formItem: {
                    version: '',
                    name: '',
                    versionType: '',
                    gradeType: '',
                    appClientType: '',
                },
                uploadFile:null,
                upDataForm: {
                    url: 'https://testgw.datasw.cn/api/json',
                    filename: '',

                    fileStr: '',
                    gradeType: '',
                    appClientType: '',
                    versionType: '',
                    name: '',
                    version: '',
                    description: ''
                },
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
            codeChange(file, fileList) {
                 this.uploadFile =  fileList
                 // this.$refs.upDataForm.clearValidate('file');
            },
            codeRemove (file, fileList) {
                this.uploadFile = null
            },
            httpRequest(param) {
                console.log(777);
                var _t = this
                let fd = new FormData()// FormData 对象
                fd.append('file', param.file)// 文件
                fd.append('jsonStr', JSON.stringify(_t.upDataForm))
                fd.append('businessType', 1)

                axios.post('http://10.10.10.155/device/upload', fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data', withCredentials: true, upData: true,
                        openId: _t.$cookie.get('openId'),
                        accessToken: _t.$cookie.get('accessToken'),
                    }
                }).then(function (res) {
                    if (res.status == 200) {
                        _t.upDataVisible = false;
                        console.log(res, 'res');
                        _t.cancelUpdata();
                        _t.alertMessageTip(_t, '成功');
                    }
                }).catch(err => {
                    this.alertMessageTip(this, err.response.data.message);
                    console.log(err.response.data.message, 'res');
                })
            },
            //上传取消
            cancelUpdata() {
                this.upDataVisible = false;
                this.$refs.upload.clearFiles()
                this.upDataForm.filename = '';
                this.upDataForm.fileStr = '';
                this.upDataForm.gradeType = '';
                this.upDataForm.appClientType = '';
                this.upDataForm.versionType = '';
                this.upDataForm.name = '';
                this.upDataForm.version = '';
                this.upDataForm.description = '';
                this.uploadFile = null
                this.resetForm('upDataForm')

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();

            },
            // 上传保存
            updataSave() {
                console.log(this.uploadFile,'124214');
                console.log(this.rules);
                if(this.uploadFile) {
                    this.$refs.upDataForm.validate((valid) => {
                        if (valid) {
                            this.$refs.upload.submit();
                        } else {
                            return false
                        }
                    })
                }else {
                    this.alertMessageTip(this, '请你选择上传文件');
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
