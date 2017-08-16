<template>
    <div style="padding: 0 60px">
        <el-form ref="form" :model="form" label-width="80px">
            <el-row justify="center" type="flex">
                <el-col :span="8">
                    <el-form-item label="选择党支部" label-width="90px">
                        <organized-cascader
                                @cascaderChange="cascaderChange">
                        </organized-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="党建类型">
                        <el-select v-model="form.type" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                                            style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col :span="2">
                            <p style="margin: 0 auto;text-align: center">-</p>
                        </el-col>
                        <el-col :span="11">
                            <el-time-picker type="date" placeholder="选择时间" v-model="form.date2"
                                            style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="与会人员">
                    <el-select v-model="form.peopleArray"
                               ref="peopleArray"
                               multiple placeholder="请选择与会人员"
                               @change="peopleArrayChange"
                               @visible-change="peopleArrayClick"
                               style="width: 100%">
                        <el-option
                                v-for="item in form.peopleList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主持人">
                        <el-input v-model="form.host_people"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="记录人">
                        <el-input v-model="form.write_people"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动地点">
                        <el-input v-model="form.location"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="议会/主题">
                        <el-input v-model="form.subtitle"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="会议内容">
                        <el-input v-model="form.content" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="1">
                    <label>附件：</label>
                </el-col>
                <el-col :span="22">
                    <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-col>

            </el-row>

        </el-form>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'

    export default {
        data() {
            return {
                form: {
                    type: '',
                    date1: '',
                    date2: '',
                    title: '',
                    peopleArray: [],
                    peopleList: [],
                    host_people: '',
                    write_people: '',
                    location: '',
                    subtitle: '',
                    content: '',
                    dialogImageUrl: '',
                    dialogVisible: false
                }
            }
        },
        components: {
            organizedCascader
        },
        methods: {
            cascaderChange(call) {
                let depart_id = call[call.length - 1];
                getQueryResult(this, depart_id)
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
                    this.form.peopleArray.forEach((value, index, self) => {
                        if (re.test(value)) {
                            self.splice(index, 1);
                        }
                    });
                    this.$refs.peopleArray.visible = false
                }
            },
            peopleArrayClick() {
                if (this.form.peopleList.length == 0) {
                    this.$notify({
                        message: `您还未选择党支部`,
                        type: 'warning'
                    })
                    this.$refs.peopleArray.visible = false
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
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
                vm.form.peopleList = arr;

            } else {

            }
        }).catch(err => {

            console.log('----', err)
        })
    }
</script>