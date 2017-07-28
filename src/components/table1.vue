<template>
    <div>
        <el-table
                :data="tableData"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                max-height="500"
                border
                style="width: 100%">
            <el-table-column
                    v-for="td in tdArr"
                    :label="td.lable"
                    :width="td.width">
                <template scope="scope">
                    <span>{{ scope.row[td.prop] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope">
                    <el-button
                            v-for="op in operates"
                            :size="op.size"
                            type="op.type"
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
            return {}
        },
        props: {
            operates: Array,
            tableData: Array,
            tdArr: Array
        },
        methods: {
            emit(index, row, fun) {
                //console.log(fun);
                this.$emit(fun, index, row)
            }
        },
        mounted() {
            console.log('aaaaaaaa', this.operates);
        },
        computed: {
            tableLoading: () => {
                return this.tableData == [] ? true : false;
            }
        }
    }
</script>

<style>
    .el-table th > .cell {
        text-align: center;
    }
</style>