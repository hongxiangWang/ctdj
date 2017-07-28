<template>
    <div>
        <table1
                :operates="operate"
                :tableData="tableData"
                :tdArr="tdArr"
                :tableLoading="tableLoading"
                @info="info"
                @edit="edit"
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
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }], //需要向table填写的数据
                tdArr: [{lable: '姓名', prop: 'people_name', width: '180', align: 'center'},
                    {lable: '党员类型', prop: 'type_name', width: '180', align: 'center'},
                    {lable: '民族', prop: 'people_race', width: '180', align: 'center'},
                    {lable: '籍贯', prop: 'people_residence', width: '180', align: 'center'},
                    {lable: '出生年月', prop: 'people_birthday', width: '180', align: 'center'},
                    {lable: '性别', prop: 'people_gender', width: '80', align: 'center'}],
                //td 显示的列
                operate: [{lable: '查看', type: 'primary', clickFun: 'info', size: "small"},
                    {lable: '编辑', type: 'primary', clickFun: 'edit', size: "small"}],
                //操作的方法

                tableLoading: true
            }
        },
        methods: {
            info(index, row) {
                console.log('info--', index, row);
            },
            edit(index, row) {
                console.log('edit----', index, row);
            }
        },
        components: {
            table1
        },

        //获取用户列表
        mounted() {
            this.$ajax.post('/people/userlist', {}).then(res => {
                console.log('----', res)
                if (Number(res.data.data.flg) == 0) {
                    this.tableData = res.data.data.data;
                    this.tableData.forEach(value => {
                        value.people_gender = value.people_gender == 1 ? '男' : '女';
                    });
                    this.tableLoading = false;
                }
            }).catch(err => {
                this.tableLoading = false;
                this.$message({message:'抱歉，获取数据失败，请重试',type:'error'})
                console.log('----', err)
            });
        },
        computed: {}
    }

</script>

