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
                    <el-col :span="8">
                        <!--<el-input-->
                                <!--placeholder="请选择日期"-->
                                <!--icon="search"-->
                                <!--v-model="input"-->
                                <!--:on-icon-click="handleIconClick">-->
                        <!--</el-input>-->
                    </el-col>
                    <el-col :span="16" :offset="1">
                        <el-button icon="edit" @click="editBtn" :disabled="editDisabled">修改</el-button>
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

                account: require('store').get('people_info')[0],
                editDialog: false,
                editFormData: [],
                oCellDate: [],
                editDisabled:true,

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
                this.getNodeData(call[1])

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
            deptmentTypeChange(call) {
                let pid = {
                    label: '隶属党群',
                    value: '',
                    rule: notEmpty,
                    key: 'pid',
                    type: 'select'
                }

                if (call.value == 1 && (this.editFormData.length < 5  && this.formData.length<5) ) {
                    this.selectArr.pid = this.groupArr;
                } else {
                    this.formData.forEach((value, index, self) => {
                        if (value.key == 'pid') {
                            self.splice(index, 1)
                        }
                    });
                    this.editFormData.forEach((value, index, self) => {
                        if (value.key == 'pid') {
                            self.splice(index, 1)
                        }
                    })
                    return;
                }
                //this.selectArr.dept_type[1].disabled = true;
                if (this.editDialog) {
                    this.editFormData.push(pid);
                } else {
                    this.formData.push(pid);
                }
                console.log('deptmentTypeChange-----', call)
            },
            cascaderChangeFrom(call) {
                this.formCascader = call[0] + '/' + call[1];
            },
            sureAdd() {
                let form = this.$refs.form1.form;
                this.$refs.form1.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = {};
                        if(form.pid==undefined){
                            form.pid = 1;
                        }
                        params.deptdata = form;
                        console.log('sureAdd----params-------',params)
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
            editBtn() {
                let noValueForm = getForm();
                noValueForm.forEach(v => {
                    v.value = this.oCellDate[v.key];
                });

                let pid = {
                    label: '隶属党群',
                    value: '',
                    rule: notEmpty,
                    key: 'pid',
                    type: 'select'
                }

                console.log('editBtn========', this.oCellDate, noValueForm);
                this.editFormData = noValueForm;
                if (this.oCellDate.dept_type == 1) {
                    this.selectArr.pid = this.groupArr;
                    pid.value = Number(this.oCellDate.pid);
                    this.editFormData.push(pid);

                }
                this.editDialog = true;

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
            },
            editDialogClose() {
                this.editDialog = false;
                this.editFormData = [];
            },
            sureEdit(){
                let form  = this.$refs.form2.form;;
                this.$refs.form2.$refs.form.validate(valid=>{
                    if(valid){
                        if(form.pid==undefined){
                            form.pid =1;
                        }
                        let params = {
                            dept_id : this.oCellDate.id,
                            deptdata:form,
                        }
                      this.$ajax.post('/department/dept_edit',params).then(res=>{
                          console.log(res.data);
                          if(res.data.errno==0){
                              this.$message({message:'修改成功',type:'success'});
                              this.editDialogClose();
                              let arr = helper.createTableArr(deptment, form);
                              arr.forEach(value => {
                                  value.oType = value.type;
                                  value.type = value.type != 'file' ? 'text' : 'file';
                                  helper.selectDataShow(['dept_status', 'dept_type','prov_latn_id'], selectArr, value);
                              });
                              this.cellDate = arr;
                          }
                      }).catch(err=>{
                          console.log(err)
                      })
                    }else{
                        this.$message({message: '请填写完整表单', type: 'warning'})
                    }
                })
            },
            itemClick (node) {
                console.log(node.id);
                this.getNodeData(node.id);
            },
            getNodeData(id){
                this.$ajax.post('/department/dept_search_by_id', {dept_id: id}).then(res => {
                    console.log('res------', res.data.data[0]);
                    if(res.data.errno==0){
                        this.oCellDate = res.data.data[0];
                        let arr = helper.createTableArr(deptment, res.data.data[0]);
                        arr.forEach(value => {
                            value.oType = value.type;
                            value.type = value.type != 'file' ? 'text' : 'file';
                            helper.selectDataShow(['dept_status', 'dept_type','prov_latn_id'], selectArr, value);
                        });
                        this.cellDate = arr;
                        this.editDisabled = false;
                    }else {
                        this.$message({messge:'获取数据失败',type:'warning'});
                        this.editDisabled = true;
                    }

                }).catch(err => {
                    this.$message({messge:'获取数据失败',type:'warning'});
                    this.editDisabled = true;
                    console.log('res------', err);
                })
            }
        },
        components: {
            cellArr, form1, organizedCascader,ZTree
        },
        computed: {
            groupArr() {
                return this.$store.state.organized.party;
            },
            treeData1(){
                let oArr = this.$store.state.organized.cascader_data;
                let arr = [];
                oArr.forEach(v=>{
                    let parent  = {
                        id:v.id,
                        name:v.dept_name
                    };

                    if(v.children.length>0){
                        let children = [];
                        v.children.forEach(value=>{
                            let item = {
                                id:value.id,
                                name:value.dept_name
                            }
                            if(value.children!=undefined && value.children.length>0){
                                let son = [];
                                value.children.forEach(s=>{
                                    son.push({
                                        id:s.id,
                                        name:s.dept_name
                                    })
                                })
                                item.name = item.name + ' ('+value.children.length+')'
                                item.children = son;
                            }
                            children.push(item)

                        })
                        parent.name = parent.name + ' ('+v.children.length+')';
                        parent.children = children;
                    }
                    arr.push(parent)
                })
                this.$jquery('.root').text('区党委')
                return arr
            }
        },
        mounted() {
            if (this.account.role_id == 2) {
                this.selectArr.dept_type[1].disabled = true;
            } else {
                this.selectArr.dept_type[1].disabled = false;
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
</script>

<style>

</style>