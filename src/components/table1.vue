<template>
    <div>
        <el-table
                :data="tableData"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                max-height="500"
                border>
            <el-table-column
                    type="index"
                    align="center"
                    width="60">
            </el-table-column>
            <el-table-column
                    v-for="td in tdArr"
                    :label="td.lable"
                    :key="td.lable"
                    :align="td.align"
                    :width="td.width">
                <template scope="scope">
                    <span>{{ scope.row[td.prop] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"
                             fixed="right"
                             :min-width="200"
                             align="center">
                <template scope="scope">
                    <el-button
                            v-for="op in operates"
                            :size="op.size"
                            :type="op.type"
                            :key="op.lable"
                            @click="emit(scope.$index, scope.row,op.clickFun)">{{op.lable}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import '../assets/elCss/table.css'

    export default {
        data() {
            return {
                table: this.tableData
            }
        },
        props: {
            operates: Array,
            tableData: Array,
            tdArr: Array,
            tableLoading: Boolean
        },
        methods: {
            emit(index, row, fun) {
                //console.log(fun);
                this.$emit(fun, index, row)
            }
        },
        mounted() {

        },
    }
</script>

<style>
    .el-table th > .cell {
        text-align: center;
    }
    .el-table .cell{
        padding-left: 5px;
        padding-right: 5px;
    }
</style>