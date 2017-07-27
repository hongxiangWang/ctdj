<template>
    <div>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column
                v-for="tr in trArr"
                :label="tr.lable"
                :width="tr.width">
            <template scope="scope">
                <span>{{ scope.row[tr.prop] }}</span>
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
        asdasda{{operates}}
    </div>
</template>

<script>
    import '../assets/elCss/table.css'
    export default {
        data() {
            return {

            }
        },
        props: {
            operates: Array,
            tableData:Array,
            trArr:Array
        },
        methods: {
            emit(index,row,fun){
                //console.log(fun);
                this.$emit(fun,index,row)
            }
        },
        mounted(){
            console.log('aaaaaaaa',this.operates);
        }
    }
</script>

<style>
    .el-table th>.cell{
        text-align: center;
    }
</style>