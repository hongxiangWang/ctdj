<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align:center;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-select v-model="filters.role_select" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in select_role_list"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.username" placeholder="登陆账号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.people_name" placeholder="党员姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getAdminListQuery">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addAdmin">新增</el-button>
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
            <el-table-column prop="username" label="登录账号" width="250" align="center">
            </el-table-column>
            <el-table-column prop="people_name" label="姓名" width="250" align="center">
            </el-table-column>
            <el-table-column prop="prov_latn_name" label="本地网" width="100" align="center">
            </el-table-column>
            <el-table-column prop="dept_name" label="所在部门" width="200" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
                <template scope="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '有效' : '禁用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size="small" @click="editAdmin(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteAdmin(scope)">删除</el-button>
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

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="登陆账号" prop="username">
                    <el-input type="text" placeholder="请输入字母数字组合" v-model="addForm.username"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="userpwd">
                    <el-input type="password" placeholder="请输入字母数字组合 最少6位" v-model="addForm.userpwd"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="绑定员工" prop="people_id">
                    <el-autocomplete
                            v-model="addForm.bind_people"
                            class="inline-input"
                            :fetch-suggestions="bindSearch"
                            :props="autosearch"
                            placeholder="请输入员工姓名"
                            @select="handleBindSelectAddForm"
                            style="width:100%"
                    ></el-autocomplete>
                    <span style="font-size:10px;" v-show="is_seen">您绑定的人员为：<b style="color:red">{{now_select_people}}</b></span>
                </el-form-item>
                <el-form-item label="管理员角色" prop="admin_role">
                    <el-select v-model="addForm.admin_role" placeholder="请选择">
                        <el-option
                                v-for="item in select_role_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="所属部门" prop="dept_id">-->
                <!--<organized-cascader @cascaderChange="cascaderChange">-->
                <!--</organized-cascader>-->
                <!--</el-form-item>-->
                <el-form-item label="状态" prop="add_status">
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">有效</el-radio>
                        <el-radio :label="0">无效</el-radio>
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
                <el-form-item label="登陆账号" prop="username">
                    <el-input type="text" placeholder="请输入字母数字组合" v-model="editForm.username"
                              auto-complete="off"
                              :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="userpwd">
                    <el-input type="password" placeholder="请输入字母数字组合 最少6位" v-model="editForm.userpwd"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="绑定员工" prop="people_id">
                    <el-autocomplete
                            v-model="editForm.bind_people"
                            class="inline-input"
                            :fetch-suggestions="bindSearch"
                            :props="autosearch"
                            placeholder="请输入员工姓名"
                            @select="handleBindSelectEditForm"
                            style="width:100%"
                    ></el-autocomplete>
                    <span style="font-size:10px;" v-show="is_seen">您绑定的人员为：<b style="color:red">{{now_select_people}}</b></span>
                </el-form-item>
                <el-form-item label="管理员角色" prop="admin_role">
                    <el-select v-model="editForm.admin_role" placeholder="请选择">
                        <el-option
                                v-for="item in select_role_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="add_status">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label="1">有效</el-radio>
                        <el-radio :label="0">无效</el-radio>
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
    import provLatn from '../../components/provLatn.vue';
    import organizedCascader from '../../components/organizedCascader.vue';
    import '../../assets/elCss/table.css';
    import '../../assets/elCss/loading.css';

    const crypto = require('crypto');
    const hash = crypto.createHash('md5');

    export default {
        data() {
            return {
                local_people_info: {},
                tableData: [{
                    username: '',
                    people_name: '',
                    prov_latn_name: '',
                    dept_name: '',
                    status: -1,
                }], //需要向table填写的数据
                select_role_list: [],
                autosearch: {
                    value: 'people_name',
                    label: 'label'
                },
                now_select_people:'',
                is_seen:false,
                //操作的方法
                tableLoading: true,
                filters: {
                    username: '',
                    people_name:'',
                    role_select: ''
                },
                deltip: false,
                temp_del_id: 0,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    username: [
                        {required: true, message: '请输入登陆账号', trigger: 'blur'},
                    ],
                    userpwd: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    username: '',
                    userpwd: '',
                    people_id: 0,
                    admin_role: '',
                    status: 1,
                    prov_latn_id: '',
                    select_user_id: 0,
                    bind_people: '',
                    select_dept_id: 0
                },
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    username: [
                        {required: true, message: '请输入登陆账号', trigger: 'blur'},
                    ],
                    userpwd: [
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    username: '',
                    userpwd: '',
                    people_id: 0,
                    admin_role: '',
                    status: 1,
                    prov_latn_id: '',
                    select_user_id: 0,
                    bind_people: '',
                    select_dept_id: 0
                },
                //分页查询相关
                currentPage: 1,
                tableDataTotal: 0,
                pageSize: 10,
                //输入建议
                bind_get_flag: false,
                bind_people_list: [],
                bind_state: ''
            }
        },
        methods: {
            cascaderChange(call) {
                this.addForm.select_dept_id = call.pop();
            },
            bindSearch(queryString, cb) {
                var bind_people_list = this.bind_people_list;
                var results = queryString ? bind_people_list.filter(this.createFilter(queryString)) : bind_people_list;
                // 调用 callback 返回建议列表的数据
                console.log(bind_people_list);
                cb(results);
            },
            createFilter(queryString) {
                return (bind_people_list) => {
                    return (bind_people_list.people_name.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleBindSelectAddForm(item) {
                //将选中的人员id赋值给addForm.select_user_id 隐藏域
                this.addForm.select_user_id = item.id;
                //标红显示选择的人员
                this.is_seen = true;
                this.now_select_people = item.people_name;
            },
            handleBindSelectEditForm(item) {
                //将选中的人员id赋值给addForm.select_user_id 隐藏域
                this.editForm.select_user_id = item.id;
                //标红显示选择的人员
                this.is_seen = true;
                this.now_select_people = item.people_name;
            },
            paginationSizeChange(call) {
                this.pageSize = call;
                let params = {page: this.currentPage, count: this.pageSize}
                this.getPagedAdminList(this, params);
            },
            currentChange(call) {
                let params = {page: call, count: this.pageSize}
                this.getPagedAdminList(this, params);
            },
            //分页查询管理员信息
            getPagedAdminList(vm, params){
                vm.tableLoading = true;
                vm.$ajax.post('/admin/admin_list', params).then(res => {
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
            getRoleList(){
                this.$ajax.post('/role/role_list', {}).then(res => {
                    let result = res.data;
                    if (result.errno == 0) {
                        this.select_role_list = result.data;
                    }
                }).catch(err => {
//                    this.tableLoading = false;
                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },
            //顶部多条件查询
            getAdminListQuery(){
                let params = {
                    page:1,
                    count:10,
                    username:this.filters.username,
                    people_name:this.filters.people_name,
                    role_id:this.filters.role_select
                }
                this.getPagedAdminList(this, params);
            },
            //显示新增界面
            addAdmin: function () {
                this.addFormVisible = true;
                //初始化重置now_select_people,并置为不可见
                this.is_seen = false;
                this.now_select_people ="";

                if (!this.bind_get_flag) {
                    //初始化加载bind_people_list
                    let search_content = this.addForm.bind_people;
                    this.$ajax.post('/admin/get_bind_people_list', {search_content: search_content}).then(response => {
                        let result = response.data;
                        if (result.errno == 0) {
                            result.data.forEach(item => {
                                item.label = item.people_name + "[" + item.dept_name + "]";
                            });
                            this.bind_people_list = result.data;
                            this.bind_get_flag = true;
                        } else {
                            this.$message({message: result.errmsg, type: 'error'});
                        }
                    }).catch(error => {
                        console.log(error.message);
                        this.$message({message: error.message, type: 'error'});
                    });
                }
            },
            //处理新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        console.log('para===>',para);
                        let addinfo = {
                            username: para.username,
//                            userpwd: hash.update(para.userpwd).digest("hex"),
                            userpwd:para.userpwd,
                            people_id: para.select_user_id,
                            status: para.status,
                            role_id: para.admin_role
                        };
                        console.log(addinfo);
                        this.$ajax.post('/admin/admin_add', addinfo).then(response => {
                            let result = response.data;
                            console.log('result===>',result);
                            this.addLoading = false;
                            if(result.errno==10001){
                                this.$message({
                                    message:'登陆账号已被占用,请重新输入',
                                    type:'error'
                                });
                                return ;
                            }
                            if (result.errno == 0) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getPagedAdminList(this, {page: 1, count: 10});
                            }
                            else {
                                this.$message({
                                    message: '提交失败',
                                    type: 'error'
                                });
                            }
                        }).catch(error => {
                            console.log(error.message);
                            this.$message({message: error.message, type: 'error'});
                        });
                    }
                });
            },
            //显示编辑界面
            editAdmin: function (index, row) {
                this.editFormVisible = true;
                this.is_seen = true;
                this.now_select_people = row.people_name;
                if (!this.bind_get_flag) {
                    //初始化加载bind_people_list
                    let search_content = this.addForm.bind_people;
                    this.$ajax.post('/admin/get_bind_people_list', {search_content: search_content}).then(response => {
                        let result = response.data;
                        if (result.errno == 0) {
                            result.data.forEach(item => {
                                item.label = item.people_name + "[" + item.dept_name + "]";
                            });
                            this.bind_people_list = result.data;
                            this.bind_get_flag = true;
                        } else {
                            this.$message({message: result.errmsg, type: 'error'});
                        }
                    }).catch(error => {
                        console.log(error.message);
                        this.$message({message: error.message, type: 'error'});
                    });
                }
                //动态遍历所有row值，copy到v-model中,不能使用Object.assign深拷贝
                for(let key in row){
                    this.editForm[key] = row[key];
                }
                this.editForm.bind_people = row.people_name;
                this.editForm.admin_role = row.role_id;
                this.editForm.select_user_id = row.people_id;
                console.log(this.editForm);
            },
            //处理编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);
                        console.log('para===>',para);
                        let editinfo = {
                            id:para.admin_id,
                            people_id: para.select_user_id,
                            status: para.status,
                            role_id: para.admin_role
                        };
                        //如果用户输入密码，则修改。不输入，则不修改
                        if(para.userpwd!=''){
                            editinfo.userpwd = para.userpwd;
                        }

                        this.$ajax.post('/admin/admin_edit', editinfo).then(response => {
                            let result = response.data;
                            console.log('result===>',result);
                            this.editLoading = false;
                            if(result.errno==10001){
                                this.$message({
                                    message:'登陆账号已被占用,请重新输入',
                                    type:'error'
                                });
                                return ;
                            }
                            if (result.errno == 0) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getPagedAdminList(this, {page: 1, count: 10});
                            }
                            else {
                                this.$message({
                                    message: '提交失败',
                                    type: 'error'
                                });
                            }
                        }).catch(error => {
                            console.log(error.message);
                            this.$message({message: error.message, type: 'error'});
                        });
                    }
                });
            },
            deleteAdmin(scope){
                this.$confirm('确定删除改该管理员吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
//                    console.log(scope);
//                    return false;
                    this.$ajax.post('/admin/admin_delete', {id:scope.row.admin_id}).then(res => {
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
        },
        components: {
            provLatn,
            organizedCascader
        },

        //获取管理员列表
        mounted() {
            this.local_people_info = this.$localStore.get('people_info')[0];
            this.getRoleList();
            let params_default = {page: 1, count: 10}
            this.getPagedAdminList(this, params_default);

        },
        computed: {}
    }

</script>

