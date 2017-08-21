<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align:center;">
                <el-form :inline="true" :model="filters">
                    <el-form-item label="选择党群" prop="big_dept_id" v-if="is_role_one">
                        <el-select v-model="filters.big_dept_id" placeholder="请选择" clearable>
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
                    <el-select label="选择时间" v-model="filters.record_type" placeholder="选择党建类型" clearable>
                        <el-option
                                v-for="item in selectArr.record_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-form-item>
                        <el-button type="primary" @click="getRecordListQuery">查询</el-button>
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
                    align="center"
                    width="60">
            </el-table-column>
            <el-table-column prop="activity_name" label="计划名称" width="300" align="center">
            </el-table-column>
            <el-table-column prop="dept_name" label="党支部" width="200" align="center">
            </el-table-column>
            <el-table-column  label="年/月/周" width="150" align="center">
                <template scope="scope">
                    {{scope.row.pub_year}}年{{scope.row.pub_month}}月第{{scope.row.pub_week}}周
                </template>
            </el-table-column>
            <el-table-column prop="activity_content" style="overflow:hidden;text-overflow:ellipsis;"  class="activity_content" label="活动内容" width="150" align="center">
            </el-table-column>
            <el-table-column prop="activity_memo" label="备注" width="150" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size="small" @click="editRecord(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteRecord(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="block">
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
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue';
    import '../../assets/elCss/table.css';
    import '../../assets/elCss/loading.css';
    import {selectArr} from '../../assets/kvword.js';

    export default {
        data() {
            return {
                tableData: [{
                    record_title:'',
                    dept_name:'',
                    record_type:'',
                    activity_start_time:'',
                    activity_end_time:''
                }], //需要向table填写的数据
                selectArr:selectArr,
                local_people_info:{},
                //操作的方法
                tableLoading: true,
                filters: {
                    big_dept_id:'',
                    small_dept_id:'',
                    record_type:''
                },
                is_role_one:false,
                //分页查询相关
                currentPage: 1,
                tableDataTotal: 0,
                pageSize: 10,

                notEmpty: [{required: true, message: '不许为空'}]
            }
        },
        methods:{
            cascaderChange(call){
                this.filters.small_dept_id = call[call.length-1];
            },
            addRecord(){
                this.$router.push({path:'/home/recordAdd'});
            },
            editRecord(index,row){

            },
            deleteRecord(scope){
                this.$confirm('确定删除改该条计划吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
//                    console.log(scope);
//                   return false;
                    this.$ajax.post('/activity_plan/activity_plan_delete', {activity_plan_id:scope.row.id}).then(res => {
                        let result = res.data;
                        if (result.errno == 0) {
                            this.$message({message:'删除成功',type:'success'});
                            this.tableData.splice(scope.$index,1);
                        }
                        else{
                            this.$message({message:'删除失败',type:'error'});
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
                    big_dept_id:this.filters.big_dept_id,
                    small_dept_id:this.filters.small_dept_id
                }
                this.getPagedRecordList(this, params);
            },
            currentChange(call) {
                let params = {
                    page: this.currentPage,
                    count: this.pageSize,
                    big_dept_id:this.filters.big_dept_id,
                    small_dept_id:this.filters.small_dept_id
                }
                this.getPagedRecordList(this, params);
            },
            getRecordListQuery(){
                let params = {
                    page: this.currentPage,
                    count: this.pageSize,
                    big_dept_id:this.filters.big_dept_id,
                    small_dept_id:this.filters.small_dept_id
                }
                console.log(params);
                this.getPagedRecordList(this,params);
            },

            //分页查询活动信息列表
            getPagedRecordList(vm, params){
                vm.tableLoading = true;
                vm.$ajax.post('/activity_plan/activity_plan_list', params).then(res => {
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
            }
        },
        filters: {
            formatRecordType(record_type){
                let temp_str = '';
                selectArr.record_type.forEach(item=>{
                    if(item.value==record_type){
                        temp_str = item.label;
                        return;
                    }
                });
                return temp_str;
            }
        },
        components:{
            organizedCascader
        },
        mounted(){
            this.local_people_info = this.$localStore.get('people_info')[0];
            if(this.local_people_info.role_id==1){
                this.is_role_one = true;
            }
            let params_default = {page: 1, count: 10};
            this.getPagedRecordList(this, params_default);
        },
        computed:{
            //获取所有党群列表
            big_party_list(){
                //console.log("organized.party===>",this.$store.state.organized.party);
                return this.$store.state.organized.party;
            }
        }
    }
</script>

<style lang="less">
    .activity_content{overflow:hidden;text-overflow:ellipsis;}
</style>