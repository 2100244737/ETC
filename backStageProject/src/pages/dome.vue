<template>
    <div class="view" :key="menuKey">
        <el-button type="primary" icon="el-icon-folder" @click="deriveTable">导出文件</el-button>
        <el-table
            :row-class-name="tableRowClassName"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            :span-method="objectSpanMethod" :data="list" id="table" border>
            <el-table-column prop="province" label="调用省份" header-align="center" align="center"/>
            <el-table-column prop="err" label="计费结果类型" header-align="center" align="center"/>
            <el-table-column prop="reason" label="信息" header-align="center" align="center"/>
            <el-table-column prop="count" label="次数" header-align="center" align="center"/>
            <el-table-column label="占总数量百分比(%)" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.flage != 1">{{scope.row.count/scope.row.failCount*100 | numFilter}}</span>
                    <span v-else>{{scope.row.successCount /scope.row.zong *100 | numFilter}}%</span>
                </template>
            </el-table-column>
            <el-table-column prop="failCount" label="总数量" header-align="center" align="center"/>
            <el-table-column prop="successRate" label="成功率(%)" header-align="center" align="center"/>
        </el-table>
    </div>
</template>

<script>

import api from '../../static/amp.json'
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
    export default {
        name: 'index',
        data() {
            return {
                 list: [],
                 arr: [],
                hoverOrderArr:[],
                OrderIndexArr:[],
                spanFourArr:[],
                menuKey: 0
            }
        },
        watch:{
            list(){
                ++this.menuKey
            }
        },
       mounted() {
           this.mode (api.result)
           this.getOrderNumber()
       },
        filters: {
            numFilter(value) {
                let realVal = ''
                if (!isNaN(value) && value !== '') {
                    // 截取当前数据到小数点后两位
                    realVal = parseFloat(value).toFixed(2)+ "%"
                } else {
                    realVal = '--'
                }
                return realVal
            }
        },
        methods: {
            mode (row) {
                var arr = []
                row.forEach(item => {
                    item.failDetail.forEach(val => {
                        var obj = new Object()
                        obj.count = val.count
                        obj.reason = val.reason
                        obj.err = '失败'
                        Object.assign(obj,item)
                        arr.push(obj)
                    })
                    item.err = '成功'
                    item.reason = '计费成功'
                    item.zong = item.successCount + item.failCount
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
                data.forEach((item, index) => {
                    if (index === 0) {
                        spanOneArr.push(1)
                        this.spanFourArr.push(1);
                    } else {
                        if (item[c] && item[c] === data[index - 1][c]) { //当前项和前一项比较
                            spanOneArr[concatOne] += 1 //相同值第一个出现的位置，统计需要合并多少行
                            spanOneArr.push(0)//新增一个被合并行
                        } else {
                            spanOneArr.push(1) //否则不合并
                            concatOne = index//指向位移
                        }
                        if(item.err == data[index - 1].err){

                            this.spanFourArr[concatTow] += 1;
                            this.spanFourArr.push(0);
                        }else{
                            this.spanFourArr.push(1);
                            concatTow = index;
                        };
                    }
                })
                var obj = {}
                obj[c] = spanOneArr
                this.arr.push(obj)
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    const _row = this.arr[0].province[rowIndex] // 第一竖列
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
                }
                else if (columnIndex === 5) {
                    const _row = this.spanFourArr[rowIndex]  // 第6竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }else if (columnIndex === 6) {
                    const _row = this.arr[0].province[rowIndex] // 第7竖列
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },

            // 获取相同编号的数组
            getOrderNumber () {
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
            cellMouseEnter (row, column, cell, event) {
                this.rowIndex = row.rowIndex
                this.hoverOrderArr = []
                this.OrderIndexArr.forEach((element) => {
                    if (element.indexOf(this.rowIndex) >= 0) {
                        this.hoverOrderArr = element
                    }
                })
            },
            cellMouseLeave (row, column, cell, event) {
                this.rowIndex = '-1'
                this.hoverOrderArr = []
            },
            tableRowClassName ({ row, rowIndex }) {
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
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '2020055-30.xlsx')
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, wbout)
                }
                return wbout
            },
        }
    }
</script>

<style scoped>
 /*table thead {*/
 /*    height: 50px;*/
 /*    line-height: 50px;*/
 /*    background: #888888;*/
 /*}*/
 /deep/.el-table .success-row {
     background: #f5f7fa;
 }
 .view {
     width: 100%;
 }
 table {
     width: 100%;
 }

 table thead tr {
     width: 100%;
     height: 50px;
     line-height: 50px;
 }
 table thead tr span {
     width: 25%;
     display: inline-block;
     text-align: center;
 }
 /*   .headerTitle {*/
 /*       width: 25%;*/
 /*   }*/
 table tbody tr{
     width: 100%;
 }
 .tdp {
     /*width: 100%;*/
     /*border-bottom: 1px solid #333;*/
 }
 table tbody  .tda {
     width: 25%;
     background: pink;
     height: 30px;
 }
</style>
