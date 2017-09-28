<template>
    <div style="padding: 0 80px">

        <el-row>
            <el-col :span="14">
                <label>选择党支部</label>
                <organized-cascader
                        @cascaderChange="cascaderChange">
                </organized-cascader>
                <span style="color: #FF8A65">{{selcectTitle}}</span>
            </el-col>
            <el-col :span="10">
                <el-row type="flex" justify="end">
                    <el-col :span="16" :offset="1">
                        <el-button icon="edit" @click="editBtn" :disabled="editDisabled">修改</el-button>
                        <el-button icon="plus" @click="addBtn"  v-if="account.role_id<3">增加</el-button>
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

        <ZTree
                ref='tree'
                :treeData="treeData1"
                :options="treeOptions"
                @node-click="itemClick"
                :key="2"
                style="padding: 10px 16px"
        />


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
                title="修改"
                :visible.sync="editDialog"
                size="large"
                :before-close="editDialogClose">
            <form1 ref="form2"
                   :dataArr="editFormData"
                   :selectArr="selectArr"
                   @cascaderChange="cascaderChangeFrom"
                   @deptmentTypeChange="deptmentTypeChange"></form1>
            <span slot="footer">
                <el-button @click="editDialogClose">取 消</el-button>
                <el-button type="primary" @click="sureEdit">确 定</el-button>
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

    import ZTree from 'vue2-lazy-tree'
    import 'vue2-lazy-tree/dist/vue2-tree.min.css'
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
                selectValue: '',
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

                account: require('store').get('people_info')[0],
                editDialog: false,
                editFormData: [],
                oCellDate: [],
                editDisabled: true,

                treeOptions: {
                    labelKey: 'name',
                    showCheckbox: false,
                    halfCheck: false,//控制父框是否需要半钩状态
                    iconClass: {                        // custom icon class, Default
                        close: 'icon-youjiantou',
                        open: 'icon-xiajiantou',
                        add: 'icon-add'
                    },
                },

                chooseDeptType:0,

            }
        },
        methods: {
            cascaderChange(call) {
                let title = '';
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
                });
                this.getNodeData(call[call.length - 1]);
                this.selectValue = call[call.length - 1];

            },
            handleIconClick() {

            },
            addDialogClose() {
                this.addDialog = false;
            },
            addBtn() {
                this.addDialog = true;
                this.formData = getForm();
            },
            //选择党支部、党委时监听器
            deptmentTypeChange(call) {
                console.log('deptmentTypeChange---', call.value)
                let pid = {
                    label: '隶属上级',
                    value: [],
                    rule: notEmpty,
                    key: 'pid',
                    type: 'cascader',
                    cascaderOptions:'',
                    props:{
                        label:'label',
                        value:"value"
                    }
                }
                this.chooseDeptType = call.value;
                switch (call.value){
                    case 4:
                        pid.cascaderOptions = this.groupArr2;
                        console.log('this.groupArr2---',this.groupArr2)
                        delFormPid(this);
                        addFormPid(this,pid);
                        break;
                    case 3:
                        pid.cascaderOptions = this.groupArr;
                        delFormPid(this);
                        addFormPid(this,pid);
                        break;
                    case 2:
                        delFormPid(this);
                        break;
                }
            },
            cascaderChangeFrom(call) {
                console.log('cascaderChangeFrom----',call)
                //this.formCascader = call[0] + '/' + call[1];
            },
            sureAdd() {
                let form = this.$refs.form1.form;
                this.$refs.form1.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = {};
                        if (form.pid == undefined) {
                            form.pid = 1;
                        }else{
                            form.pid = form.pid[form.pid.length-1]
                        }
                        switch (this.chooseDeptType){
                            case 1:
                                form.is_sub_dept = 0;
                                form.dept_type = 4;
                                break;
                            case 2:
                                form.dept_type = 2;
                                form.is_sub_dept = 0;
                                break;
                            case 3:
                                form.dept_type = 3;
                                form.is_sub_dept = 1;
                                break;
                        }
                        if(this.chooseDeptType==3){
                            form.is_sub_dept = 1;
                        }else{
                            form.is_sub_dept = 0;
                        }
                        params.deptdata = form;
                        this.$ajax.post('/department/dept_add', params).then(res => {
                            console.log('res------', res.data)
                            if (res.data.errno == 0) {
                                this.$message({message: '添加成功，2s后自动刷新', type: 'success'});
                                setTimeout(_ => {
                                    this.$store.commit('ORGANIZED_CASCADER_DATA', []);
                                    window.location.reload();
                                }, 2500)
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
                if (this.selectValue == '') {
                    this.$message({message: '请先在左边选择党支部', type: 'warning'});
                    return;
                }
                this.deleteDialog = true;

            },
            editBtn() {
                let noValueForm = getForm();
                noValueForm.forEach(v => {
                    v.value = this.oCellDate[v.key];
                });
                let pid = {
                    label: '隶属上级',
                    value: [],
                    rule: notEmpty,
                    key: 'pid',
                    type: 'cascader',
                    cascaderOptions:'',
                    props:{
                        label:'label',
                        value:"value"
                    }
                }
                console.log('editBtn========', this.oCellDate, noValueForm);
                this.editFormData = noValueForm;
                this.editDialog = true;

                switch (this.oCellDate.dept_type){
                    case 4:
                        pid.value = [this.oCellDate.pid]
                        pid.cascaderOptions = this.groupArr2;
                        delFormPid(this);
                        addFormPid(this,pid);
                        break;
                    case 3:
                        pid.value = [this.oCellDate.pid]
                        pid.cascaderOptions = this.groupArr;
                        delFormPid(this);
                        addFormPid(this,pid);
                        break;
                    case 2:
                        delFormPid(this);
                        break;
                }


            },
            sureDelete() {
                this.$ajax.post('/department/dept_delete', {dept_id: this.selectValue}).then(res => {
                    if (res.data.errno == 0) {
                        this.$message({message: '删除成功，2s后自动刷新', type: 'success'});
                        this.deleteDialog = false;
                        setTimeout(_ => {
                            this.$store.commit('ORGANIZED_CASCADER_DATA', []);
                            window.location.reload();
                        }, 2500)
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
            },
            editDialogClose() {
                this.editDialog = false;
                this.editFormData = [];
            },
            sureEdit() {
                let form = this.$refs.form2.form;
                this.$refs.form2.$refs.form.validate(valid => {
                    if (valid) {
                        let params = {};
                        if (form.pid == undefined) {
                            form.pid = 1;
                        }else{
                            form.pid = form.pid[form.pid.length-1]
                        }
                        switch (this.chooseDeptType){
                            case 1:
                                form.is_sub_dept = 0;
                                form.dept_type = 4;
                                break;
                            case 2:
                                form.dept_type = 2;
                                form.is_sub_dept = 0;
                                break;
                            case 3:
                                form.dept_type = 3;
                                form.is_sub_dept = 1;
                                break;
                        }
                        if(this.chooseDeptType==3){
                            form.is_sub_dept = 1;
                        }else{
                            form.is_sub_dept = 0;
                        }
                        params.dept_id=this.oCellDate.id;
                        params.deptdata = form;
                        console.log('params------',params);
                        this.$ajax.post('/department/dept_edit', params).then(res => {
                            console.log(res.data);
                            if (res.data.errno == 0) {
                                this.$message({message: '修改成功,2s后自动刷新', type: 'success'});
                                this.editDialogClose();
                                let arr = helper.createTableArr(deptment, form);
                                arr.forEach(value => {
                                    value.oType = value.type;
                                    value.type = value.type != 'file' ? 'text' : 'file';
                                    helper.selectDataShow(['dept_status', 'dept_type', 'prov_latn_id'], selectArr, value);
                                });
                                this.cellDate = arr;
                                setTimeout(_ => {
                                    this.$store.commit('ORGANIZED_CASCADER_DATA', []);
                                    window.location.reload();
                                }, 2500)

                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        this.$message({message: '请填写完整表单', type: 'warning'})
                    }
                })
            },
            itemClick(node) {
                this.getNodeData(node.id);
            },
            getNodeData(id) {
                this.selectValue = id;
                if (id == undefined) {
                    return;
                }
                this.$ajax.post('/department/dept_search_by_id', {dept_id: id}).then(res => {
                    console.log('res---7777---', res.data.data[0]);
                    if (res.data.errno == 0) {
                        this.oCellDate = res.data.data[0];
                        let arr = helper.createTableArr(deptment, res.data.data[0]);
                        arr.forEach(value => {
                            value.oType = value.type;
                            value.type = value.type != 'file' ? 'text' : 'file';
                            helper.selectDataShow(['dept_status', 'dept_type', 'prov_latn_id'], selectArr, value);
                        });
                        this.cellDate = arr;
                        this.editDisabled = false;
                    } else {
                        this.$message({messge: '获取数据失败', type: 'warning'});
                        this.editDisabled = true;
                    }

                }).catch(err => {
                    this.$message({messge: '获取数据失败', type: 'warning'});
                    this.editDisabled = true;
                    console.log('res------', err);
                })
            }
        },
        components: {
            cellArr, form1, organizedCascader, ZTree
        },
        computed: {
            groupArr() {
                return this.$store.state.organized.party;
            },
            groupArr2() {
                return this.$store.state.organized.party2;
            },
            treeData1() {
                let oArr = this.$store.state.organized.cascader_data;
                let arr = [];
                oArr.forEach(v => {
                    let parent = {
                        id: v.id,
                        name: v.dept_name
                    };

                    if (v.children != undefined && v.children.length > 0) {
                        let children = [];
                        v.children.forEach(value => {
                            let item = {
                                id: value.id,
                                name: value.dept_name
                            }
                            if (value.children != undefined && value.children.length > 0) {
                                let son = [];
                                value.children.forEach(s => {
                                    son.push({
                                        id: s.id,
                                        name: s.dept_name
                                    })
                                })
                                item.name = item.name + ' (' + value.children.length + ')'
                                item.children = son;
                            }
                            if(value.is_sub_dept==1 && value.children == undefined){
                                item.name = item.name + ' (' + 0 + ')'
                                item.children = [{

                                }];
                            }
                            children.push(item)

                        })
                        parent.name = parent.name + ' (' + v.children.length + ')';
                        parent.children = children;
                    }
                    arr.push(parent)
                })
                this.$nextTick(_ => {
                    this.$jquery('.root').text('区党委')
                })

                return arr
            }
        },
        mounted() {
            switch(this.account.role_id){
                case 1:
                    break;
                case 2:
                    this.selectArr.dept_type[1].disabled = true;
                    break;
                case 3:
                    this.selectArr.dept_type[1].disabled = true;
                    this.selectArr.dept_type[2].disabled = true;
                    break;
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


    function getForm() {
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
        });
        return arr;
    }
    function isHaveFormPid(arr) {
        let flag = false;
        arr.forEach(v=>{
            if( v.key == 'pid'){
                flag = true;
            }
        })
        return flag;
    }
    
    function delFormPid(vm) {
        if(isHaveFormPid(vm.formData) || isHaveFormPid(vm.editFormData)){
            vm.formData.forEach((value, index, self) => {
                if (value.key == 'pid') {
                    self.splice(index, 1)
                }
            });
            vm.editFormData.forEach((value, index, self) => {
                if (value.key == 'pid') {
                    self.splice(index, 1)
                }
            })
        }
    }
    function addFormPid(vm,pid) {
        if (vm.editDialog) {
            if(vm.account.role_id<3){
                vm.editFormData.push(pid);
            }
        } else {
            vm.formData.push(pid);
        }
    }
</script>

<style>

</style>