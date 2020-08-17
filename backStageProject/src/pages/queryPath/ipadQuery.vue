<template>
    <div>
        <div id="formBox-top" class="formBox-top">
            <el-form :rules="rules" ref=pathForm :model="dataList" class="clearFix"  inline>
                <el-form-item label="车牌号"  prop="carNumber">
                    <el-input @keyup.enter.native="getData" clearable size="mini" class="input"  @input="toUpperCode(dataList.carNumber)" v-model="dataList.carNumber" placeholder="请输入车牌号"></el-input>
                </el-form-item>
                <el-form-item label="上传时间" prop="time">
                    <el-date-picker size="mini" v-model="dataList.time" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="车牌颜色" prop="color">
                    <el-select size="mini" clearable v-model="dataList.color" placeholder="车牌颜色">
                        <el-option label="蓝色" value="0"></el-option>
                        <el-option label="黄色" value="1"></el-option>
                        <el-option label="黑色" value="2"></el-option>
                        <el-option label="白色" value="3"></el-option>
                        <el-option label="渐变绿色" value="4"></el-option>
                        <el-option label="黄绿双拼色" value="5"></el-option>
                        <el-option label="蓝白渐变色" value="6"></el-option>
                        <el-option label="临时牌照" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button   size="mini" round class="button yellowBtn marginLift2" @click="getData">查询</el-button>
                    <el-button  class="blueBtn showBtn"  size="mini" round v-show="showBtn" @click="stopMap">
                        关闭地图
                    </el-button>
                    <el-button class="blueBtn"  size="mini" round v-show="logBtn"  @click="stoplog">
                        关闭日志
                    </el-button>
                    <el-button class="redBtn"  size="mini" round @click="resetHandle">重置</el-button>

                </el-form-item>
            </el-form>
        </div>
        <div v-show="tableShow" class="tableWp marginTop2">
            <el-table :data="tableData" size="small" stripe>
                <el-table-column prop="plateNum" label="车牌号" header-align="center" align="center"/>
                <el-table-column label="上传时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.insertTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column  label="计费时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.enTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column  label="金额(元)" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="changeMoney(scope.row.fee)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round @click="lookMap(scope.row)">查看地图</el-button>
                        <el-button class="blueTableBtn" size="mini" round @click="lookLog(scope.row)">查看日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-show="logShow" class="tableWp marginTop2">
            <el-table :data="logShowData" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="fileName" label="数据名称" header-align="center" align="center"/>
                <el-table-column label="操作"  header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="blueTableBtn" size="mini" round  @click="looklook(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="dialogTableVisible">
            <span slot="footer" class="dialog-footer">
            </span>
        </el-dialog>
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="clear"
            top="8vh"
            :visible.sync="dialogTableVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">详情查看</span>
            </div>
            <json-viewer
                class="json-viewer"
                :value="json"
                :expand-depth="5"
                :copyable="{copyText: '点击复制', copiedText: '复制成功', timeout: 1000}"
                sort
            ></json-viewer>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="clear">关闭</el-button>
                <el-button class="blueTableBtn" size="medium" round  @click="download">下载</el-button>
            </div>
        </el-dialog>
        <div v-if="show"  class="iframe marginTop2">
            <iframe  id="iframepage"  src="/device/html/static/ipadQuery.html" width="100%"
                     height="600px"
                   frameborder="0" ></iframe>
        </div>
    </div>
</template>
<!--/static/view.html-->
<script>

    import api from '../../uitls/api/BillingLog'
    import {getDataTime} from '@/assets/js/time'
    import Jsondata from './api.json'
    export default {
        name: 'ipadQuery',
        data() {
            return {
                src:'',
                pagesShow: true,
                logShow: false, // 查看日志
                logBtn: false, // 关闭日志
                tableData: [],// 表格数据
                logShowData: [], //
                dataList: {
                    color: '',
                    time: '', // 上传时间
                    entrance: '', // 入口时间
                    carNumber: '',
                },
                rules: {
                    carNumber: [
                        {required: true, message: '请输入车牌号', trigger: 'blur'},
                    ],
                },

                show: false,
                tableShow: true,
                showBtn: false,
                dialogTableVisible: false,
                json: '',
                jsonName: '',
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        components: {

        },
        mounted() {
            let that = this;
            window.addEventListener("message", function(e) {
                if(!e.data) {
                    that.show = e.data
                    that.showBtn = e.data
                    that.tableShow = true;
                }
            });
        },
        methods: {
            //分转元
            changeMoney(num) {
                var regexp = /(?:\.0*|(\.\d+?)0+)$/
                if (num > 1000000) {
                    num = JSON.stringify(num).slice(0, JSON.stringify(num).length - 4) / 100
                    return num + '万'
                } else {
                    num = (num / 100).toFixed(2)
                    num = num.replace(regexp, '$1')
                    return num
                }
            },
            settime (row) {
                // 编辑 table 时间
                return   row.replace("T", ' ')
            },
            toUpperCode (val) {
                this.dataList.carNumber =  val.toUpperCase()
            },
            download() {
                var _t = this;
                const content = JSON.stringify(_t.json);
                const blob = new Blob([content]);
                const fileName =   _t.jsonName + ".json";
                if ("download" in document.createElement("a")) {
                    // 非IE下载
                    const elink = document.createElement("a");
                    elink.download = fileName;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
            },
            copy() {

            },
            onCopy() {
                // copy 成功
                this.$message({
                    message: '复制成功',
                    type: 'success',
                    offset: 200
                });
            },
            onError() {
                // copy 失败
                this.$message({
                    message: '复制失败',
                    type: 'warning',
                    offset: 200
                });
            },
            clear() {
                //  关闭
                this.json = ''
                this.dialogTableVisible = false; //
            },
            looklook(row) {
                // 查看JOSN
                var _t = this;
                _t.jsonName = row.fileName

                const params = {
                    openId: _t.$cookie.get('openId'),
                    fileId: row.fileId
                }
                var fileName = api.DEVLOG_JSON +getDataTime()+'.json'
                var data = _t.changeData(params, fileName, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (response) {
                    if (response.statusCode != 0) {
                        _t.$confirm(response.errorMsg, '查询JSON失败', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }else {
                        _t.dialogTableVisible = true; //
                        const data = JSON.parse(response.bizContent)
                        _t.json = JSON.parse(data.jsonStr)
                    }
                })

            },
            stoplog() {
                var _t = this;
                _t.logShow = false;
                _t.logBtn = false;
                _t.tableShow = true;
                _t.pagesShow = true
            },
            lookLog(row) {
                // 查看日志
                var _t = this;

                _t.tableShow = false;
                _t.logBtn = true;
                const params = {
                    openId: _t.$cookie.get('openId'),
                    enTime: row.enTime,
                    plateNum: row.plateNum,
                    plateColor: row.plateColor, // 转Number
                    insertTime: row.insertTime
                }
                var fileName = api.DEVLOG_DETAIL +getDataTime()+'.json'
                var data = _t.changeData(params, fileName, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (response) {
                    if (response.statusCode != 0) {
                        _t.alertDialogTip(_t, response.errorMsg)
                        _t.logBtn = false;
                        _t.logShow = false;

                        _t.tableShow = true;
                    } else {
                        _t.logShow = true;
                        const data = JSON.parse(response.bizContent)
                        _t.logShowData = data.uploadModels
                    }
                })
            },
            stopMap() {
                // 关闭地图
                this.showBtn = false;
                this.tableShow = true;
                this.show = false;
                sessionStorage.removeItem("ipadJSON")
            },
            resetHandle() {
                var _t = this;
                _t.show = false;
                _t.showBtn = false;
                _t.tableShow = true;
                sessionStorage.removeItem("JSON")
                _t.dataList.color = "";
                _t.dataList.time = ""; // 上传时间
                _t.dataList.entrance = ""; // 入口时间
                _t.dataList.carNumber = "";
                _t.dialogTableVisible = false; //
                _t.logBtn = false; //
                _t.logShow = false; //
                _t.json = ''
                _t.pagesShow = true
                _t.tableData = []
            },
            getData() {
                var _t = this;
                // 查询数据
                _t.$refs.pathForm.validate((valid) => {
                    if (valid) {
                        // 提交
                        _t.show = false;
                        _t.tableShow = true;
                        _t.showBtn = false;
                        _t.logShow = false;
                        _t.logBtn = false;
                        const params = {
                            openId: _t.$cookie.get('openId'),
                            plateNum: _t.dataList.carNumber.trim(), // 车牌号
                            plateColor: _t.dataList.color, // 车牌颜色
                            uploadTime: _t.dataList.time, // 上传时间
                        };
                        var filename = api.DEVLOG_PAGE + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.tableData = JSON.parse(res.bizContent).data
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    }
                })
            },
            lookMap(row) {
                //查看地图
                var _t = this
                sessionStorage.removeItem("ipadJSON");
                _t.show = false;
                _t.showBtn = true;
                _t.$store.commit('set_loading', true);
                const time = row.enTime.replace(/:/g, "-");

                var t1 = row.insertTime.split('T')

                const params = {
                    openId: _t.$cookie.get('openId'),
                    fileId: t1[0]+ "/" + time + "_" + row.plateNum + '_' + row.plateColor
                }
                var fileName = api.DEVLOG_MAP + getDataTime() +'.json'
                var data = _t.changeData(params, fileName, _t.$cookie.get('accessToken'));
                // https://device.cywetc.com/fcs/api/json
                _t.$api.post('api/json', data, function (response) {
                    if (response.statusCode != 0) {
                        _t.alertDialogTip(_t, response.errorMsg)
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.showBtn = false
                    } else {
                        if (response.bizContent) {
                            setTimeout(() => {
                                _t.$store.commit('set_loading', false);
                            }, 500);
                            _t.tableShow = false;
                            const data = JSON.parse(response.bizContent).data
                            sessionStorage.setItem("ipadJSON", JSON.stringify(data))
                            _t.show = true
                        } else {
                            setTimeout(() => {
                                _t.$store.commit('set_loading', false);
                            }, 500);
                            _t.showBtn = false
                            _t.alertDialogTip(_t, '此文件无法查看地图')
                        }

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

            this.$store.commit('set_loading', true);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);

        }
    }
</script>

<style scoped>
    /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 180px;/*no*/
    }
    .text {
        font-size: 14px;
    }
  .json-viewer {
      max-height: 60vh;
      overflow-y: auto;
  }
    .item {
        padding: 18px 0;
    }

</style>

