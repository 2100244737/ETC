<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" label-width="70px" class="clearFix" inline>
                <el-form-item label="日期：" class="marBottom7">
                    <el-date-picker
                        size="mini"
                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        v-model="formItem.date"
                        align="right"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="fr">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="blueBtn" size="mini" round @click="deriveTable">导出文件</el-button>
                    <el-button class="redBtn" size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table
                border
                :row-class-name="tableRowClassName"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
                :span-method="objectSpanMethod" :data="list" id="table" size="small">
                <el-table-column prop="province" label="调用省份" header-align="center" align="center"/>
                <el-table-column prop="err" label="计费结果类型" header-align="center" align="center"/>
                <el-table-column prop="reason" label="信息" header-align="center" align="center"/>
                <el-table-column prop="count" label="次数" header-align="center" align="center"/>
                <el-table-column label="错误占比(%)" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.flage != 1">{{scope.row.count/scope.row.zong*100 | numFilter}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="failCount" label="总数量" header-align="center" align="center"/>
                <el-table-column  label="成功率(%)" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.successRate > '80'" style="color: #67C23A" >{{scope.row.successRate  |numberData}}</span>
                        <span v-if="'60'< scope.row.successRate && scope.row.successRate < '80'" style="color:#E6A23C" >{{scope.row.successRate |numberData}}</span>
                        <span  v-if="scope.row.successRate < '60'" style="color:red">{{scope.row.successRate |numberData}}</span>
                    </template>

                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import api from "../../uitls/api/statistical";
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    export default {
        name: "deviceCompute",
        data() {
            return {
                search: '',
                formItem: {
                    date: ''
                },
                isActive: false,
                tableData: [],
                list: [],
                arr: [],
                hoverOrderArr: [],
                OrderIndexArr: [],
                spanFourArr: [],
                spanFourArrOne: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
            }
        },
        components: {},
        mounted() {
            this.getOrderNumber()
        },
        computed: {
            // yesterday() {
            //     var time=(new Date).getTime()-24*60*60*1000;
            //     var yesterday =new Date(time);
            //     var month=yesterday.getMonth();
            //     var day=yesterday.getDate();
            //
            //     yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
            //     return yesterday
            // }
        },
        filters: {
            numFilter(value) {
                let realVal = ''
                if (!isNaN(value) && value !== '') {
                    // 截取当前数据到小数点后两位
                    realVal = parseFloat(value).toFixed(2)
                } else {
                    realVal = '--'
                }
                return realVal
            },
            numberData (value) {
                let realVal = ''
                realVal = value.replace('%','')
                // if (!isNaN(value) && value !== '') {
                //     // 截取当前数据到小数点后两位
                //     console.log(value, 'value');
                //
                // } else {
                //     realVal = '--'
                // }
                return realVal
            }
        },
        methods: {
            screen(row) {
                row.failDetail.forEach(item => {
                    item.failCount = row.failCount
                })
            },
            resetHandle() {
                // 重置
                this.formItem.date = this.$time().subtract(1, "days").format("YYYY-MM-DD");
                this.getData()
            },
            getData() {
                // 查询功能
                var _t = this
                const params = {
                    date: _t.formItem.date,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };

                var filename = api.STAT_DEVCOMPUTE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).result ? JSON.parse(res.bizContent).result : [];
                        if (_t.tableData.length == 0) {
                            _t.alertDialogTip(_t, '未查到该天数据')
                        }
                        _t.mode(_t.tableData)
                        _t.getOrderNumber()
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                    //

                })
            },
            mode(row) {
                var arr = []
                row.forEach(item => {
                    item.failDetail.forEach(val => {
                        var obj = new Object()
                        obj.count = val.count
                        obj.reason = val.reason
                        obj.err = '失败'
                        obj.zong = item.successCount + item.failCount
                        Object.assign(obj, item)
                        arr.push(obj)
                    })
                    item.err = '成功'
                    item.reason = '计费成功'
                    item.count = item.successCount
                    item.flage = 1
                    item.failCount = item.successCount
                    arr.push(item)
                })
                this.list = arr
                this.setTable(this.list, 'province')
            },
            setTable(data, c) {
                let spanOneArr = []
                let concatOne = 0
                let concatTow = 0
                this.spanFourArr = []
                this.spanFourArrOne = []
                data.forEach((item, index) => {
                    if (index === 0) {
                        spanOneArr.push(1)
                        this.spanFourArr.push(1);
                        this.spanFourArrOne.push(1);
                    } else {
                        // if (item[c] && item[c] === data[index - 1][c]) { //当前项和前一项比较
                        //     spanOneArr[concatOne] += 1 //相同值第一个出现的位置，统计需要合并多少行
                        //     spanOneArr.push(0)//新增一个被合并行
                        // } else {
                        //     spanOneArr.push(1) //否则不合并
                        //     concatOne = index//指向位移
                        // }
                        if (item.province == data[index - 1].province) {

                            this.spanFourArrOne[concatTow] += 1;
                            this.spanFourArrOne.push(0);
                        } else {
                            this.spanFourArrOne.push(1);
                            concatTow = index;
                        }
                        ;
                        if (item.err == data[index - 1].err) {

                            this.spanFourArr[concatOne] += 1;
                            this.spanFourArr.push(0);
                        } else {
                            this.spanFourArr.push(1);
                            concatOne = index;
                        }
                        ;
                    }
                })
                var obj = {}
                obj[c] = spanOneArr
                this.arr.push(obj)
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0) {
                    const _row = this.spanFourArrOne[rowIndex] // 第一竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                } else if (columnIndex === 1) {
                    const _row = this.spanFourArr[rowIndex]// 第二竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                } else if (columnIndex === 5) {
                    const _row = this.spanFourArr[rowIndex]  // 第6竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                } else if (columnIndex === 6) {
                    const _row = this.spanFourArrOne[rowIndex] // 第7竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },

            // 获取相同编号的数组
            getOrderNumber() {
                var OrderObj = {}
                this.list.forEach((element, index) => {
                    element.rowIndex = index
                    if (OrderObj[element.province]) {
                        OrderObj[element.province].push(index)
                    } else {
                        OrderObj[element.province] = []
                        OrderObj[element.province].push(index)
                    }
                })

                for (var k in OrderObj) {
                    if (OrderObj[k].length > 1) {
                        this.OrderIndexArr.push(OrderObj[k])
                    }
                }
            },
            cellMouseEnter(row, column, cell, event) {
                this.rowIndex = row.rowIndex
                this.hoverOrderArr = []
                this.OrderIndexArr.forEach((element) => {
                    if (element.indexOf(this.rowIndex) >= 0) {
                        this.hoverOrderArr = element
                    }
                })
            },
            cellMouseLeave(row, column, cell, event) {
                this.rowIndex = '-1'
                this.hoverOrderArr = []
            },
            tableRowClassName({row, rowIndex}) {
                var arr = this.hoverOrderArr
                for (var i = 0; i < arr.length; i++) {
                    if (rowIndex === arr[i]) {
                        return 'success-row'
                    }
                }
            },


            deriveTable() {
                // 导出表格
                var wb = XLSX.utils.table_to_book(document.getElementById('table'))
                var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'array'})
                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), this.formItem.date + '.xlsx')
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, wbout)
                }
                return wbout
            },
        },
        created() {
            this.$store.commit('set_loading', false);
            this.formItem.date = this.$time().subtract(1, "days").format("YYYY-MM-DD");
            this.getOrderNumber()
            this.getData()
        }
    }
</script>

<style scoped>
    /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 180px;/*no*/
    }
    .tableColor-blue {
        background: #42b983;
    }

    /deep/ .el-table .success-row {
        background: #f5f7fa;
    }
    .top {
        width: 200px;
        height: 200px;
        position: fixed;

        right: 20px;
        bottom: 200px;
        background: red;
    }
</style>
