<template>
    <div>
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
                    <el-input v-model="item.text" class="pic_txt"></el-input>
                    <div v-if="(pic_txt_arr.length%5) == 0 ">
                        444
                    </div>
                </span>
                <el-dialog v-model="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>


        </el-form>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'

    export default {
        data() {
            return {
                form: {
                    dept_id: '',
                    title:''
                },
                uploadUri: require('../../value/string').uploadUrl,
                fileList:[],
                notEmpty: [{required: true, message: '不许为空'}],
                dialogImageUrl:'',
                file_id_arr:[],
                cascderValue:0,
                pic_txt_arr:[{text:''}],
                dialogVisible:false
            }
        },
        components: {
            organizedCascader
        },
        methods:{
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
                    this.pic_txt_arr.push({text:''});
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
            cascaderChange(call){
                let depart_id = call[call.length - 1];
                this.form.dept_id = depart_id;
            }
        }
    }
</script>

<style>
    .pic_txt{
        max-width: 148px;
        margin: 0px 8px 0px 0;
        position:relative;
    }
    .el-upload-list--picture-card .el-upload-list__item{
        margin: 0px 8px 2px 0;
    }
</style>