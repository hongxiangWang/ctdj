<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="margin:10px 0px;text-align:center;">
                <el-button type="primary" @click="addFlashpic">新增轮播图片</el-button>
            </el-col>
        </el-row>

        <el-table :data="tableData" highlight-current-row
                  v-loading="tableLoading"
                  element-loading-text="拼命加载中"
                  max-height="500"
                  border
                  style="width: 100%">
            <el-table-column
                    type="index"
                    width="80">
            </el-table-column>
            <el-table-column label="轮播图地址" width="250" align="center">
                <template scope="scope">
                    <img :src="scope.row.url" height="120px" @click="imgClick(scope.row.url)"/>
                </template>
            </el-table-column>
            <el-table-column prop="pic_title" label="轮播图标题" width="250" align="center">
            </el-table-column>
            <el-table-column prop="expire_time" label="失效时间" width="150" align="center">
            </el-table-column>
            <el-table-column prop="pic_title" label="状态" width="100" align="center">
                <template scope="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '有效' : '禁用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="order_num" label="排序" width="100" align="center">

            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size="small" @click="editFlashpic(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteFlashpic(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增界面-->
        <el-dialog :title="addDialogTitle" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="图片标题" prop="pic_title">
                    <el-input type="text" placeholder="请输入轮播图片标题" v-model="addForm.pic_title"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="失效时间" prop="expire_time">
                    <el-date-picker
                            v-model="addForm.expire_time"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序" prop="order_num">
                    <el-input type="text" placeholder="" v-model="addForm.order_num"
                              size="small"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片地址" prop="pic_url">
                    <el-upload
                            :disabled="disabled"
                            :action="uploadUri"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-preview="uploadPreview"
                            :on-success="uploadSuccess"
                            :on-remove="uploadRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="状态" prop="add_status">
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">有效</el-radio>
                        <el-radio :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-dialog
                title="查看"
                :visible.sync="imgDialog"
                size="small"
                :before-close="imgClose">
            <img :src="imgSrc" width="590"/>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                disabled: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                //需要向table填写的数据
                tableData: [{
                    pic_url: '',
                    pic_title: '',
                    order_num: 999,
                    jump_url: '',
                    expire_time: '',
                    status: -1,
                }],
                //操作的方法
                tableLoading: true,
                //新增界面是否显示
                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    pic_title: [
                        {required: true, message: '请输入轮播图标题', trigger: 'blur'},
                    ],
//                    pic_url:[
//                        {required: true, message: '请上传轮播图片', trigger: 'blur'},
//                    ]
                },
                //新增界面数据
                addForm: {
                    pic_title: '',
                    pic_url: [],
                    expire_time: '2099-12-31',
                    order_num: 999,
                    status: 1,
                },
                //编辑界面是否显示
                editFormVisible: false,
                editLoading: false,
                editFormRules: {
                    pic_title: [
                        {required: true, message: '请输入轮播图标题', trigger: 'blur'},
                    ],
//                    pic_url:[
//                        {required: true, message: '请上传轮播图片', trigger: 'blur'},
//                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    pic_title: '',
                    pic_url: [],
                    order_num: 999,
                    expire_time: '',
                    status: 1
                },
                uploadUri: require('../../value/string').uploadUrl,
                notEmpty: [{required: true, message: '不许为空'}],
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                imgDialog: false,
                imgSrc: '',
                addDialogTitle:'新增',
                rowClick:{}
            }
        },
        methods: {
            uploadRemove(file, fileList) {
                console.log('uploadRemove---',file)
                const $ = this.$jquery;
                this.addForm.pic_url.forEach((v, i, s) => {
                    if (file.response != undefined && v == file.response.data) {
                        s.splice(i, 1);
                        this.disabled = false;
                        $(".el-upload--picture-card").show();
                    }
                    if (file.response == undefined && v == file.url.replace(require('../../value/string').fileread, '')) {
                        s.splice(i, 1);
                        this.disabled = false;
                        $(".el-upload--picture-card").show();
                    }
                })
            },
            uploadPreview(file) {

                this.dialogImageUrl = file.url;
                this.dialogVisible = true;

            },
            uploadSuccess(res) {
                if (res.errno == 0) {
                    this.addForm.pic_url.push(res.data);
                    this.disabled = false;
                    const $ = this.$jquery;
                    $(".el-upload--picture-card").hide();
                }
                console.log('res-----', res);
            },
            //显示新增界面
            addFlashpic(){
                this.addDialogTitle = '新增';
                this.addFormVisible = true;
                this.addForm = {
                    pic_title: '',
                    pic_url: [],
                    expire_time: '2099-12-31',
                    order_num: 999,
                    status: 1,
                };
                this.fileList = [];
                this.$nextTick(_=>{
                    let $ = this.$jquery;
                    $(".el-upload--picture-card").show();
                })

            },
            //处理新增
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        let addinfo = {
                            pic_title: this.addForm.pic_title,
                            pic_url: this.addForm.pic_url[0],
                            expire_time: this.addForm.expire_time,
                            order_num: this.addForm.order_num,
                            status: this.addForm.status
                        };
                        let par = {};
                        if(this.addDialogTitle == '修改'){
                            par.url = '/flashpic/flashpic_edit'
                            par.params = {data:addinfo,id:this.rowClick.id};
                        }else {
                            par.url = '/flashpic/flashpic_add';
                            par.params = addinfo;
                        }
                        console.log(par);
                        this.$ajax.post(par.url, par.params).then(res => {
                            console.log('result===>', res.data);
                            let result = res.data;

                            if (result.errno == 0) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.addLoading = false;
                                this.getFlashpicList();
                            }
                            else {
                                this.$message({
                                    message: '提交失败',
                                    type: 'error'
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                            this.$message({message: error.message, type: 'error'});
                        });
                    }
                });
            },
            getFlashpicList(){
                this.tableLoading = true;
                this.$ajax.post('/flashpic/flashpic_list', {}).then(res => {
                    let result = res.data;
                    if (result.errno == 0) {
                        result.data.forEach(v => {
                            v.url = require('../../value/string').fileread + v.pic_url
                        });
                        this.tableData = result.data;
                        this.tableLoading = false;
                    }
                }).catch(err => {
//                    this.tableLoading = false;
                    this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                    console.log('----', err)
                });
            },
            imgClose(){
                this.imgDialog = false;
            },
            imgClick(url){
                this.imgSrc = url;
                this.imgDialog = true;
            },

            deleteFlashpic(index,row){
                console.log('row-----',row);
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post('flashpic/flashpic_delete',{id:row.id}).then(res=>{
                        if(res.data.errno==0){
                            this.$message({type: 'success', message: '删除成功!'});
                            this.tableData.splice(index,1);
                        }else{
                            this.$message({type: 'error', message: '删除失败'});
                        }
                    }).catch(err=>{
                        this.$message({type: 'error', message: '删除失败'});
                    })

                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            editFlashpic(index,row){
                this.addDialogTitle = '修改';
                this.addFormVisible = true;
                this.addForm = {
                        pic_title: row.pic_title,
                        expire_time: row.expire_time,
                        order_num: row.order_num,
                        status: row.status,
                };
                this.addForm.pic_url = [];
                this.addForm.pic_url.push(row.pic_url);
                this.fileList = [];
                this.fileList.push({
                    url:row.url
                })
                this.rowClick = row;
                this.$nextTick(_=>{
                    let $ = this.$jquery;
                    $(".el-upload--picture-card").hide();
                })

            }
        },
        computed: {
        },
        created(){

        },
        mounted(){
            this.getFlashpicList();
        }
    }
</script>
<style>

</style>