<template>
    <div>
        <el-dialog
                title="提示"
                :visible.sync="infoDialog"
                size="large"
                :before-close="handleClose">
            <span>
                <!--<cell ref="cellArr"-->
                      <!--v-for="ce in cellDate"-->
                      <!--:cell="ce"-->
                      <!--:key="ce.text"-->
                      <!--:editMode="true"-->
                      <!--@edit ="edit"-->
                      <!--@adjustHeight="adjustHeight">-->
                 <!--</cell>-->
            </span>
        </el-dialog>
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
                tableData: [], //需要向table填写的数据
                tdArr: [{lable: '姓名', prop: 'people_name', width: '180', align: 'center'},
                    {lable: '党员类型', prop: 'type_name', width: '180', align: 'center'},
                    {lable: '民族', prop: 'people_race', width: '180', align: 'center'},
                    {lable: '籍贯', prop: 'people_residence', width: '180', align: 'center'},
                    {lable: '出生年月', prop: 'people_birthday', width: '180', align: 'center'},
                    {lable: '性别', prop: 'people_gender', width: '80', align: 'center'}],
                //td 显示的列
                operate: [{lable: '查看', type: '', clickFun: 'info', size: "small"},
                    {lable: '编辑', type: '', clickFun: 'edit', size: "small"}],
                //操作的方法

                tableLoading: false,

                infoDialog:false,

                cellDate:[]
            }
        },
        methods: {
            info(index, row) {
                this.infoDialog =true;
                console.log('info--', index, row);
            },
            edit(index, row) {
                console.log('edit----', index, row);
            },
            handleClose() {
                this.infoDialog = false;
            },
        },
        components: {
            table1
        },

        //获取用户列表
        mounted() {
            this.$ajax.post('/people/userlist', {}).then(res => {
                console.log('----', res)
                if (res.data.errno == 0) {
                    this.tableData = res.data.data;
                    this.tableData.forEach(value => {
                        value.people_gender = value.people_gender == 1 ? '男' : '女';
                    });
                    this.tableLoading = false;
                }else {
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

