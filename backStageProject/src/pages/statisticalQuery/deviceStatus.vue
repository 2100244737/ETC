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
                <el-form-item label="省份：" prop="province">
                    <el-select clearable size="mini" v-model="formItem.province" filterable placeholder="请选择查询省份">
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
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="blueBtn" size="mini" round @click="deriveTable">导出文件</el-button>
                    <el-button class="redBtn" size="mini" round @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" :summary-method="getSummaries"
                      show-summary id="table" size="small" stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="province" label="客户省份" header-align="center" align="center"/>
                <el-table-column prop="companyName" label="客户单位" header-align="center" align="center"/>
                <el-table-column prop="totalCount" label="设备总量" header-align="center" align="center"/>
                <el-table-column prop="neverCount" label="从未部署设备数量" header-align="center" align="center"/>
                <el-table-column prop="bindCount" label="已部署设备数量" header-align="center" align="center"/>
                <el-table-column prop="cancelCount" label="已取消部署设备数量" header-align="center" align="center"/>
                <el-table-column label="部署率" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.bindRate}} </span>
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
        name: "deviceStatus",
        data() {
            return {
                formItem: {
                    date: '',
                    province: ''
                },
                keyData: this.$store.state.province, // 省份
                tableData: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
            }
        },
        components: {},
        mounted() {
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
        methods: {
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];

                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    } else if (index === 7) {

                    }
                    const values = data.map(item => Number(item[column.property]));

                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += '';
                    } else {
                        if (index != 7) {
                            sums[index] = '-';
                        }
                    }

                });
                sums[7] = (sums[5] / sums[3] * 100).toFixed(2) + '%'

                return sums;
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
            resetHandle() {
                // 重置
                this.formItem.date = this.$time().subtract(1, "days").format("YYYY-MM-DD");
                this.formItem.province = ''
                this.getData()
            },
            getData() {
                // 查询
                var _t = this
                const params = {
                    statDate: _t.formItem.date,
                    province: _t.formItem.province ? _t.formItem.province : null,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = api.STAT_DEVSTATUS + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('/api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data
                        _t.tableData.forEach(item => {
                            for (var int in _t.keyData) {
                                if (int == item.province) {
                                    item.province = _t.keyData[int]
                                }
                            }
                        })
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            }
        },
        created() {
            this.$store.commit('set_loading', false);
            this.formItem.date = this.$time().subtract(1, "days").format("YYYY-MM-DD");
            this.getData()
        }
    }
</script>

<style scoped>
    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 180px; /*no*/
    }

    /deep/ .el-table .el-table__footer-wrapper {
        margin-left: 2px
    }
</style>
