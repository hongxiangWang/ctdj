<template>
    <div id="userSet">
        <div id="userSetSearch">
            <el-row>
                <el-col :span="5">
                    <el-input
                            placeholder="输入ID或者账户名进行筛选"
                            icon="delete"
                            v-model="input"
                            :on-icon-click="handleIconClick" @change="inputChange">
                    </el-input>
                </el-col>
                <el-col :span="2" :push="4">
                    <el-button type="primary" icon="plus" @click="dialogFormVisible = true">添加用户</el-button>
                </el-col>
                <el-col :span="6" :push="6">
                    <el-input
                            placeholder="请输入户名进行搜索"
                            icon="delete"
                            v-model="searchInput"
                            :on-icon-click="handleSearchIconClick">
                    </el-input>
                </el-col>
                <el-col :span="2" :push="6" id="search">
                    <el-button type="primary" icon="search" @click="searchButtonClick">搜索
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <p>搜索结果：共计{{tableData.length}}个用户</p>
        <el-table
                :data="tableData"
                border
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                max-height="500"
                :row-class-name="rowTableStyle"
                style="width: 100%">
            <el-table-column
                    class-name="tableIndex"
                    type="index"
                    width="60">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="ID"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="people_name"
                    label="用户名"
                    width="220">
            </el-table-column>
            <el-table-column
                    prop="people_account"
                    label="协同账户"
                    width="220">
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    label="单位"
                    width="320">
            </el-table-column>
            <el-table-column
                    prop="phone_number"
                    label="电话"
                    width="320">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                <template scope="scope">
                    <!--<el-button @click="handleClick(scope.$index,scope.$data)" type="text" size="small">查看</el-button>-->
                    <el-button type="text" size="small" @click="edit(scope.$index,scope.$data)">编辑</el-button>
                    <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                            type="text"
                            size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close='dialogClose'>
            <el-form :model="form">
                <el-form-item label="用户名" label-width="80px">
                    <el-input v-model="form.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="80px">
                    <el-input v-model="form.password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                size="tiny"
                :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!--<el-pagination-->
        <!--layout="prev, pager, next"-->
        <!--:total="100">-->
        <!--</el-pagination>-->


    </div>
    </div>
</template>

<script>
    import popover from './popover.vue'
    let axajData = [];
    let searchResult = [];
    let qs = require('qs');
    export default {
        data() {
            return {
                tableLoading: false,
                tableData: [],
                gridData: [],
                rowTableStyle: () => {
                },
                input: '',
                searchInput: '',
                dialogEditVisible: false,
                dialogFormVisible: false,
                chooseIndex: -1,
                dialogTitle: "新增用户",
                form: {
                    username: '',
                    password: '',
                    lock: false,

                }
            }
        },
        methods: {
            edit(index, data) {
                this.dialogFormVisible = true;
                this.dialogTitle = '编辑用户'
                this.chooseIndex = index;
                this.form.username = axajData[index].username;
                this.form.password = axajData[index].password;
                axajData[index].lock == '未锁' ? this.form.lock = false : this.form.lock = true;
            },
            handleIconClick(ev) {
                this.input = ''
                this.tableData = axajData
            },
            inputChange(call){
                if (call.length <= 0) {
                    this.searchInput == '' ? this.tableData = axajData : this.tableData = searchResult;
                } else {
                    this.searchInput == '' ?
                        this.tableData = axajData.filter(function (element, index, self) {
                            return element.id == call || element.username.indexOf(call) >= 0;
                        }) :
                        this.tableData = searchResult.filter(function (element, index, self) {
                            return element.id == call || element.username.indexOf(call) >= 0;
                        });
                }
            },
            handleSearchIconClick(){
                this.searchInput = ''
                this.tableData = axajData;
            },
            searchButtonClick(){
                if (this.searchInput.length <= 0) {
                    this.tableData = axajData;
                } else {
                    let parms = {username: this.searchInput}
                    this.$ajax.post('/user/searchuser', parms).then(response => {
                        searchResult = response.data.data.data;
                        this.tableData = response.data.data.data
                    }).catch(error => {
                        this.$message({message: '获取信息失败' + error.message, type: 'error'})
                    })
                }
            },
            dialogClose(){
                this.form.username = '';
                this.form.password = ''
                this.dialogTitle = '新增角色';
                this.chooseIndex = -1;
            },
            save(){
                this.chooseIndex == -1 ? addUser(this) : updateUserInfo(this);
                this.dialogFormVisible = false;
            },
            deleteRow(index, rows) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUser(this, rows, index);
                }).catch((error) => {
                    console.log(error)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        }, components: {
            popover
        },

        //获取用户列表
        mounted(){
            this.tableLoading = true;
            this.$ajax.post('/user/getuserlist')
                .then((respons) => {
                    axajData = respons.data.data.data;
                    console.log('getuserlist---', respons.data)
                    this.tableData = respons.data.data.data;
                    this.tableLoading = false;
                }).catch((error) => {
                this.$message({message: '获取信息失败' + error.message, type: 'error'})
                this.tableData = [];
                this.tableLoading = false;
            })
        },
        computed: {}
    }
    //更新用户
    function updateUserInfo(vm) {
        let json = {};
        json.username = vm.form.username;
        json.password = vm.form.password;
        vm.form.lock ? json.lock = 1 : json.lock = 0;
        let chooseIndex = vm.chooseIndex;

        let params1 = {
            userinfodata: json,
            user_id: vm.tableData[vm.chooseIndex].id
        }
        vm.$ajax.post('/user/updateuserinfo', params1)
            .then(response => {
                if (Number(response.data.data.flg) == 0) {
                    vm.tableData[chooseIndex].username = json.username;
                    vm.tableData[chooseIndex].password = json.password;
                    vm.form.lock ? vm.tableData[chooseIndex].lock = '已锁' : vm.tableData[chooseIndex].lock = '未锁';
                } else {
                    vm.$message({message: '失败，' + response.data.data.msg, type: 'error'})
                }
            }).catch(error => {
            vm.$message({message: '获取信息失败' + response.data.data.message, type: 'error'})
        })
    }
    //添加用户
    function addUser(vm) {
        let json = {};
        json.username = vm.form.username;
        json.password = vm.form.password;
        vm.form.lock ? json.lock = 1 : json.lock = 0;
        let params = {
            userdata: json
        }
        vm.$ajax.post('/user/adduser', params)
            .then(response => {
                console.log(JSON.stringify(response.data))
                if (Number(response.data.data.flg) == 0) {
                    json.id = response.data.data.data;
                    vm.form.lock ? json.lock = '已锁' : json.lock = '未锁';
                    json.status = '正常';
                    vm.tableData.push(json);
                    vm.$message({message: '添加成功', type: 'success'})
                } else {
                    vm.$message({message: '添加失败，' + response.data.data.msg, type: 'error'})
                }
            }).catch(error => {
            console.log(JSON.stringify(error.message))
        })
    }

    function deleteUser(vm, rows, index) {
        console.log(vm.chooseIndex)
        vm.$ajax.post('/user/deleteuser', {user_id: rows[index].id}).then(response => {
            if (Number(response.data.data.flg) == 0) {
                rows.splice(index, 1);
                vm.$message({
                    type: 'success',
                    message: '删除成功'
                });
            }
        }).catch(error => {
            console.log(JSON.stringify(error.message))
        })
    }
</script>

