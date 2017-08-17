<template>
    <div style="padding: 0 60px">
        <el-form ref="form" :model="form" label-width="80px">
            <el-row justify="center" type="flex">
                <el-col :span="8">
                    <el-form-item label="选择党支部"
                                  label-width="100px"
                                  :rules="notEmpty"
                                  prop="dept_id" >
                        <organized-cascader
                                @cascaderChange="cascaderChange">
                        </organized-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                            label="党建类型"
                            :rules="notEmpty"
                            prop="record_type">
                        <el-select v-model="form.record_type" placeholder="请选择活动区域">
                            <el-option v-for="item in typeArray"
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

                            <el-date-picker type="date" placeholder="开始日期" v-model="form.activity_start_time"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center; height: 36px; line-height: 36px">
                        -
                    </el-col>
                    <el-col :span="9">
                        <el-form-item
                                :rules="activity_end_time"
                                prop="activity_end_time">
                            <el-date-picker type="date"
                                            placeholder="结束时间"
                                            v-model="form.activity_end_time"
                                            style="width: 100%;"></el-date-picker>
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
                    <el-form-item label="议会/主题"
                                  :rules="notEmpty"
                                  prop="record_subtitle">
                        <el-input v-model="form.record_subtitle"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="会议内容"
                                  :rules="notEmpty"
                                  prop="record_content">
                        <el-input v-model="form.record_content" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="1">
                    <label>附件：</label>
                </el-col>
                <el-col :span="22">
                    <el-upload
                            :action="uploadUri"
                            list-type="picture-card"
                            :on-preview="uploadPreview"
                            :on-success="uploadSuccess"
                            :on-remove="uploadRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-col>

            </el-row>

            <el-row type="flex" justify="center">
                <el-col :span="6" style=" text-align: center">
                    <el-button>撤销</el-button>
                    <el-button @click="submitForm">提交</el-button>
                </el-col>
            </el-row>
        </el-form>
        <br>
        <br>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'
    import {selectArr} from '../../assets/kvword.js'
    import ElRow from "element-ui/packages/row/src/row";

    export default {
        data() {
            return {
                form: {
                    dept_id: '',
                    record_type: '',
                    activity_start_time: '',
                    activity_end_time: '',
                    title: '',
                    attend_user_arr: [],
                    record_host_people: '',
                    record_write_people: '',
                    activity_place: '',
                    record_subtitle: '',
                    record_content: '',
                    file_id_list: []
                },
                typeArray: selectArr.record_type,
                dialogImageUrl: '',
                dialogVisible: false,
                peopleList: [],

                uploadUri: require('../../value/string').uploadUrl,
                notEmpty: [{required: true, message: '不许为空'}]
            }
        },
        components: {
            ElRow,
            organizedCascader
        },
        methods: {
            cascaderChange(call) {
                let depart_id = call[call.length - 1];
                this.form.dept_id = depart_id;
                getQueryResult(this, depart_id);
            },
            peopleArrayChange(call) {
                let isAll = false;
                let re = /^[0-9]+.?[0-9]*$/;
                let all = ''
                call.forEach(value => {
                    if (!re.test(value)) {
                        isAll = true;
                        all = value;
                    }
                })
                if (isAll) {
                    this.$notify({
                        message: `你已经选择全部，不可选择其他人，否则请移除"全部"选项`,
                        type: 'warning'
                    })
                    this.form.attend_user_arr.forEach((value, index, self) => {
                        if (re.test(value)) {
                            self.splice(index, 1);
                        }
                    });
                    this.$refs.peopleArray.visible = false
                }
            },
            peopleArrayClick() {
                if (this.peopleList.length == 0) {
                    this.$notify({
                        message: `您还未选择党支部`,
                        type: 'warning'
                    })
                    this.$refs.peopleArray.visible = false
                }
            },
            uploadRemove(file, fileList) {
                console.log(file, fileList);
                this.form.file_id_list.forEach((v,i,s)=>{
                    if(v == file.response.data){
                        s.splice(i,1);
                    }
                })
            },
            uploadPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            uploadSuccess(res) {
                if(res.errno==0){
                    this.form.file_id_list.push(res.data)
                }
                console.log('res-----',res)
            },
            submitForm(){
                this.$refs.form.validate(valid=>{
                    if(valid){
                        let params = {};
                        params = this.form;
                        params.attend_user_id=dealFormArrayData(this.form.attend_user_arr);
                        this.form.file_id_list=dealFormArrayData(this.form.file_id_list);
                        params.admin_id = require('store').get('people_info')[0].admin_id;
                        console.log(params);
                    }else {
                        console.log()
                    }
                })
            }
        },
        computed: {
            activity_end_time() {
                let vm = this;
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
            }
        }
    }

    function getQueryResult(vm, depart_id) {
        let params = {
            people_type: '',
            people_name: '',
            depart_id: depart_id
        }

        vm.$ajax.post('/people/user_query', params).then(res => {
            console.log('user_query-----', res.data)
            if (res.data.errno == 0) {
                let arr = [];
                let valueArr = '';

                res.data.data.forEach(value => {
                    let json = {};
                    json.label = value.people_name;
                    json.value = value.id;
                    arr.push(json);
                    valueArr += value.id + '|';
                })
                arr.unshift({label: '全部', value: valueArr})
                vm.peopleList = arr;

            } else {

            }
        }).catch(err => {

            console.log('----', err)
        })
    }

    function dealFormArrayData(arr) {
        let temp ='';
        arr.forEach(v=>{
            temp+=v+'|';
        });
        return temp;
    }
</script>