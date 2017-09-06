<template>
    <div>
        <el-dialog
                title="个人信息"
                :visible.sync="infoDialog"
                size="large"
                :before-close="handleClose">
            <span slot="title">
                <span>个人信息&nbsp;&nbsp;<el-button size="small" @click="editModeBtn" :class="{editMode:editMode}">{{editTips}}</el-button><small
                        class="editModeTips" v-show="editMode">点击每项标题，弹出修改项</small></span>
            </span>
            <span>
            <cell-arr
                    :cellDate="cellDate"
                    :editMode="editMode"
                    @edit="editCell">
            </cell-arr>
            </span>
        </el-dialog>


        <el-dialog
                title="添加党员信息"
                :visible.sync="addDialog"
                size="large"
                :before-close="addHandleClose">
            <span>
                <form1
                        ref="form1"
                        :dataArr="dataArr"
                        :selectArr="selectArr">
                </form1>
            </span>
            <div slot="footer">
                <el-button @click="addDialog =false">取 消</el-button>
                <el-button type="primary" @click="sureAdd">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog
                title="提示"
                :visible.sync="deleteDialog"
                size="tiny"
                :before-close="deleteHandleClose">
            <span>删除该用户？</span>
            <span slot="footer">
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button type="danger" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>


        <edit-dialog
                ref="editDialog"
                :cell="cell"
                :editDialog="editDialog"
                @closeDia="closeDia"
                @sureEdit="sureEdit">
        </edit-dialog>
        <el-row>
            <el-col :span="22" :push="1">


                <label></label>
                <span>
                    <organized-cascader
                            @cascaderChange="cascaderChange">
                    </organized-cascader>
                </span>
                <el-select ref="select" v-model="chooseVulue" multiple placeholder="请选择" @change="selectChange"
                           style="width: 300px;" @remove-tag="removeTag"  v-if="false">
                    <el-option
                            v-for="item in chooseArray"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <span @keyup.enter="queryClick">
                       <el-input
                               style=" width: auto"
                               v-if="true"
                               placeholder="输入姓名"
                               icon="search"
                               v-model="inputCon"
                               :on-icon-click="queryClick">
                    </el-input>
                 </span>


                <span>总共：{{tableDataTotal}}条数据</span>
            </el-col>
            <el-col :span="1" :push="0">
                <el-button @click="addPeople">添加</el-button>
            </el-col>
        </el-row>


        <table1
                style="margin-top: 10px"
                :operates="operate"
                :tableData="tableData"
                :tdArr="tdArr"
                :tableLoading="tableLoading"
                @info="info"
                @delete="deletePeople"
        ></table1>

        <div class="block">
            <el-pagination
                    style="margin: 0 auto;text-align: center;margin-top: 30px"
                    @size-change="paginationSizeChange"
                    @current-change="currentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 30, 40,50]"
                    :page-size="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="tableDataTotal">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import table1 from '../../components/table1.vue';
    import '../../assets/elCss/loading.css'
    import cellArr from '../../components/cellArr.vue'
    import editDialog from '../../components/editDialog.vue'
    import form1 from '../../components/form.vue';
    import organizedCascader from '../../components/organizedCascader.vue'
    import {people, selectArr, peopleQuerySelect} from '../../assets/kvword.js';
    import {notEmpty} from '../../assets/rules.js'

    const helper = require('../../tools/helper.js')

    export default {
        data() {
            return {
                //需要向table填写的数据
                tableData: [],
                //td 显示的列
                tdArr: [{lable: '姓名', prop: 'people_name', width: '180', align: 'center'},
                   // {lable: '党员类型', prop: 'type_name', width: '180', align: 'center'},
                    {lable: '性别', prop: 'people_gender', width: '80', align: 'center'},
                    {lable: '民族', prop: 'people_race', width: '180', align: 'center'},
                    {lable: '入党时间', prop: 'people_enter_party_time', width: '180', align: 'center'},
                    {lable: '籍贯', prop: 'people_residence', width: '180', align: 'center'},
                    {lable: '出生年月', prop: 'people_birthday', width: '180', align: 'center'},
                   ],
                //操作的方法，clickFun为父组件向子组件传递的事件
                operate: [
                    {lable: '查看/编辑', type: '', clickFun: 'info', size: "small"},
                    {lable: '删除', type: 'danger', clickFun: 'delete', size: "small"}
                ],

                tableLoading: false,

                infoDialog: false,

                cellDate: [],

                cell: {},
                editDialog: false,

                editTips: '进入编辑模式',
                editMode: false,

                addDialog: false,
                dataArr: [],
                selectArr: selectArr,

                deleteDialog: false,
                clickRowData: {},

                chooseVulue: [],
                chooseArray: peopleQuerySelect,
                isShowInput: false,
                inputCon: '',

                currentPage: 1,
                tableDataTotal: 0,
                pageSize: 20,

                upParams: {
                    people_type: '',
                    people_name: '',
                    depart_id:''
                }


            }
        },
        methods: {
            //查看用户信息
            info(index, row) {
                this.infoDialog = true;
                let arr = helper.createTableArr(people, row);
                arr.forEach(value => {
                    value.oType = value.type;
                    value.type = value.type != 'file' ? 'text' : 'file';
                    value.tableIndex = index;
                    if(value.key == 'depart_id'){
                        value.value = value.value == null || row['dept_name'] == null? '无':row['dept_name']
                    }
                })
                this.cellDate = arr;
            },
            //打开编辑
            editModeBtn() {
                this.editMode = !this.editMode;
                if (this.editMode) {
                    this.editTips = '退出编辑模式'
                } else {
                    this.editTips = '进入编辑模式'
                }

            },
            //添加用户
            addPeople(index, row) {
                this.dataArr = [];
                this.addDialog = true;
                let noNeedEmptyRule = ['people_jobname']
                let arr = helper.createTableToForm(people);
                arr.forEach(value => {
                    if (noNeedEmptyRule.indexOf(value.key) == -1) {
                        value.rule = notEmpty;
                    }
                   if(value.key =='depart_id'){
                        value.props = {
                            label: "dept_name",
                            value: "id",
                            children: "children"
                        }
                        value.value=[];
                        value.cascaderOptions = this.organized_data;
                   }
                })

                console.log('arr----', arr)
                this.dataArr = arr;
            },
            //添加保存
            sureAdd() {
                let form = this.$refs.form1.form;
                this.dataArr.forEach(v => {
                    if (v.type == 'date' && form[v.key] != NaN) {
                        let date = new Date(form[v.key]);
                        form[v.key] = date.getFullYear() + '-' + dealDate(date.getMonth() + 1) + '-' + dealDate(date.getDate());
                    }
                })

                this.$refs.form1.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = {};
                        selectArr.type_name.forEach(value => {
                            if (value.label == form.type_name) {
                                form.people_type = Number(value.value);
                            }
                        })


                        if(form.depart_id.length>0){
                            form.depart_id = form.depart_id[form.depart_id.length-1];
                        }
                        //form.people_residence = helper.getSelectLabel(selectArr.people_residence,form.people_residence);

                        params.userinfo = form;
                        console.log('res---', params.userinfo);
                        //return;
                        this.$ajax.post('/people/user_add', params).then(res => {
                            console.log('res---', res)
                            if (res.data.errno == 0) {
                                this.$message({message: '添加成功', type: 'success'})
                                this.addDialog = false;
                                this.tableData.push(form);
                            } else {
                                this.addDialog = false;
                                this.$message({message: '添加失败', type: 'error'})
                            }
                        }).catch(err => {
                            this.addDialog = false;
                            console.log('err---', err)
                        });

                    } else {
                        this.$message({message: '请填写完整', type: 'error'})
                    }
                })
            },
            //删除用户
            deletePeople(index, row) {
                this.deleteDialog = true;
                row.index = index;
                this.clickRowData = row;
            },
            //确定删除用户
            sureDelete() {
                let params = {};
                console.log('id--', this.clickRowData);
                params.id = this.clickRowData.id;
                this.$ajax.post('/people/user_delete', params).then(res => {
                    console.log('res---', res)
                    if (res.data.errno == 0) {
                        this.$message({message: '删除成功', type: 'success'})
                        this.deleteDialog = false;
                        this.tableData.splice(this.clickRowData.index, 1);
                    } else {
                        this.deleteDialog = false;
                        this.$message({message: '删除失败', type: 'error'})
                    }
                }).catch(err => {
                    console.log('err---', err)
                    this.deleteDialog = false;
                    this.$message({message: '删除失败', type: 'error'})
                })
            },
            //关闭详细信息弹出
            handleClose() {
                this.editMode = false;
                this.editTips = '进入编辑模式'
                this.infoDialog = false;
            },
            //关闭添加弹窗
            addHandleClose() {
                this.addDialog = false;
            },
            deleteHandleClose() {
                this.deleteDialog = false;
            },
            //更改信息
            editCell(cell) {
                this.cell = {};
                this.cell = cell;
                console.log('cell----', cell);
                if (cell.oType == 'data' && cell.value == '无') {
                    cell.value = new Date()
                }
                if (cell.oType == 'cascader' ) {
                    cell.value = [];
                }
                this.editDialog = true;
            },
            //关闭修改信息弹窗
            closeDia() {
                this.cell = {};
                this.editDialog = false;
            },
            //修改信息确认
            sureEdit(form, cell) {
                let oData = this.tableData[cell.tableIndex];
                oData[cell.key] = form.value;
                let params = {
                    peopleid: oData.id,
                    key: cell.key,
                    value: form.value
                }
                let selectProps = ['people_race', 'people_residence']
                differenceDataParams(cell, params, selectProps);
                if (cell.oType == 'date') {
                    let date = new Date(form.value);
                    let time = date.getFullYear() + '-' + dealDate(date.getMonth() + 1) + '-' + dealDate(date.getDate());
                    params.value = time;
                }

                if(params.key=='depart_id'){
                    params.value = params.value[params.value.length-1];
                }
                this.$ajax.post('/people/user_edit', params).then(res => {
                    if (res.data.errno == 0) {
                        this.$message({message: '修改成功', type: 'success'});
                        differenceDataShow(['type_name', 'people_race', 'people_residence'], cell, form);
                        this.tableData[cell.tableIndex][cell.key] = form.value;
                        if(cell.key =='depart_id'){
                            this.cell.value = this.$refs.editDialog.$refs.cascader.currentLabels;
                            let currentLabels = this.$refs.editDialog.$refs.cascader.currentLabels;
                            this.tableData[cell.tableIndex].dept_name =  currentLabels[currentLabels.length-1];
                        }else{
                            this.cell.value = form.value;
                        }
                        this.editDialog = false;
                    } else {
                        console.log(res.data);
                        this.$message({message: '修改失败，请重试' + res.data, type: 'error'})
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message({message: '修改失败，请重试', type: 'error'})
                })
            },
            //查询下拉选项改变的触发器
            selectChange(call) {
                let isName,isT1,isT2 = false;
                call.forEach((v) => {
                    switch (Number(v)) {
                        case 1:
                            this.upParams.people_type = 1;
                            isT1=true;
                            break;
                        case 2:
                            this.upParams.people_type = 2;
                            isT2=true;
                            break;
                        case 3:
                            this.upParams.people_name = this.inputCon;
                            isName = true;
                            break;
                        default:
                            this.upParams.people_type=''
                    }
                });
                if(call.length==0){
                    this.upParams.people_type=''
                }
                if(isT1&&isT2){
                    this.upParams.people_type='';
                }
                if (isName) {
                    this.isShowInput = true;
                } else {
                    this.isShowInput = false;
                    getQueryResult(this);

                }
                console.log('chooseVulue------',this.chooseVulue);
            },
            removeTag(call){
                console.log('removeTag---',call)
                if(call.currentValue == 3){
                    this.inputCon = ''
                    this.upParams.people_name = this.inputCon;
                }

                getQueryResult(this);
            },
            queryClick(call) {
                this.upParams.people_name = this.inputCon;
                let params = {page_num: this.currentPage, page_cnt: this.pageSize,people_name:this.upParams.people_name,depart_id:this.upParams.depart_id}
                getUserList(this, params);
            },
            //分页页数改变
            paginationSizeChange(call) {
                this.pageSize = call;
                let params = {page_num: this.currentPage, page_cnt: this.pageSize,people_name:this.upParams.people_name,depart_id:this.upParams.depart_id}
                getUserList(this, params);
            },
            //选择的当前页
            currentChange(call) {
                let params = {page_num: call, page_cnt: this.pageSize,people_name:this.upParams.people_name,depart_id:this.upParams.depart_id}
                getUserList(this, params);
            },
            //多联菜单发生改变
            cascaderChange(call){
                this.upParams.depart_id = call[call.length-1];
                let params = {page_num: this.currentPage, page_cnt: this.pageSize,people_name:this.upParams.people_name,depart_id:call[call.length-1]}
                getUserList(this, params);
            }
        },
        components: {
            table1, cellArr, editDialog, form1,organizedCascader
        },

        //获取用户列表
        mounted() {
            let params = {page_num: this.currentPage, page_cnt: this.pageSize,people_name:this.upParams.people_name,depart_id:this.upParams.depart_id}
           // let params = {page: 1, count: 10}
            getUserList(this, params);
        },
        computed: {
            organized_data() {
                return this.$store.state.organized.cascader_data;
            }
        }
    }

    //获取成员列表
    function getUserList(vm, params) {
        vm.tableLoading = true;
        vm.$ajax.post('/people/user_list', params).then(res => {
            if (res.data.errno == 0) {
                vm.tableData = res.data.data.result_list;
                vm.tableDataTotal = res.data.data.totalCnt;
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
    //差异化数据处理
    function differenceDataParams(cell, params, selectProps) {
        if (cell.key == "type_name") {
            params.key = 'people_type';
            return;
        }
        selectProps.forEach(v => {
            if (cell.key == v) {
                selectArr[v].forEach(value => {
                    if (value.value == cell.value) {
                        params.value = value.label;
                    }
                })
            }
        });
    }

    //select数据处理
    function differenceDataShow(selectProps, cell, form) {
        selectProps.forEach(v => {
            if (cell.key == v) {
                selectArr[v].forEach(value => {
                    if (value.value == form.value) {
                        form.value = value.label;
                    }
                });
            }
        })
    }

    function dealDate(n) {
        return n < 10 ? '0' + n : n;
    }

</script>

<style>
    .editMode {
        border: #FFAB91 1px solid;
        color: orangered;
    }

    .editModeTips {
        color: #BBB;
        margin-left: 1rem;
    }

    div.el-select__tags {
        max-width: 600px;
    }
</style>

