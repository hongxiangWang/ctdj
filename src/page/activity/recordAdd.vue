<template>
    <div style="padding: 0 60px">
        <el-form ref="form" :model="form" label-width="100px">
            <el-row justify="center" type="flex">
                <el-col :span="8">
                    <el-form-item label="选择党支部"
                                  label-width="100px"
                                  :rules="notEmpty"
                                  prop="dept_id">
                        <organized-cascader
                                :cascderValue="cascderValue"
                                @cascaderChange="cascaderChange">
                        </organized-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                            label="党建类型"
                            :rules="notEmpty"
                            prop="record_type">
                        <el-select
                                v-model="form.record_type"
                                placeholder="请选择活动区域">
                            <el-option
                                    v-for="item in typeArray"
                                    :label="item.label"
                                    :key="item.value"
                                    :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-col :span="13">
                        <el-form-item label="活动时间"
                                      :rules="notEmpty"
                                      prop="activity_start_time">

                            <el-date-picker type="date" format="yyyy-MM-dd" placeholder="开始日期"
                                            v-model="form.activity_start_time"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center; height: 36px; line-height: 36px">
                        -
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                                label-width="0px"

                                :rules="activity_end_time"
                                prop="activity_end_time">
                            <el-date-picker type="date"
                                            style="width: 230%"
                                            placeholder="结束时间"
                                            format="yyyy-MM-dd"
                                            v-model="form.activity_end_time"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>

                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="活动名称"
                                  :rules="notEmpty"
                                  prop="record_title">
                        <el-input
                                v-model="form.record_title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="与会人员"
                              :rules="notEmpty"
                              prop="attend_user_arr">
                    <el-select v-model="form.attend_user_arr"
                               ref="peopleArray"
                               multiple placeholder="请选择与会人员"
                               @change="peopleArrayChange"
                               @visible-change="peopleArrayClick"
                               style="width: 100%">
                        <el-option
                                v-for="item in peopleList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主持人"
                                  :rules="notEmpty"
                                  prop="record_host_people">
                        <el-input v-model="form.record_host_people"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="记录人"
                                  :rules="notEmpty"
                                  prop="record_write_people">
                        <el-input v-model="form.record_write_people"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动地点">
                        <el-input v-model="form.activity_place"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="议会主题"
                                  :rules="notEmpty"
                                  prop="record_subtitle">
                        <el-input v-model="form.record_subtitle"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <!--<el-form-item label="会议内容"-->
                    <!--:rules="notEmpty"-->
                    <!--prop="record_content">-->
                    <!--<el-input v-model="form.record_content" type="textarea"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="会议内容" :rules="notEmpty">
                        <!--<quill-editor v-model="form.record_content"-->
                                      <!--ref="quillEditor"-->
                                      <!--:options="editorOption">-->
                        <!--</quill-editor>-->
                        <quill-editer
                                :canCrop="canCrop"
                                :fileName="'file'"
                                :uploadUrl="uploadUri"
                                v-model="form.record_content">
                        </quill-editer>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="2" style="text-align: right">
                    <label>附件：</label>
                </el-col>
                <el-col :span="22">
                    <el-upload
                            :action="uploadUri"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-preview="uploadPreview"
                            :on-success="uploadSuccess"
                            :on-remove="uploadRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny" v-if="parentForm == undefined">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-col>

            </el-row>

            <el-row type="flex" justify="center">
                <el-col :span="6" style=" text-align: center">
                    <el-button @click="$emit('closeEditDialid')" v-if="parentForm != undefined">取消</el-button>
                    <el-button @click="submitForm" :disabled="submitBtn">提交</el-button>
                </el-col>
            </el-row>
        </el-form>
        <br>
        <br>
        <span v-show="false">{{parentFormCom}}</span>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'
    import {selectArr} from '../../assets/kvword.js'
    import ElRow from "element-ui/packages/row/src/row";
    import quillEditer from '../../components/quillEditer.vue'
    let messge = null;
    const helper = require('../../tools/helper')
    export default {
        data() {
            return {
                form: {
                    dept_id: '',
                    record_title: '',
                    record_type: '',
                    activity_start_time: '',
                    activity_end_time: '',
                    attend_user_arr: [],
                    record_host_people: '',
                    record_write_people: '',
                    activity_place: '',
                    record_subtitle: '',
                    record_content: '',
                    file_id_arr: []
                },
                typeArray: selectArr.record_type,
                dialogImageUrl: '',
                dialogVisible: false,
                peopleList: [],
                editorOption: {
                    placeholder: '请输入内容',
                },
                uploadUri: require('../../value/string').uploadUrl,
                notEmpty: [{required: true, message: '不许为空'}],
                canCrop:false,
                cascderValue: 0,
                message: {},
                fileList: [],
                submitBtn: false,
                allPeople:[]



            }
        },
        components: {
            ElRow,
            organizedCascader,
            quillEditer
        },
        methods: {
            cascaderChange(call) {
                let depart_id = call[call.length - 1];
                this.form.dept_id = depart_id;
                getQueryResult(this, depart_id);
            },
            peopleArrayChange(call) {
                console.log(call)
                let isAll = false;
                let re = /^[0-9]+.?[0-9]*$/;
                call.forEach(value => {
                    if (!re.test(value) && helper.stringToArray(value).length > 0) {
                        let arrs = helper.stringToArray(value);
                        let isText = false;
                        arrs.forEach(v => {
                            isText = re.test(v) && isText;
                        })
                        if (isText) {
                            isAll = false;
                        } else {
                            isAll = true;
                        }

                    }
                })
                if (isAll) {
                    let s = this.$notify({
                        message: `你已经选择全部，不可选择其他人，否则请移除"全部"选项`,
                        type: 'warning',
                        offset: '0'
                    })
                    this.form.attend_user_arr.forEach((value, index, self) => {
                        if (re.test(value)) {
                            self.splice(index, 1);
                        }
                    });
//                    this.allPeople.forEach(v=>{
//                        this.form.attend_user_arr.push(v)
//                    })
                    //console.log(this.peopleList)
                    this.$refs.peopleArray.visible = false
                }
            },
            peopleArrayClick() {
                if (this.peopleList.length == 0) {
                    this.$notify({
                        message: `您还未选择党支部,或数据正在获取中`,
                        type: 'warning',
                        offset: '0'
                    })
                    this.$refs.peopleArray.visible = false
                }
            },
            uploadRemove(file, fileList) {
                this.form.file_id_arr.forEach((v, i, s) => {
                    if (file.response != undefined && v == file.response.data) {
                        s.splice(i, 1);
                    }
                    if (file.response == undefined && v == file.url.replace(require('../../value/string').fileread, '')) {
                        s.splice(i, 1);
                    }
                })
            },
            uploadPreview(file) {
                if (this.parentForm == undefined) {
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                } else {
                    this.$emit('openImageFile', file)
                }

            },
            uploadSuccess(res) {
                if (res.errno == 0) {
                    this.form.file_id_arr.push(res.data)
                }
                console.log('res-----', res)
            },
            submitForm() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.submitBtn = true;
                        let params = {};
                        params = this.form;
                        params.attend_user_id = dealFormArrayData(this.form.attend_user_arr);
                        params.file_id_list = dealFormArrayData(this.form.file_id_arr);
                        params.admin_id = require('store').get('people_info')[0].admin_id;
                        params.activity_start_time = dealDateFormt(new Date(params.activity_start_time));
                        params.activity_end_time = dealDateFormt(new Date(params.activity_end_time));

                        console.log('submit--params--', params, JSON.stringify(params.record_content))
                        submitData(this, params)


                    } else {
                        // this.form.activity_start_time = dealDateFormt(this.form.activity_start_time);
                        console.log(this.form)
                        this.$message({message: '请填写表格完整', type: 'warning'});
                    }
                })
            },
            imgClick(){

            }
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            },
            activity_end_time() {
                let vm = this;
                if (this.parentForm != undefined) {
                    return [];
                }
                return [
                    {type: 'date', required: true, message: '结束日期不能为空'},
                    {
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            if (vm.form.activity_start_time != '' && value.getTime() < vm.form.activity_start_time.getTime()) {
                                errors.push(new Error('结束日期不能提前于开始日期'));
                            }
                            callback(errors);
                        }
                    }]
            },
            parentFormCom() {
                if (this.parentForm != undefined) {
                    this.cascderValue = this.parentForm.cascderValue;
                    this.form = this.parentForm.form;
                    this.fileList = this.parentForm.file_list;
                    getQueryResult(this, this.parentForm.form.dept_id);

//                    setTimeout(_=>{
//                        this.form.attend_user_arr = [1,3]
//                    },2000)
                    return this.parentForm
                } else {
                    return 0;
                }

            }
        },
        props: {
            parentForm: {}
        },
        mounted() {

        }
    }

    function getQueryResult(vm, depart_id) {
        let params = {
            depart_id: depart_id
        }
        console.log('user_query-----', params)
        vm.$ajax.post('/people/user_query', params).then(res => {
            console.log('user_query-----', res.data)
            if (res.data.errno == 0) {
                let arr = [];
                let valueArr = '';
                vm.allPeople = [];
                res.data.data.forEach(value => {
                    let json = {};
                    json.label = value.people_name;
                    json.value = value.id;
                    arr.push(json);
                    valueArr += value.id + '|';
                    vm.allPeople.push(value.id)
                })
                arr.unshift({label: '全部', value: valueArr})
                vm.peopleList = arr;
                if (vm.parentForm != undefined) {
                    vm.form.attend_user_arr = vm.parentForm.real_attend_users;
                }

            } else {

            }
        }).catch(err => {
            console.log('----', err)
        })
    }

    function dealFormArrayData(arr) {
        let temp = '';
        if (arr instanceof Array) {
            arr.forEach(v => {
                temp += v + '|';
            });
        }
        return temp;
    }

    function dealDateFormt(d) {
        return d.Format('yyyy-MM-dd');
    }

    function submitData(vm, data) {
        let params = {};
        if (vm.parentForm == undefined) {
            params.url = `/activity_record/activity_record_add`;
            params.tips = '添加成功,2秒后跳转'
        } else {
            params.url = `/activity_record/activity_record_edit`;
            params.tips = '修改成功,2秒后关闭';
            params.activity_record_id = vm.parentForm.id;
        }
        params.activity_record_data = data;
        vm.$ajax.post(params.url, params).then(res => {
            if (res.data.errno == 0) {
                vm.$message({message: params.tips, type: 'success'});
                setTimeout(_ => {
                    if(vm.parentForm == undefined){
                        vm.$router.replace('/home/recordList');
                    }else{
                        vm.$emit('closeEditDialid');
                        window.location.reload();
                    }
                    vm.submitBtn = false;
                }, 2000);

            } else {
                vm.submitBtn = false;
                vm.$message({message: '操作失败,请重试', type: 'error'});
            }
        }).catch(err => {
            console.log('err------')
            vm.submitBtn = false;
            vm.$message({message: '操作失败,请重试' + err.message, type: 'error'});
        })
    }
</script>
<style>
    .ql-editor {
        min-height: 200px;
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before, .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        top: -5px;
        text-align: right;
        position: relative;
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before, .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        top: -5px;
        position: relative;
    }

    .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
        position: absolute;
        margin-top: -7px;
        top: 50%;
        width: 18px;
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before, .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        top: -5px;
        text-align: right;
        position: relative;
    }
</style>