<template>
    <div>
        <!--工具条-->
        <el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align:center;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <!--<el-select v-model="role_select" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in role_list"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="管理员名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRoleListByName">查询</el-button>
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
            <el-table-column prop="name" label="姓名" width="250" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="300" align="center">
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
                    <!--删除弹出框-->
                    <!--<el-popover-->
                            <!--ref="popover1"-->
                            <!--placement="top"-->
                            <!--width="200"-->
                            <!--v-model="deltip">-->
                        <!--<p>确定删除吗？对应的角色下用户将无上级角色!</p>-->
                        <!--<div style="text-align: right; margin: 0">-->
                            <!--<el-button size="mini" type="text" @click="deltip = false">取消</el-button>-->
                            <!--<el-button type="primary" size="mini" @click="confirm_delete">确定</el-button>-->
                        <!--</div>-->
                    <!--</el-popover>-->
                </template>
            </el-table-column>
        </el-table>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="角色名称" prop="name">
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
                    name:'',
                    remark:'',
                    status:-1
                }], //需要向table填写的数据
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
            }
        },
        methods: {
            getRoleListByName(){
                this.$ajax.post('/role/role_search_by_name', {rolename:this.filters.name}).then(res => {
                    let result = res.data;
                    if (result.errno == 0) {
                        //如果为空，处理为空JSON数组
                        if(result.data==null)
                        {
                            this.tableData = [];
                        }
                        this.tableData = result.data;
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },
            getRoleList(){
                this.$ajax.post('/role/role_list', {}).then(res => {
                    let result = res.data;
                    console.log(result);
                    if (result.errno == 0) {
                        this.tableData = result.data;
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },
            deleteRole(scope){
                this.deltip = true;
                this.$confirm('确定删除吗？对应的角色下用户将无上级角色!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post('/role/role_delete', {roleid:scope.row.id}).then(res => {
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
//            confirm_delete(){
//                let id = this.temp_del_id;
//                this.$ajax.post('/role/deleterole', {roleid:id}).then(res => {
//                    let result = res.data;
//                    if (result.errno == 0) {
//                        this.$message({message:'删除成功',type:'success'});
//                    }
//                    else{
//                        this.$message({message:'删除失败',type:'error'});
//                    }
//                }).catch(err => {
//                    this.tableLoading = false;
//                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
//                    console.log('----', err)
//                });
//            },
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

        //获取用户列表
        mounted() {
            this.getRoleList();
        },
        computed: {}
    }

</script>

