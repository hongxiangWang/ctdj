<template>
    <div>
        <el-row>
            <el-col style="margin-left: 1rem;height:30px;line-height: 30px;">
                <el-row>
                    <el-col :span="16">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/home/main' }"><i class="fa fa-home"></i>首页</el-breadcrumb-item>
                            <el-breadcrumb-item>详情内容</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span=2>
                        <el-button style="float: right;top:-5px;position: relative" size="small" @click="deleteBt">删除</el-button>
                    </el-col>
                </el-row>


            </el-col>
            <el-col :span="18" style="border:1px #ccc solid;padding: 1rem 2rem; margin-left: 1rem">
                <div class="notice_title">{{oData.title}}</div>
                <div class="notice_action">
                    <span>发布时间：{{oData.create_time}}</span>
                </div>
                <div v-html="oData.content" class="ql-editor"></div>
                <br>
                <label v-if="file_list.length>0">附件：</label>
                <div>
                    <el-button
                            v-for="item in file_list"
                            :key="item.name"
                            type="text"
                            @click="downLoadFile(item)">
                        {{item.name}}
                    </el-button>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    const helper  = require('../../tools/helper')
    export default {
        data() {
            return {
                msg: 'Hello world!',
                oData: {}
            }
        },
        methods:{
            downLoadFile(file){
                let httpUri = require('../../value/string.js').fileread+file.uri;
                console.log(httpUri,'frssss---')
                helper.downloadFile(httpUri);
            },
            deleteBt(){
                this.$confirm('删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post('/notice/notice_delete',{notice_id:this.$route.params.id}).then(res=>{
                        console.log('res-----',res.data);
                        if(res.data.errno==0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!,2s后跳转'
                            });
                            setTimeout(_=>{
                                this.$router.replace('/home/main');
                            },2000)
                        }else{
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    }).catch(err=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                        console.log('err-----',err);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {
            console.log('=======>>=====', this.$route.params.id);
            require('store').get('notice_list').forEach(v => {
                if (v.id == this.$route.params.id) {
                    this.oData = v;
                }
            })
        },
        computed: {
            file_list() {
                let arr = [];
                this.oData.file_id_str.split('|').forEach(value => {
                    if (value != null && value.length > 3) {
                        let json = {
                            name: value.substr(value.indexOf('_') + 1),
                            uri: value
                        }
                        // json.isImg = isImage(json.name);
                        arr.push(json);
                    }
                });
                return arr;
            }
        }
    }
</script>

<style>
    .ql-editor{

    }
    .ql-editor p{
        line-height:200%;
    }
    .notice_title{
        text-align:center;
        font-size:24px;
        font-weight:bold;
        height:60px;
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

