<template>
    <div id="planItem">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
            <el-row>
                <el-col :span="4">
                    <el-select v-model="ruleForm.week">
                        <el-option
                                v-for="item in weekArray"
                                :label="item.label"
                                :key="item.value"
                                :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="活动名称">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="4" style="text-align: center">
                    <el-button>新增</el-button>
                </el-col>
                <el-col :span="20" >
                    <el-form-item label="活动名称">
                        <el-input type="textarea" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4" style="text-align: center">
                    <el-button type="danger">删除</el-button>
                </el-col>
                <el-col :span="20" >
                    <el-form-item label="备注">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>
<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {
            ElCol,
            ElRow},
        data() {
            return {
                ruleForm: {
                    name: '',
                    week:''
                },
                weekArray:[
                    {label:'第一周',value:'1'},
                    {label:'第二周',value:'2'},
                    {label:'第三周',value:'3'},
                    {label:'第四周',value:'4'},
                    {label:'第五周',value:'5'}
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    #planItem{
        padding:20px 10px;
        box-shadow: 0 0 5px rgba(0,0,0,.3);
        border-top:#FFAB91 dashed 5px ;
    }
</style>