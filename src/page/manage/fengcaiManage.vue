<template>
    <div>

        <el-row type="flex" justify="center">
            <el-col :span="8">
                <organized-cascader
                        @cascaderChange="cascaderChange">
                </organized-cascader>
            </el-col>
            <el-col :span="8" :push="4">
                <el-button @click="addBt">添加</el-button>
            </el-col>
        </el-row>
        <el-table
                style="margin-top: 20px;width: 100%"
                :data="tableData"
                border>
            <el-table-column
                    label="图片"
                    align="center"
                    width="200">
                <template scope="scope">
                    <img :src="scope.row.urls[0]" height="120px"/>
                </template>
            </el-table-column>
            <el-table-column
                    label="标题"
                    width="280">
                <template scope="scope">
                    <el-tag>{{ scope.row.title }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="说明"
                    width="180">
                <template scope="scope">
                    {{ scope.row.contents[0] }}
                </template>
            </el-table-column>

            <el-table-column
                    label="赞"
                    align="center"
                    width="80">
                <template scope="scope">
                    <i class="fa fa-thumbs-o-up"></i>
                    {{ scope.row.zan_num }}
                </template>
            </el-table-column>

            <el-table-column
                    label="党支部"
                    align="left"
                    width="200">
                <template scope="scope">
                    {{ scope.row.dept_name }}
                </template>
            </el-table-column>

            <el-table-column
                    label="创建时间"
                    align="left"
                    width="200">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    {{ scope.row.create_time }}
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="200"  align="center">
                <template scope="scope">
                    <el-button
                            size="small"
                            @click="infoClick(scope.$index, scope.row)">查看
                    </el-button>
                    <!--<el-button-->
                            <!--size="small"-->
                            <!--@click="handleEdit(scope.$index, scope.row)">编辑-->
                    <!--</el-button>-->
                    <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-pagination
                style="text-align: center"
                small
                @current-change="currentChange"
                :current-page.sync="currentPage"
                :total="noticeTotal"
                :page-size="5"
                layout="prev, pager, next">
        </el-pagination>

        <el-dialog
                title="查看"
                :visible.sync="infoDialog"
                size="large"
                :before-close="imgClose">
            <span v-for="(img,index) in imgArray" :key="img" style="text-align: center;margin: 0 auto;display: block; border: 1px solid #EEE">
                <img  :src="img" style="min-width:200px;max-width: 800px"/>
                <p>{{contentArray[index]}}</p>
            </span>

        </el-dialog>
        <el-dialog
                title="添加"
                :visible.sync="addDialog"
                size="tiny"
                :before-close="addDialogClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog = false">取 消</el-button>
            <el-button type="primary" @click="addDialog = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import '../../assets/elCss/table.css';
    import '../../assets/elCss/loading.css';
    import organizedCascader from '../../components/organizedCascader.vue'

    export default {
        data() {
            return {
                tableData: [],
                infoDialog: false,
                imgSrc: '',
                addDialog: false,
                noticeTotal: 0,
                currentPage: 1,
                dept_id: '',
                imgArray:[],
                contentArray:[],
            }
        },
        components: {
            organizedCascader
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post('/fengcai/fengcai_delete', {id: row.id}).then(res => {
                        console.log('res.data----', res.data);
                        if (res.data.errno == 0) {
                            this.$message({type: 'success', message: '删除成功!'});
                            this.tableData.splice(index, 1)
                        } else {
                            this.$message({type: 'error', message: '删除失败，请重试!'});
                        }
                    }).catch(err => {
                        this.$message({type: 'error', message: '删除失败，请重试!'});
                        console.log('----', err);
                    });

                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'});
                });

            },
            imgClose() {
                this.infoDialog = false;
            },
            infoClick(index,row) {
                this.imgArray = row.urls;
                this.contentArray = row.contents;
                this.infoDialog = true;
            },
            cascaderChange(call) {
                this.dept_id = call[call.length - 1];
                getFengcaiList(this);
            },
            addDialogClose() {
                this.addDialog = false;
            },
            addBt() {
                this.$router.push('/home/fengcaiAdd')
            },
            currentChange(call) {
                this.currentPage = call;
                getFengcaiList(this);
            }
        },
        mounted() {
            getFengcaiList(this)
        }
    }
    const helper = require('../../tools/helper')

    function getFengcaiList(vm) {
        vm.$ajax.post('/fengcai/fengcai_list', {page: vm.currentPage, count: 5, dept_id: vm.dept_id}).then(res => {
            if (res.data.errno == 0) {
                vm.noticeTotal = res.data.data.count;
                res.data.data.data.forEach(v => {
                    v.urls = [];
                    v.contents = [];
                    helper.stringToArray(v.pic_url_all).forEach(img => {
                        v.urls.push(require('../../value/string').fileread + img);
                    });
                    v.contents = helper.stringToArray(v.pic_content_all);
                });
                vm.tableData = res.data.data.data;
                console.log('----', vm.tableData)
            } else {
                vm.$message({message: '内容获取失败，请重试', type: 'error'});
            }
        }).catch(err => {
            vm.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
            console.log('----', err)
        });

    }
</script>