<template>
    <div>
        <div id="formBox-top"  class="formBox-top">
            <el-form :rules="rules" ref=pathForm :model="dataList" label-width="90px" inline>
                <el-form-item label="车牌号" prop="carNumber">
                    <el-input clearable class="input" v-model="dataList.carNumber"
                              @input="toUpperCode(dataList.carNumber)" placeholder="请输入车牌号"></el-input>
                </el-form-item>
                <el-form-item label="上传时间" prop="time">
                    <el-date-picker v-model="dataList.time" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <!--                <el-form-item label="入口时间" prop="entrance">-->
                <!--                    <el-input clearable class="input" v-model="dataList.entrance" placeholder="请输入口时间"></el-input>-->
                <!--                </el-form-item>-->
                <el-form-item label="车牌颜色" prop="color">
                    <el-select clearable v-model="dataList.color" placeholder="车牌颜色">
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
                <el-form-item>
                    <el-button class="button marginLift2" type="primary" @click="getData">查看</el-button>
                    <el-button class="showBtn" v-show="qqShow" type="danger" icon="el-icon-delete" @click="stopMap">
                        关闭地图
                    </el-button>
                    <el-button class="showBtn" v-show="logShow" type="danger" icon="el-icon-delete" @click="stoplog">
                        关闭日志
                    </el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div  v-show="tableShow" class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column prop="plateNum" label="车牌号" header-align="center" align="center"/>
                <el-table-column prop="uploadTime" label="上传时间" header-align="center" align="center"/>
                <el-table-column prop="enTime" label="入口时间" header-align="center" align="center"/>
                <el-table-column prop="msg" label="信息" header-align="center" align="center"/>
                <el-table-column label="操作" width="250px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="lookMap(scope.row)">查看地图</el-button>
                        <el-button size="mini" type="primary" @click="lookLog(scope.row)">查看日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="logShow" class="tableWp marginTop2">
            <el-table :data="logShowData">
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="fileName" label="数据名称" header-align="center" align="center"/>
                <el-table-column label="操作"  header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"  @click="looklook(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
            <!--            <pre>{{json}}</pre>-->
            <json-viewer
                class="json-viewer"
                :value="json"
                :expand-depth="5"
                :copyable="{copyText: '点击复制', copiedText: '复制成功', timeout: 1000}"
                sort
            ></json-viewer>
            <div slot="footer">
                <el-button @click="clear">关 闭</el-button>
                <el-button type="primary" @click="download">下载</el-button>
                <!--                <el-button v-clipboard:copy="json"-->
                <!--                           v-clipboard:success="onCopy"-->
                <!--                           v-clipboard:error="onError" type="primary" @click="copy">复制JSON-->
                <!--                </el-button>-->
            </div>
        </el-dialog>
        <div class="mapCollapse" >
<!--            <div class="collapse">-->
<!--                <el-collapse  accordion>-->
<!--                    <el-collapse-item v-for="(item, index) in collapseData" :key="item.id" :title="item.roadName" :name="item.id">-->
<!--                        <div>{{item.id}}</div>-->
<!--                    </el-collapse-item>-->
<!--                </el-collapse>-->
<!--            </div>-->

<!--            <div class="radio">-->
<!--                <h3>路径还原选择</h3>-->
<!--                <el-radio-group v-model="radio" @change="handlRadio(radio)">-->
<!--                    <el-radio v-for="(item, index) in radioList" :key="index" :label="index">路径{{index+1}}</el-radio>-->
<!--                </el-radio-group>-->
<!--            </div>-->
            <div class="iframe marginTop2">
                <iframe id="iframe"   src="/static/qqMap.html"
                       style="height:calc(100vh - 100px);"
                        width="100%" frameborder="0"></iframe>
            </div>
<!--            <div id="container" style="width:100%; height:600px"></div>-->
        </div>

    </div>
</template>
<script>
    import json from './api.json'
    import {getDataTime} from '@/assets/js/time'
    import appdata from './api.json'
    export default {
        name: "qqmap",
        data() {
            return {
                dialogTableVisible: false,
                dataList: {
                    color: '',
                    time: '', // 上传时间
                    entrance: '', // 入口时间
                    carNumber: '粤S5XB33',
                },
                json: '',
                tableShow: true,
                tableData: [],
                logShow: false,
                logShowData:[],
                collapseData:[],
                radio: 0,
                radioList: 0,
                //腾讯地图
                qqShow: false,
                map: null,
                getAddress: null,
                getAddCode: null,
                pathNull:[],
                pathADD: [],
                pathNONE: [],
                path: [],
                LatLng1: '39.892257',
                LatLng2: '116.395577',
                addressKeyword: "",
                pathData: [],
                pathDat2: [],
                rules: {
                    carNumber: [
                        {required: true, message: '请输入车牌号', trigger: 'blur'},
                    ],
                },
            }
        },
        components: {},
        mounted() {
            sessionStorage.setItem("QQMAPJSON", JSON.stringify(appdata))
        },
        watch: {},
        methods: {
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
            clear() {
                //  关闭
                this.json = ''
                this.dialogTableVisible = false; //
            },
            looklook(row) {
                var _t = this;
                _t.jsonName = row.fileName
                const params = {
                    fileId: row.fileId
                }
                var fileName = "FCS_LOG_FIND_REQ_99999917_"+getDataTime()+'.json'
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
            stopMap () {
                // 关闭地图
               this.qqShow = false
                this.logShow = false;
                this.tableShow = true
            },
            stoplog() {
              // 关闭查看日志
                this.qqShow = false
                this.logShow = false;
                this.tableShow = true
            },
            lookMap(row) {
                //查看地图
                var _t = this
                _t.qqShow = false
                _t.logShow = false;
                _t.tableShow = true
                _t.$store.commit('set_loading', true);
                const time = row.enTime.replace(/:/g, "-");
                const params = {
                    openId: _t.$cookie.get('openId'),
                    fileId: row.uploadTime + "/" + time + "_" + row.plateNum + '_' + row.plateColor
                }
                sessionStorage.removeItem("QQMAPJSON")
                var fileName = "FCS_MAP_FIND_REQ_99999925_" + getDataTime() +'.json'
                // https://device.cywetc.com/fcs/api/json
                var data = _t.changeData(params, fileName, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (response) {
                    if (response.statusCode != 0) {
                        _t.alertDialogTip(_t, response.errorMsg)
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.qqShow = false
                        _t.logShow = false;
                        _t.tableShow = true
                    } else {
                        if (response.bizContent) {
                            setTimeout(() => {
                                _t.$store.commit('set_loading', false);
                            }, 500);
                            const data1 = JSON.parse(response.bizContent)
                            _t.radioList  = json.result
                            // JSON.parse(sessionStorage.setItem("QQMAPJSON"))

                            sessionStorage.setItem("QQMAPJSON", JSON.stringify(json))

                            // _t.setData(0)

                            _t.qqShow = true
                            _t.tableShow = false
                        }
                    }
                })
            },
            lookLog(row) {
                //查看日志
                var _t = this;
                _t.qqShow = false
                _t.logShow = false;
                _t.tableShow = false
                const params = {
                    enTime: row.enTime,
                    plateNum: row.plateNum,
                    plateColor: row.plateColor, // 转Number
                    insertDate: row.uploadTime
                }
                var fileName = "FCS_LOG_LIST_REQ_99999925_"+getDataTime()+'.json'
                var data = _t.changeData(params, fileName, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (response) {
                    if (response.statusCode != 0) {
                        _t.$confirm(response.data.errorMsg, '查询日志失败', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        _t.qqShow = false
                        _t.logShow = false;
                        _t.tableShow = false
                    } else {
                        const data = JSON.parse(response.bizContent)
                        _t.logShowData = data.uploadModels
                         if( _t.logShowData.length == 0) {
                             _t.alertDialogTip(_t, '未查到相关数据')
                         }
                        _t.logShow = true;
                    }
                })
            },
            getData() {
                // 查询
                var _t = this;
                _t.$refs.pathForm.validate((valid) => {
                    if (valid) {
                        // 提交
                        _t.show = false;
                        _t.tableShow = true;
                        _t.showBtn = false;
                        _t.logShow = false;
                        _t.logBtn = false;
                        sessionStorage.removeItem("JSON")
                        const params = {
                            openId: _t.$cookie.get('openId'),
                            plateNum: _t.dataList.carNumber.trim(), // 车牌号
                            plateColor: _t.dataList.color, // 车牌颜色
                            uploadTime: _t.dataList.time, // 上传时间
                        };
                        var filename = "FCS_MAP_LOG_REQ_99999925_" + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.tableData = JSON.parse(res.bizContent).data
                                if(JSON.parse(res.bizContent).data.length == 0) {
                                    _t.alertDialogTip(_t, '未查到相关数据')
                                }
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    }
                })
            },
            handlRadio(val) {

                // this.setData(val)
            },
            // init() {
            //     var _t = this;
            //
            //     maps.init("PTSBZ-JLRCD-JLO4Y-HWVHK-XRTZV-FDFGM", () => {
            //         var myLatlng = new qq.maps.LatLng( this.path[0][1],this.path[0][0]);
            //         var myOptions = {
            //             zoom: 10,
            //             center: myLatlng,
            //             zoomControl: false,//缩放控件的初始启用/停用状态。
            //             panControl: false,         //平移控件的初始启用/停用状态。
            //             scaleControl: false        //滚动控件的初始启用/停用状态。
            //         };
            //         _t.map = new qq.maps.Map(
            //             document.getElementById("container"),
            //             myOptions
            //         );
            //         _t.cd()
            //     });
            // },
            // // 处理数据 并绘制
            // setData(val) {
            //     var link = json.result[val].links;
            //      var units = json.result[val].units;
            //      this.collapseData = units;
            //     var path = new Array();
            //      var k = 0;
            //     var pathNull = new Array(); // 无变化的点
            //     var k1 = 0;
            //     var pathNONE = new Array(); // 删除的点
            //     var k2 = 0;
            //     var pathADD = new Array();// 增补的点
            //     var k3 = 0;
            //     // for (var i = 0; i < link.length; i++) {
            //     //     var amendStatus = link[i].amendStatus;
            //     //     var geometry = link[i].geometry;
            //     //     if (amendStatus == 0) {
            //     //         var latLng = new Array();
            //     //         for (var j = 0; j < geometry.length; j++) {
            //     //             latLng[j] = new Array(geometry[j].lng, geometry[j].lat);
            //     //             path[k] = new Array(geometry[j].lng, geometry[j].lat);
            //     //             k++;
            //     //         }
            //     //         if (latLng.length != 0) {
            //     //             pathNull[k1] = latLng;
            //     //             k1++;
            //     //         }
            //     //     } else {
            //     //         switch (amendStatus) {
            //     //             case 2:
            //     //                 var latLng = new Array();
            //     //                 for (var j = 0; j < geometry.length; j++) {
            //     //                     latLng[j] = new Array(geometry[j].lng, geometry[j].lat);
            //     //                     path[k] = new Array(geometry[j].lng, geometry[j].lat);
            //     //                     k++;
            //     //                 }
            //     //                 if (latLng.length != 0) {
            //     //                     pathNONE[k2] = latLng;
            //     //                     k2++;
            //     //                 }
            //     //                 break;
            //     //             case 1:
            //     //                 var latLng = new Array();
            //     //                 for (var j = 0; j < geometry.length; j++) {
            //     //                     latLng[j] = new Array(geometry[j].lng, geometry[j].lat);
            //     //
            //     //                     path[k] = new Array(geometry[j].lng, geometry[j].lat);
            //     //                     k++;
            //     //                 }
            //     //                 if (latLng.length != 0) {
            //     //                     pathADD[k3] = latLng;
            //     //                     k3++;
            //     //                 }
            //     //                 break;
            //     //         }
            //     //     }
            //     //
            //     // }
            //     for (var i = 0; i < link.length; i++) {
            //         var amendStatus = link[i].amendStatus;
            //         var geometry = link[i].geometry;
            //         // for (var j = 0; j < geometry.length; j++) {
            //         //     path[k] = new Array(geometry[j].lng, geometry[j].lat);
            //         //     k++;
            //         // }
            //         if(amendStatus == 0) {
            //             var arr1 =[]
            //             for (var j = 0; j < geometry.length; j++) {
            //                 path[k] = new Array(geometry[j].lng, geometry[j].lat);
            //                 k++;
            //             }
            //             arr1.push(path)
            //             this.pathNull.push(arr1)
            //         }else {
            //             break
            //         }
            //         if(amendStatus == 2) {
            //             // 删除的点
            //             for (var j = 0; j < geometry.length; j++) {
            //                 pathNONE[k2] = new Array(geometry[j].lng, geometry[j].lat);
            //                 k2++;
            //             }
            //         }
            //         if(amendStatus == 1) {
            //             // 增补的点
            //             var arr2 = []
            //             for (var j = 0; j < geometry.length; j++) {
            //                 pathADD[k3] = new Array(geometry[j].lng, geometry[j].lat);
            //                 k3++;
            //             }
            //             arr2.push(pathADD)
            //             this.pathADD.push(arr2)
            //         }else {
            //             break
            //         }
            //
            //     }
            //     console.log(this.pathADD,'增补的点');
            //     console.log(this.pathNONE,' ww');
            //     console.log(this.pathNull,'path');
            //    // 无变化的点
            //     this.path = path
            //     if(pathNull.length!= 0) {
            //         this.pathNull = pathNull
            //     }
            //     // 删除的点
            //     if(pathNONE.length!= 0) {
            //         this.pathNONE = pathNONE
            //     }
            //     // 增补的点
            //     if(pathADD.length!= 0) {
            //            this.pathADD = pathADD;
            //     }
            //
            //     this.init()
            // },
            // cd() {
            //       this.setOrigin( this.path[0]) // 起点
            //       this.setEnd( this.path[this.pathNull.length - 1]) // 终点
            //     if (this.pathNull.length != 0) {
            //         // 无变化的点
            //         this.pathNull.forEach(val =>{
            //             this.display_polyline(val,'#238E68');
            //         })
            //
            //     }
            //     if (this.pathNONE.length != 0) {
            //         // 删除的点
            //         this.display_polyline(this.pathNONE,'#888')
            //     }
            //     if (this.pathADD.length != 0) {
            //         // 增补的点
            //         console.log(this.pathADD,'123');
            //
            //         this.pathNull.forEach(val =>{
            //              this.display_polyline(val,'#2894FF')
            //         })
            //     }
            // },
            // // // 设置 起点
            // setOrigin(val) {
            //     //标记起终点marker
            //     var _t = this;
            //     var anchor = new qq.maps.Point(12, 39)
            //     var size = new qq.maps.Size(38, 56)
            //     var origin = new qq.maps.Point(0, 0);
            //     var markerIcon = new qq.maps.MarkerImage(
            //         "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png",
            //         size,
            //         origin,
            //         anchor,
            //     );
            //
            //     // var marker2 = new qq.maps.Label({
            //     //     position:  new qq.maps.LatLng(val[1], val[0]),
            //     //     map: _t.map,
            //     //     content:'文本标注'
            //     // });
            //     var marker = new qq.maps.Marker({
            //
            //         position: new qq.maps.LatLng(val[1], val[0]),
            //         icon: markerIcon,
            //         map: _t.map
            //     });
            // },
            // // 设置终点
            // setEnd(val) {
            //     var _t = this;
            //     var anchor = new qq.maps.Point(12, 39)
            //     var size = new qq.maps.Size(38, 56)
            //     var origin = new qq.maps.Point(0, 0);
            //     var markerIcon = new qq.maps.MarkerImage(
            //         "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png",
            //         size,
            //         origin,
            //         anchor,
            //     );
            //     var marker = new qq.maps.Marker({
            //         position: new qq.maps.LatLng(val[1], val[0]),
            //         icon: markerIcon,
            //         map: _t.map
            //     });
            // },
            // //绘制路线
            // display_polyline(pl,style) {
            //     //创建 MultiPolyline显示折线
            //     var _t = this;
            //     var path1 = [];
            //     // console.log(pl,'pl');
            //     pl.forEach((item, index) => {
            //         path1.push(new qq.maps.LatLng(item[1], item[0]))
            //     })
            //     new qq.maps.Polyline({
            //         map: _t.map,
            //         path: path1,
            //         strokeColor: style,
            //         strokeWeight: 6,
            //
            //     });
            //
            // },
            toUpperCode(val) {
                this.dataList.carNumber = val.toUpperCase()
            },
            resetHandle() {
                var _t = this;
                _t.dataList.color = "";
                _t.dataList.time = ""; // 上传时间
                _t.dataList.entrance = ""; // 入口时间
                _t.dataList.carNumber = "";
                _t.tableData =  []; // 表单数据
                _t.dialogTableVisible = false;
                _t.json = '';
                _t.tableShow = true;
                _t.logShow = false;
                _t.logShowData = [];
                _t.qqShow = false;
            },

        },
        created() {
            if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId')) {
                this.$router.replace('/login');
            }
            this.$store.commit('set_loading', true);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);
        }
    }
</script>

<style scoped>
    /deep/.el-collapse .el-collapse-item__header {
        padding-left: 10px;
        box-sizing: border-box;
    }
    /deep/.el-collapse .el-collapse-item__content {
        padding-left: 20px;
    }

    .json-viewer {
        max-height: 60vh;
        overflow-y: auto;
    }
</style>
