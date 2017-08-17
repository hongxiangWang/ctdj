<template>
    <div>
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <week-plan>
                </week-plan>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    import weekPlan from './planItem.vue'
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        data() {
            return {
                msg: 'Hello world!'
            }
        },
        components:{
            ElCol,
            weekPlan
        }
    }
</script>