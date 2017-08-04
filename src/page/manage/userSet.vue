<template>
    <div>
        <el-dialog
                title="个人信息"
                :visible.sync="infoDialog"
                size="large"
                :before-close="handleClose">
            <span slot="title">
                <span>个人信息&nbsp;&nbsp;<el-button size="small" @click="editModeBtn" :class="{editMode:editMode}">{{editTips}}</el-button><small class="editModeTips" v-show="editMode">点击每项标题，弹出修改项</small></span>
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
                <el-button type="primary" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>


        <edit-dialog
                :cell="cell"
                :editDialog="editDialog"
                @closeDia="closeDia"
                @sureEdit="sureEdit">
        </edit-dialog>
        <table1
                :operates="operate"
                :tableData="tableData"
                :tdArr="tdArr"
                :tableLoading="tableLoading"
                @info="info"
                @add="addPeople"
                @delete="deletePeople"
        ></table1>

    </div>
</template>

<script>
    import table1 from '../../components/table1.vue';
    import '../../assets/elCss/loading.css'
    import cellArr from '../../components/cellArr.vue'
    import editDialog from '../../components/editDialog.vue'
    import form1 from '../../components/form.vue';
    import {people, selectArr} from '../../assets/kvword.js';
    import {notEmpty} from '../../assets/rules.js'

    const helper = require('../../tools/helper.js')

    export default {
        data() {
            return {
                //需要向table填写的数据
                tableData: [],
                //td 显示的列
                tdArr: [{lable: '姓名', prop: 'people_name', width: '180', align: 'center'},
                    {lable: '党员类型', prop: 'type_name', width: '180', align: 'center'},
                    {lable: '民族', prop: 'people_race', width: '180', align: 'center'},
                    {lable: '籍贯', prop: 'people_residence', width: '180', align: 'center'},
                    {lable: '出生年月', prop: 'people_birthday', width: '180', align: 'center'},
                    {lable: '性别', prop: 'people_gender', width: '80', align: 'center'}],
                //操作的方法，clickFun为父组件向子组件传递的事件
                operate: [{lable: '查看/编辑', type: '', clickFun: 'info', size: "small"},
                    {lable: '添加', type: '', clickFun: 'add', size: "small"},
                    {lable: '删除', type: 'danger', clickFun: 'delete', size: "small"}],

                tableLoading: false,

                infoDialog: false,

                cellDate: [],

                cell: {},
                editDialog: false,

                editTips:'进入编辑模式',
                editMode:false,

                addDialog: false,
                dataArr: [],
                selectArr: selectArr,

                deleteDialog:false,
                clickRowData:{}

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
                })
                this.cellDate = arr;
            },
            //打开编辑
            editModeBtn() {
                this.editMode = !this.editMode;
                if(this.editMode){
                    this.editTips = '退出编辑模式'
                }else{
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
                        params.userinfo = form;
                        this.$ajax.post('/people/adduser', params).then(res => {
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
            sureDelete(){
                let params = {};
                console.log('id--',this.clickRowData);
                params.id = this.clickRowData.id;
                this.$ajax.post('/people/delteteuser',params).then(res=>{
                    console.log('res---', res)
                    if (res.data.errno == 0) {
                        this.$message({message: '删除成功', type: 'success'})
                        this.deleteDialog = false;
                        this.tableData.splice(this.clickRowData.index,1);
                    } else {
                        this.deleteDialog = false;
                        this.$message({message: '删除失败', type: 'error'})
                    }
                }).catch(err=>{
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
            deleteHandleClose(){
                this.deleteDialog =false;
            },
            //更改信息
            editCell(cell) {
                this.cell = {};
                this.cell = cell;
                console.log('cell----', cell);
                if (cell.oType == 'data' && cell.value == '无') {
                    cell.value = new Date()
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
                console.log(params);
                this.$ajax.post('/people/updateuser', params).then(res => {
                    if (res.data.errno == 0) {
                        this.$message({message: '修改成功', type: 'success'});
                        differenceDataShow(['type_name', 'people_race', 'people_residence'], cell, form);
                        this.tableData[cell.tableIndex][cell.key] = form.value;
                        this.cell.value = form.value;
                        this.editDialog = false;
                    } else {
                        console.log(res.data);
                        this.$message({message: '修改失败，请重试' + res.data, type: 'error'})
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message({message: '修改失败，请重试', type: 'error'})
                })
            }
        },
        components: {
            table1, cellArr, editDialog, form1
        },

        //获取用户列表
        mounted() {
            this.tableLoading =true;
            this.$ajax.post('/people/userlist', {}).then(res => {
                console.log('----', res)
                if (res.data.errno == 0) {
                    this.tableData = res.data.data;
                    this.tableLoading = false;
                } else {
                    this.tableLoading = false;
                }
            }).catch(err => {
                this.tableLoading = false;
                this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                console.log('----', err)
            });
        },
        computed: {}
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
    .editMode{
        border:#FFAB91 1px solid;
        color: orangered;
    }
    .editModeTips{
        color: #BBB;
        margin-left: 1rem;
    }
</style>

