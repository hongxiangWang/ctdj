<template>
    <div>
        <table1
                :operates="operate"
                :tableData="tableData"
                :tdArr="tdArr"
                :tableLoading="tableLoading"
                @viewRole="viewRole"
                @editRole="editRole"
                @deleteRole="deleteRole"
        ></table1>
    </div>
</template>

<script>
    import table1 from '../../components/table1.vue';
    import '../../assets/elCss/loading.css'

    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎555555555555',
                    address: '上海市普陀区金沙江路 1518 弄 666666'
                }], //需要向table填写的数据
                tdArr: [
                    {lable: '角色名称', prop: 'name', width: '200', align: 'center'},
                    {lable: '备注', prop: 'remark', width: '200', align: 'center'},
                    {lable: '状态', prop: 'status', width: '100', align: 'center'}
                ],
                //td 显示的列
                operate: [
                    {lable: '查看', type: '', clickFun: 'viewRole', size: "small"},
                    {lable: '编辑', type: '', clickFun: 'editRole', size: "small"},
                    {lable: '删除', type: 'danger', clickFun: 'deleteRole', size: "small"}
                ],
                //操作的方法
                tableLoading: true
            }
        },
        methods: {
            viewRole(index, row) {
                console.log('info--', index, row);
            },
            editRole(index, row) {
                console.log('edit----', index, row);
            },
            deleteRole(index,row){
                console.log('delete--',index,row);
            }
        },
        components: {
            table1
        },

        //获取用户列表
        mounted() {
            this.$ajax.post('/role/rolelist', {}).then(res => {
                let result = res.data;
                console.log(result);
                if (result.errno == 0) {
                    this.tableData = result.data;
                    this.tableData.forEach(value => {
                        value.status = value.status == 1 ? '有效' : '无效';
                    });
                    this.tableLoading = false;
                }
            }).catch(err => {
                this.tableLoading = false;
                this.$message({message: '抱歉，获取数据失败，请重试', type: 'error'})
                console.log('----', err)
            });
        },
        computed: {}
    }

</script>

