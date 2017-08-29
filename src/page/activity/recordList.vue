<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align:center;">
                <el-form :inline="true" :model="filters">
                    <el-form-item label="选择党群" prop="big_dept_id" v-if="is_role_one">
                        <el-select v-model="filters.big_dept_id" placeholder="请选择" @change="partyChange" clearable>
                            <el-option
                                    v-for="item in big_party_list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                            label="选择党支部"
                            label-width="100px"
                            prop="dept_id">
                        <organized-cascader
                                @cascaderChange="cascaderChange">
                        </organized-cascader>
                    </el-form-item>
                    <el-select label="选择党建类型" v-model="filters.record_type" @change="typeChange" placeholder="请选择"
                               clearable>
                        <el-option
                                v-for="item in selectArr.record_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-form-item>
                        <!--<el-button type="primary" @click="getRecordListQuery">查询</el-button>-->
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addRecord">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table :data="tableData" highlight-current-row
                  border
                  v-loading="tableLoading"
                  element-loading-text="拼命加载中"
                  max-height="500"
                  style="width: 100%">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column prop="record_title" label="活动名称" width="300" align="center">
            </el-table-column>
            <el-table-column prop="dept_name" label="党支部" width="200" align="center">
            </el-table-column>
            <el-table-column prop="record_type" label="党建类型" width="150" align="center">
                <template scope="scope">
                    {{scope.row.record_type|formatRecordType}}
                </template>
            </el-table-column>
            <el-table-column prop="activity_start_time" label="活动时间" width="150" align="center">
            </el-table-column>
            <el-table-column prop="activity_end_time" label="结束时间" width="150" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" min-width="300">
                <template scope="scope">
                    <el-button size="small" @click="infoRecord(scope)">详情</el-button>
                    <el-button size="small" @click="editRecord(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="evaluateRecord(scope)">点评</el-button>
                    <el-button type="danger" size="small" @click="deleteRecord(scope)">删除</el-button>

                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination
                    style="margin: 0 auto;text-align: center;margin-top: 30px"
                    @size-change="paginationSizeChange"
                    @current-change="currentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10,20,30]"
                    :page-size="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="tableDataTotal">
            </el-pagination>
        </div>

        <!--详情-->
        <el-dialog
                title="详情"
                :visible.sync="infoDialog"
                size="large"
                :before-close="infoDialogClose">
            <span>
                <cell-arr
                        :cellDate="cellData"
                        @imageDialog="imageDialog"
                        :editMode="false"></cell-arr>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog
                title="编辑"
                :visible.sync="editDialog"
                size="large"
                :before-close="editDialogClose">
            <span>
                <record-edit
                        ref="recordEdit"
                        @openImageFile="openImageFile"
                        :parentForm="parentForm">
                </record-edit>

            </span>
        </el-dialog>
        <!--编辑图片-->
        <el-dialog
                v-model="recordEditDialog"
                :size="recordEditDialogSize"
                :title="file.name">
            <span slot="title">
                <span>{{file.name}}<el-button type="text" @click="magnifyImage"
                                              style="margin-left: 1rem">{{btnTip}}</el-button></span>
            </span>
            <img width="100%" :src="file.url" alt="">
        </el-dialog>
        <!--详情图片-->
        <el-dialog v-model="imageVisible" size="tiny">
            <span slot="title">
                {{imageFile.name}}
                <el-button type="text" @click="imageDownload">
                    下载
                </el-button>
            </span>
            <img width="100%" :src="imageFile.httpUri" alt="">
        </el-dialog>

        <!--点评-->
        <el-dialog
                title="点评"
                :visible.sync="evaluateDialog"
                size="small"
                :before-close="evaluateDialogClose">
            <span>
                <evaluate
                :rate="rate"></evaluate>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="evaluateDialog = false">取 消</el-button>
                <el-button type="primary" @click="evaluateSubmit">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue';
    import recordEdit from './recordAdd.vue';
    import cellArr from '../../components/cellArr.vue'
    import evaluate from './evaluate.vue';
    import '../../assets/elCss/table.css';
    import '../../assets/elCss/loading.css';
    import {selectArr, record} from '../../assets/kvword.js';

    const helper = require('../../tools/helper');
    export default {
        data() {
            return {
                tableData: [{
                    record_title: '',
                    dept_name: '',
                    record_type: '',
                    activity_start_time: '',
                    activity_end_time: ''
                }], //需要向table填写的数据
                selectArr: selectArr,
                local_people_info: {},
                //操作的方法
                tableLoading: true,
                filters: {
                    big_dept_id: '',
                    small_dept_id: '',
                    record_type: ''
                },
                is_role_one: false,
                //分页查询相关
                currentPage: 1,
                tableDataTotal: 0,
                pageSize: 10,

                notEmpty: [{required: true, message: '不许为空'}],

                infoDialog: false,
                cellData: [],
                imageVisible: false,
                imageFile: {},

                editDialog: false,
                parentForm: {},
                recordEditDialog: false,
                file: {},
                recordEditDialogSize: 'tiny',
                btnTip: '放大',

                //点评
                evaluateDialog:false,
                rate:{}
            }
        },
        methods: {
            partyChange() {
                this.getRecordListQuery();
            },
            cascaderChange(call) {
                this.filters.small_dept_id = call[call.length - 1];
                this.getRecordListQuery();
            },
            typeChange() {
                this.getRecordListQuery();
            },
            addRecord() {
                this.$router.push({path: '/home/recordAdd'});
            },
            editRecord(index, row) {
                //console.log(JSON.stringify(row))
                let parentData = {
                    form: {
                        dept_id: row.dept_id,
                        record_type: row.record_type,
                        activity_start_time: row.activity_start_time,
                        activity_end_time: row.activity_end_time,
                        attend_user_arr: helper.stringToArray(row.attend_user_id),
                        record_host_people: row.record_host_people,
                        record_write_people: row.record_write_people,
                        activity_place: row.activity_place,
                        record_subtitle: row.record_subtitle,
                        record_content: row.record_content,
                        record_title: row.record_title,
                        file_id_arr: helper.stringToArray(row.file_id_list),
                    },
                    cascderValue: row.dept_id,
                    real_attend_users: helper.stringToArray(row.attend_user_id),
                    real_attend_users_str: row.attend_user_id,
                    real_record_type: row.record_type

                }
                let file_list = [];
                helper.stringToArray(row.file_id_list).forEach(value => {
                    let json = {
                        name: value.substr(value.indexOf("_") + 1),
                        url: require('../../value/string').fileread + value.replace(`file`, `ctdj/www/static`),
                    };
                    file_list.push(json);
                })
                parentData.file_list = file_list;
                this.parentForm = parentData;
                this.editDialog = true;
            },
            infoRecord(scope) {
                let row = scope.row;
                let arr = helper.createTableArr(record, row);
                arr.forEach(value => {
                    value.oType = value.type;
                    value.type = value.type != 'file' ? 'text' : 'file';
                    value.tableIndex = scope.$index;
                    if (value.key == 'attend_people_name') {
                        value.value = dealVirguleData(value.value)
                    }
                })
                this.infoDialog = true;
                console.log('arr----', arr);
                this.cellData = arr;
            },
            imageDialog(file) {
                this.imageVisible = true;
                this.imageFile = file;
                this.imageFile.httpUri = require('../../value/string.js').fileread + (file.uri).replace(`file`, `ctdj/www/static`);
                console.log('file--file--', this.imageFile.httpUri);
            },
            imageDownload() {
                helper.downloadFile(this.imageFile.httpUri);
            },
            infoDialogClose() {
                this.infoDialog = false;
            },
            editDialogClose() {
                this.editDialog = false;
            },
            deleteRecord(scope) {
                this.$confirm('确定删除改该条活动信息吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post('/activity_record/activity_record_delete', {activity_record_id: scope.row.id}).then(res => {
                        let result = res.data;
                        if (result.errno == 0) {
                            this.$message({message: '删除成功', type: 'success'});
                            this.tableData.splice(scope.$index, 1);
                        }
                        else {
                            this.$message({message: '删除失败', type: 'error'});
                        }
                    }).catch(err => {
                        this.tableLoading = false;
                        this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                        console.log('----', err)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            paginationSizeChange(call) {
                this.pageSize = call;
                let params = {
                    page: this.currentPage,
                    count: this.pageSize,
                    big_dept_id: this.filters.big_dept_id,
                    small_dept_id: this.filters.small_dept_id
                }
                this.getPagedRecordList(this, params);
            },
            currentChange(call) {
                let params = {
                    page: this.currentPage,
                    count: this.pageSize,
                    big_dept_id: this.filters.big_dept_id,
                    small_dept_id: this.filters.small_dept_id
                }
                this.getPagedRecordList(this, params);
            },
            getRecordListQuery() {
                let params = {
                    page: this.currentPage,
                    count: this.pageSize,
                    big_dept_id: this.filters.big_dept_id,
                    small_dept_id: this.filters.small_dept_id,
                    record_type:this.filters.record_type
                }
                console.log(params);
                this.getPagedRecordList(this, params);
            },

            //分页查询活动信息列表
            getPagedRecordList(vm, params) {
                vm.tableLoading = true;
                vm.$ajax.post('/activity_record/activity_record_list', params).then(res => {
                    console.log('res.data----', res.data);
                    if (res.data.errno == 0) {
                        vm.tableData = res.data.data.data;
                        vm.tableDataTotal = res.data.data.count;
                        vm.tableLoading = false;
                    } else {
                        vm.tableLoading = false;
                    }
                }).catch(err => {
                    vm.tableLoading = false;
                    vm.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },

            openImageFile(file) {
                this.recordEditDialog = true;
                this.file = file;
            },
            magnifyImage() {
                if (this.recordEditDialogSize == 'tiny') {
                    this.recordEditDialogSize = 'large'
                    this.btnTip = '缩小'
                } else {
                    this.recordEditDialogSize = 'tiny'
                    this.btnTip = '放大'
                }

            },

            evaluateRecord() {
                this.rate = {
                    grades:4,
                    desc:''
                }
                this.evaluateDialog = true;
            },
            evaluateSubmit(){
                console.log('aaaaa-----',this.rate)
            },
            evaluateDialogClose(){
                this.evaluateDialog = false;
            }
        },
        filters: {
            formatRecordType(record_type) {
                let temp_str = '';
                selectArr.record_type.forEach(item => {
                    if (item.value == record_type) {
                        temp_str = item.label;
                        return;
                    }
                });
                return temp_str;
            }
        },
        components: {
            organizedCascader, cellArr, recordEdit,evaluate
        },
        mounted() {
            this.local_people_info = this.$localStore.get('people_info')[0];
            if (this.local_people_info.role_id == 1) {
                this.is_role_one = true;
            }
            let params_default = {page: 1, count: 10};
            this.getPagedRecordList(this, params_default);
        },
        computed: {
            //获取所有党群列表
            big_party_list() {
                //console.log("organized.party===>",this.$store.state.organized.party);
                return this.$store.state.organized.party;
            }
        }
    }

    function dealVirguleData(data) {
        let array = helper.stringToArray(data);
        let str = ''
        array.forEach((v, i, s) => {
            if (i < s.length - 1) {
                str += v + '、';
            } else {
                str += v;
            }

        })
        return str;
    }
</script>