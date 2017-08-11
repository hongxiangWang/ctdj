<template>
    <div>
        <!--工具条-->
        <el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align:center;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="role_select" placeholder="请选择">
                        <el-option
                                v-for="item in role_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="管理员名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getAdminListByName">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addRole">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        </el-row>

        <el-table :data="tableData" highlight-current-row
                  v-loading="tableLoading"
                  element-loading-text="拼命加载中"
                  max-height="500"
                  style="width: 100%">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column prop="account" label="登录账号" width="250" align="center">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="250" align="center">
            </el-table-column>
            <el-table-column prop="prov_latn_name" label="本地网" width="100" align="center">
            </el-table-column>
            <el-table-column prop="dept_name" label="所在部门" width="200" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
                <template scope="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{scope.row.status==1?'有效':'禁用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size="small" @click="editRole(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteRole(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    style="margin: 0 auto;text-align: center;margin-top: 30px"
                    @size-change="paginationSizeChange"
                    @current-change="currentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[1,2,3,4]"
                    :page-size="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="tableDataTotal">
            </el-pagination>
        </div>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="登陆账号" prop="account">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注说明">
                    <el-input type="textarea" v-model="addForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addForm.status">
                        <el-radio class="radio" :label="1">有效</el-radio>
                        <el-radio class="radio" :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注说明">
                    <el-input type="textarea" v-model="editForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">有效</el-radio>
                        <el-radio class="radio" :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
//    import table1 from '../../components/table1.vue';
    import '../../assets/elCss/table.css'
    import '../../assets/elCss/loading.css'
    export default {
        data() {
            return {
                tableData: [{
                    account:'',
                    username:'',
                    prov_latn_name:'',
                    dept_name:'',
                    status:-1
                }], //需要向table填写的数据
                role_select:'',
                role_list:[],
                //操作的方法
                tableLoading: true,
                filters: {
                    name: ''
                },
                deltip: false,
                temp_del_id:0,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    status: 1
                },

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    remark:'',
                    status:-1
                },
                //分页查询相关
                currentPage: 1,
                tableDataTotal: 0,
                pageSize:2,
            }
        },
        methods: {
            paginationSizeChange(call) {
                this.pageSize = call;
                let params = { page:this.currentPage,count:this.pageSize}
                this.getPagedAdminList(this,params);
            },
            currentChange(call) {
                let params = { page:call,count:this.pageSize}
                this.getPagedAdminList(this,params);
            },
            //分页查询管理员信息
            getPagedAdminList(vm,params){
                vm.tableLoading = true;
                vm.$ajax.post('/admin/admin_list', params).then(res => {
                    console.log('----', res)
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
            getRoleList(){
                this.$ajax.post('/role/role_list', {}).then(res => {
                    let result = res.data;
                    console.log(result);
                    if (result.errno == 0) {
                        this.role_list = result.data;
                    }
                }).catch(err => {
//                    this.tableLoading = false;
                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },
            getAdminListByName(){

            },
            //显示新增界面
            addRole: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    remark:'',
                    status: 1
                };
            },
            //处理新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        let roleinfo = {
                            name:para.name,
                            remark:para.remark,
                            status:para.status
                        };

                        this.$ajax.post('role/role_add',{roleinfo:roleinfo}).then(response => {
                            let result = response.data;
                            this.addLoading = false;
                            if(result.errno==0)
                            {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getRoleList();
                            }
                            else
                            {
                                this.$message({
                                    message:'提交失败',
                                    type:'error'
                                });
                            }
                        }).catch(error => {
                            console.log(error.message);
                            this.$message({message: error.message, type: 'error'})
                        });
                    }
                });
            },
            //显示编辑界面
            editRole: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //处理编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            console.log(para);
                            let roledata ={
                                name:para.name,
                                remark:para.remark,
                                status:para.status
                            }
                            this.$ajax.post('role/role_edit',{roleid:para.id,roledata:roledata}).then(response => {
                                let result = response.data;
                                this.editLoading = false;
                                if(result.errno==0)
                                {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getRoleList();
                                }
                                else
                                {
                                    this.$message({
                                        message:'修改失败',
                                        type:'error'
                                    });
                                }
                            }).catch(error => {
                                console.log(error.message);
                                this.$message({message: error.message, type: 'error'})
                            });
                    }
                });
            },

        },
        components: {

        },

        //获取管理员列表
        mounted() {
            this.getRoleList();

            let params = { page:1,count:2}
            this.getPagedAdminList(this,params);
        },
        computed: {}
    }

</script>

