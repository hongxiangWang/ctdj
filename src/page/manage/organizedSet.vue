<template>
    <div style="padding: 0 20px">
        <el-row>
            <el-col :span="14">
                <label>选择党支部</label>
                <!--<el-cascader-->
                <!--ref="cascader"-->
                <!--expand-trigger="hover"-->
                <!--:options="options"-->
                <!--:props="props"-->
                <!--v-model="selectValue"-->
                <!--@change="cascaderChange">-->
                <!--</el-cascader>-->
                <organized-cascader
                        @cascaderChange="cascaderChange">
                </organized-cascader>
                <span style="color: #FF8A65">{{selcectTitle}}</span>
            </el-col>
            <el-col :span="10">
                <el-row type="flex" justify="end">
                    <el-col :span="8">
                        <el-input
                                placeholder="请选择日期"
                                icon="search"
                                v-model="input"
                                :on-icon-click="handleIconClick">
                        </el-input>
                    </el-col>
                    <el-col :span="16" :offset="1">
                        <el-button icon="edit">修改</el-button>
                        <el-button icon="plus" @click="addBtn">增加</el-button>
                        <el-button icon="delete2" @click="deleteBtn">删除</el-button>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>

        <br>
        <br>
        <cell-arr
                :cellDate="cellDate"
                :editMode="false"></cell-arr>

        <el-dialog
                title="添加一个新组织"
                :visible.sync="addDialog"
                size="large"
                :before-close="addDialogClose">
            <form1 ref="form1"
                   :dataArr="formData"
                   :selectArr="selectArr"
                   @cascaderChange="cascaderChangeFrom"
                   @deptmentTypeChange="deptmentTypeChange"></form1>
            <span slot="footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd">确 定</el-button>
             </span>
        </el-dialog>


        <el-dialog
                title="确定"
                :visible.sync="deleteDialog"
                size="tiny"
                :before-close="delDialogClose">
            <span>是否要删除该党组织?</span>
            <span slot="footer">
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button type="danger" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
    import cellArr from '../../components/cellArr.vue'
    import form1 from '../../components/form.vue'
    import organizedCascader from '../../components/organizedCascader.vue'

    const helper = require('../../tools/helper.js');
    import {deptment, selectArr, cascaderArr, cascaderProps} from '../../assets/kvword.js';
    import {notEmpty} from '../../assets/rules.js'

    export default {
        data() {
            return {
                options: [],
                selectValue: [],
                props: {
                    label: "dept_name",
                    value: "id",
                    children: "children"
                },
                cellDate: [],
                selcectTitle: '',
                input: '',
                addDialog: false,
                formData: [],
                selectArr: selectArr,
                formCascader: '',

                deleteDialog: false,

                account: require('store').get('people_info')[0]
            }
        },
        methods: {
            cascaderChange(call) {
                let title = ''
                this.options.forEach(value => {
                    if (value.id == call[0]) {
                        title = value.label;
                        value.children.forEach(v => {
                            if (v.id == call[1]) {
                                title += '/' + v.label;
                                this.selcectTitle = title;
                            }
                        })
                    }
                })
                this.$ajax.post('/department/dept_search_by_id', {dept_id: call[1]}).then(res => {
                    console.log('res------', res)
                    let arr = helper.createTableArr(deptment, res.data.data[0]);
                    arr.forEach(value => {
                        value.oType = value.type;
                        value.type = value.type != 'file' ? 'text' : 'file';
                        helper.selectDataShow(['dept_status', 'dept_type'], selectArr, value)
                    })
                    this.cellDate = arr;
                }).catch(err => {
                    console.log('res------', err)
                })
            },
            handleIconClick() {

            },
            addDialogClose() {
                this.addDialog = false;
            },
            addBtn() {
                this.addDialog = true;
                let arr = helper.createTableToForm(deptment);
                arr.forEach(value => {
                    if (value.type == 'cascader') {
                        value.value = [];
                        value.cascaderOptions = cascaderArr[value.key];
                        value.props = cascaderProps[value.key];
                    }
                    if (value.key == 'dept_type') {
                        value.selectClick = 'deptmentTypeChange'
                    }
                    value.rule = notEmpty;
                })
                this.formData = arr;
            },
            deptmentTypeChange(call) {
                let pid = {
                    label: '隶属党群',
                    value: '',
                    rule: notEmpty,
                    key: 'pid',
                    type: 'select'
                }
                if (call.value == '党支部' && this.formData.pid == undefined) {
                    this.selectArr.pid = this.groupArr;
                } else {
                    this.formData.forEach((value, index, self) => {
                        if (value.key == 'pid') {
                            self.splice(index, 1)
                        }
                    })
                    return;
                }
                //this.selectArr.dept_type[1].disabled = true;
                this.formData.push(pid);
                console.log('deptmentTypeChange-----', call)
            },
            cascaderChangeFrom(call) {
                this.formCascader = call[0] + '/' + call[1];
            },
            sureAdd() {
                let form = this.$refs.form1.form;
                this.$refs.form1.$refs.form.validate((valid) => {
                    if (valid) {
                        form.prov_latn_id = form.prov_latn_id[0] + form.prov_latn_id[1];
                        selectDataShow2(this.selectArr, form);
                        let params = {};
                        params.deptdata = form;
                        console.log('params------', params);
                        this.$ajax.post('/department/dept_add', params).then(res => {
                            console.log('res------', res.data)
                            if (res.data.errno == 0) {
                                this.$message({message: '添加成功', type: 'success'});
                                this.addDialog = false;
                            } else {
                                this.$message({message: '添加组织失败，请重试', type: 'error'});
                            }
                        }).catch(err => {
                            console.log('err------', err);
                            this.addDialog = false;
                            this.$message({message: '添加组织失败，请重试', type: 'error'});
                        })
                    } else {
                        this.$message({message: '请填写完整表单', type: 'warning'})
                    }
                });
            },
            deleteBtn() {
                if (this.selectValue.length == 0) {
                    this.$message({message: '请先在左边选择党支部', type: 'warning'});
                    return;
                }
                this.deleteDialog = true;

            },
            sureDelete() {
                this.$ajax.post('/department/dept_delete', {dept_id: this.selectValue[1]}).then(res => {
                    console.log('res------', res.data)
                    if (res.data.errno == 0) {
                        this.$message({message: '删除成功', type: 'success'});
                        this.deleteDialog = false;
                    } else {
                        this.$message({message: '删除组织失败，请重试', type: 'error'});
                    }
                }).catch(err => {
                    this.$message({message: '删除组织失败，请重试', type: 'error'});
                    this.deleteDialog = false;
                    console.log('res------', err)
                })
            },
            delDialogClose() {
                this.deleteDialog = false;
            }
        },
        components: {
            cellArr, form1, organizedCascader
        },
        computed: {
            groupArr() {
                return this.$store.state.organized.party;
            }
        },
        mounted() {
            if(this.account.role_id==2){
                this.selectArr.dept_type[1].disabled = true;
            }
        }

    }


    //select数据处理
    function selectDataShow2(arr, json) {
        for (let k in json) {
            if (arr[k] != undefined) {
                arr[k].forEach(v => {
                    if (json[k] == v.label) {
                        json[k] = v.value;
                    }
                })
            }
        }
        if (json.pid == undefined) {
            json.pid = 1
        }

    }
</script>