<template>
    <div>

        <el-row type="flex" justify="center">
            <el-col :span="8">
                <organized-cascader
                        @cascaderChange="cascaderChange">
                </organized-cascader>
            </el-col>
            <el-col :span="8" :push="4">
                <el-button >添加</el-button>
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
                   <img :src="scope.row.url" height="120px" @click="imgClick(scope.row.url)" />
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
                   {{ scope.row.pic_content }}
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
                    {{ scope.row.small_dept_name }}<br>
                    <small> {{ scope.row.big_dept_name }}</small>
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

            <el-table-column label="操作"  fixed="right" width="200" align="center" >
                <template scope="scope">
                    <el-button
                            size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>


        </el-table>
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
    import '../../assets/elCss/table.css';
    import '../../assets/elCss/loading.css';
    import organizedCascader from '../../components/organizedCascader.vue'
    export default {
        data() {
            return {
                tableData: [],
                imgDialog:false,
                imgSrc:''
            }
        },
        components:{
            organizedCascader
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                this.imgDialog = true;
                console.log(index, row);
            },
            imgClose(){
                this.imgDialog = false;
            },
            imgClick(url){
                this.imgSrc = url;
                this.imgDialog = true;
            },
            cascaderChange(call){

            }
        },
        mounted(){
            getFengcaiList(this)
        }
    }

    function getFengcaiList(vm){
        vm.$ajax.post('/fengcai/fengcai_list', {}).then(res => {
            if (res.data.errno == 0) {
                 res.data.data.forEach(v=>{
                    v.url = require('../../value/string').fileread + v.pic_url
                });
                vm.tableData = res.data.data;
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