<template>
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item
                v-if="it.type != 'text'"
                class="formItem"
                v-for="it in dataArr"
                :key="it.label"
                :rules="it.rule"
                :prop="it.key"
                :label="it.label">

            <el-input v-if="it.type == 'input'" v-model="it.value"></el-input>

            <el-select v-if="it.type == 'select'" v-model="it.value" placeholder="请选择" @change="selectClick(it)">
                <el-option
                        v-for="op in selectArr[it.key]"
                        :label="op.label"
                        :key="op.value"
                        :value="op.value"
                        :disabled="op.disabled"
                        ></el-option>
            </el-select>

            <el-date-picker
                    v-if="it.type == 'date'"
                    type="date"
                    placeholder="选择日期"
                    v-model="it.value"
                    style="width: 40%;"></el-date-picker>

            <el-cascader
                    v-if="it.type == 'cascader'"
                    expand-trigger="hover"
                    :props="it.props"
                    :options="it.cascaderOptions"
                    change-on-select
                    v-model="it.value"
                    @change="cascaderChange">
            </el-cascader>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        data() {
            return {}

        },
        props: {
            dataArr: Array,
            selectArr: {},

        },
        computed: {
            form() {
                let jsonArr = {}
                this.dataArr.forEach(value => {
                    let key = value.key;
                    jsonArr[key] = value.value;
                })
                return jsonArr;
            }
        },
        methods:{
            cascaderChange(call){
                this.$emit('cascaderChange',call)
            },
            selectClick(it){
                if(it.selectClick!=undefined){
                   this.$emit(it.selectClick,it)
                }
            }
        },
        mounted() {

        }
    }
</script>

<style lang="less">
    .formItem {
        width: 49%;
        display: inline-block;
        margin: 0 auto;
        border: 1px #ECDBD6 solid;
        margin-left: -1px;
        margin-top: -1px;
        padding: 5px 3px;
        min-height:36px;

    .el-form-item__error {
        top: 20%;
        left: auto;
        right: 2%;
    }

    .el-form-item__label {
        text-align: center;
        border-right: 1px solid #ECDBD6;
    }

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-input, .el-input__inner {
        display: block;
        width: 99%;
        margin-left: 3px;
    }

    }


</style>