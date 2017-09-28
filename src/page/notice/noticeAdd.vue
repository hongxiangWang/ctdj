<template>
    <div style="padding-right: 2rem">
        <el-form ref="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="类型"
                                  :rules="notEmpty"
                                  prop="notice_type">
                        <el-select v-model="form.notice_type" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" :push="12">
                <el-button @click="listBtn" v-if="false">列表</el-button>
                </el-col>
            </el-row>


            <el-form-item label="活动名称"
                          :rules="notEmpty"
                          prop="title">
                <el-input
                        v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="活动名称"
                          :rules="notEmpty"
                          prop="title">
                <!--<quill-editor v-model="form.content"-->
                              <!--ref="quillEditor"-->
                              <!--:options="editorOption">-->
                <!--</quill-editor>-->
                <quill-editer
                        :fileName="'file'"
                        :uploadUrl="uploadUri"
                        v-model="form.content">
                </quill-editer>
            </el-form-item>
            <el-form-item label="附件">
                <el-upload
                        :action="uploadUri"
                        list-type="picture-card"
                        :file-list="fileList"
                        :on-preview="uploadPreview"
                        :on-success="uploadSuccess"
                        :on-remove="uploadRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>

                <el-dialog v-model="uploadDialog" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

        </el-form>
        <div style="text-align: center">
            <el-button @click="preview">预览</el-button>
            <el-button @click="submit">提交</el-button>
        </div>


        <el-dialog
                title="预览"
                :visible.sync="previewDialog"
                size="large"
                :before-close="handleClose">
            <div style="border:1px solid #DDD;padding: 20px" class="ql-editor" v-html="form.content"></div>
        </el-dialog>


    </div>
</template>
<script>
    import {selectArr} from '../../assets/kvword'
    import quillEditer from '../../components/quillEditer.vue'

    export default {
        components: {quillEditer},
        data() {
            return {
                form: {
                    title: '',
                    content: '',
                    notice_type: 1,
                    file_lsit: []
                },

                options: selectArr.notice_type,
                editorOption: {
                    placeholder: '请输入内容',
                },
                previewDialog: false,
                notEmpty: [{required: true, message: '不许为空'}],
                uploadUri: require('../../value/string').uploadUrl,
                fileList: [],
                uploadDialog: false,
                dialogImageUrl: ''
            }
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        methods: {
            listBtn(){
                this.$router.push('/home/noticeList')
            },
            submit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.form.file_id_str = dealFormArrayData(this.form.file_lsit);
                        let params = {
                            notice_data:this.form,
                            admin_id:require('store').get('people_info')[0].admin_id
                        }
                        this.$ajax.post('/notice/notice_add',params).then(res=>{
                            if(res.data.errno == 0){
                                this.$message({message: '添加成功,2s后跳转', type: 'success'});
                                setTimeout(_=>{
                                    this.$router.push('/home/main')
                                },2000)
                            }else{
                                this.$message({message: '操作失败,请重试', type: 'error'});
                            }
                        }).catch(err=>{
                            this.$message({message: '操作失败,请重试', type: 'error'});
                            console.log('------',err)
                        })
                    } else {
                        this.$message({message: '请填写完整', type: 'warning'})
                    }
                })
            },
            handleClose() {
                this.previewDialog = false;
            },
            preview() {
                this.previewDialog = true;
            },
            uploadPreview(file) {
                this.dialogImageUrl = file.url;
                this.uploadDialog = true;
            },
            uploadSuccess(res) {
                console.log('res-----', res)
                if (res.errno == 0) {
                    this.form.file_lsit.push(res.data)
                }
            },
            uploadRemove(file) {
                this.form.file_lsit.forEach((v, i, s) => {
                    if (file.response != undefined && v == file.response.data) {
                        s.splice(i, 1);
                    }
                    if (file.response == undefined && v == file.url.replace(require('../../value/string').fileread, '').replace(`ctdj/www/static`, `file`)) {
                        s.splice(i, 1);
                    }
                })
            }
        },
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

    .ql-editor{

    }
    .ql-editor p{
        line-height:200%;
    }
    .notice_title{
        text-align:center;
        font-size:24px;
        font-weight:bold;
        min-height:60px;
        line-height:60px;
        border-bottom:1px solid red;
        margin:0px 10px;
    }
    .notice_action{
        text-align: center;
        height:30px;
        margin:10px 0px;
    }
</style>