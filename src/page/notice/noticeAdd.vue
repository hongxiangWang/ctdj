<template>
    <div style="padding-right: 2rem">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="活动名称"
                          :rules="notEmpty"
                          prop="title">
                <el-input
                        v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="活动名称"
                          :rules="notEmpty"
                          prop="title">
                <quill-editor v-model="form.content"
                              ref="quillEditor"
                              :options="editorOption">
                </quill-editor>
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

                <el-dialog v-model="uploadDialog" size="tiny" >
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
    export default {
        data() {
            return {
                form: {
                    title: '',
                    content: ''
                },
                editorOption: {},
                previewDialog: false,
                notEmpty: [{required: true, message: '不许为空'}],
                uploadUri:require('../../value/string').uploadUrl,
                fileList:[],
                uploadDialog:false,
                dialogImageUrl:''
            }
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(valid => {
                    if (valid) {

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
            uploadPreview(){

            },
            uploadSuccess(){

            },
            uploadRemove(){

            }
        },
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