<template>
    <div id="fengcaiAdd">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="选择党支部"
                          label-width="100px"
                          :rules="notEmpty"
                          prop="dept_id">
                <organized-cascader
                        :cascderValue="cascderValue"
                        @cascaderChange="cascaderChange">
                </organized-cascader>
            </el-form-item>

            <el-form-item label="标题"
                          label-width="100px"
                          :rules="notEmpty"
                          prop="dept_id">
                <el-input v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item label="图片"
                          label-width="100px">
                <el-upload
                        :action="uploadUri"
                        list-type="picture-card"
                        :file-list="fileList"
                        :on-preview="uploadPreview"
                        :on-success="uploadSuccess"
                        :before-upload="beforeUpload"
                        multiple
                        :on-remove="uploadRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <span v-for="(item,index) in pic_txt_arr" :key="item.text">
                    <el-input v-model="item.text" :placeholder="'图片'+(index+1)+'说明'" class="pic_txt"></el-input>
                </span>
                <el-dialog v-model="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-form>

        <el-row type="flex" justify="center">
            <el-col :span="6" style="text-align: center">
                <el-button @click="$router.go(-1)">返回</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'

    export default {
        data() {
            return {
                form: {
                    dept_id: '',
                    title: ''
                },
                uploadUri: require('../../value/string').uploadUrl,
                fileList: [],
                notEmpty: [{required: true, message: '不许为空'}],
                dialogImageUrl: '',
                file_id_arr: [],
                cascderValue: 0,
                pic_txt_arr: [{text: ''}],
                dialogVisible: false,
                wh: window.innerWidth,
                upload_box_num:0,
            }
        },
        mounted() {
            let $ = this.$jquery;
            this.wh = window.innerWidth;
            let upload_box_num = Math.ceil((this.wh - 100) / 158) - 1;
            this.upload_box_num = upload_box_num;
        },
        computed: {

        },
        components: {
            organizedCascader
        },
        methods: {
            uploadRemove(file, fileList) {
                this.file_id_arr.forEach((v, i, s) => {
                    if (file.response != undefined && v == file.response.data) {
                        this.pic_txt_arr.splice(i, 1);
                        s.splice(i, 1);
                    }
                    if (file.response == undefined && v == file.url.replace(require('../../value/string').fileread, '')) {
                        s.splice(i, 1);
                    }
                })
            },
            uploadPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            uploadSuccess(res) {
                if (res.errno == 0) {
                    this.file_id_arr.push(res.data);
                    this.pic_txt_arr.push({text: ''});
                    //ajust(this);
                }
                console.log('res-----', res)
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            cascaderChange(call) {
                let depart_id = call[call.length - 1];
                this.form.dept_id = depart_id;
            },
            submit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.file_id_arr.length == 0) {
                            this.$message({message: '至少有一个图片', type: 'warning'});
                            return;
                        }
                        let fengcai_pic_json_array = [];
                        this.file_id_arr.forEach((v, i) => {
                            let pic = {pic_url: v, pic_content: this.pic_txt_arr[i].text};
                            fengcai_pic_json_array.push(pic);
                        })
                        let params = {
                            title: this.form.title,
                            dept_id: this.form.dept_id,
                            fengcai_pic_json_array: fengcai_pic_json_array
                        }

                        this.$ajax.post('/fengcai/fengcai_add', params).then(res => {
                            console.log('fengcai_pic_json_array----', res.data)
                            if (res.data.errno == 0) {
                                this.$message({message: '上传成功', type: 'success'});
                                this.$router.replace('/home/fengcaiManage');
                            } else {
                                this.$message({message: '上传失败，请重试', type: 'error'});
                            }
                        }).catch(err => {
                            this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                            console.log('----', err)
                        });
                    } else {
                        this.$message({message: '抱歉，请填写完表格', type: 'warning'})
                    }
                })

            }
        }
    }
    function ajust(vm) {
        let $ = vm.$jquery;
//        vm.$nextTick(_=>{
//            let count =  $('div.pic_txt').length;
//            let shang = Number(count/vm.upload_box_num);
//            console.log(shang)
//            $('div.pic_txt').each((i,v)=>{
//                if(i<vm.upload_box_num){
//                  $(v).css({top:'-180px'})
//                }
//            })
//        })
    }
</script>

<style lang="less">
    #fengcaiAdd{
        .pic_txt {
            max-width: 148px;
            margin: 0px 8px 0px 0;
        }

        .el-upload-list--picture-card .el-upload-list__item {
            margin: 0px 8px 2px 0;
        }
        .el-upload--picture-card{
            margin-top: 0px;
        }
    }

</style>