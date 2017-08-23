<template>
    <div>
        <el-form :model="plan" ref="planEditForm" label-width="100px">
            <!--<el-form-item label="选择党支部"-->
                          <!--:rules="notEmpty"-->
                          <!--prop="dept_id">-->
                <!--<organized-cascader-->
                        <!--ref="organizedCascader"-->
                        <!--@cascaderChange="cascaderChange">-->
                <!--</organized-cascader>-->
            <!--</el-form-item>-->
             <el-row>
                 <el-col :span="12">
                     <el-form-item label="选择年/月"
                                   :rules="notEmpty"
                                   prop="yearMonth">
                         <el-date-picker
                                 v-model="plan.yearMonth"
                                 type="month"
                                 placeholder="选择年月">
                         </el-date-picker>
                     </el-form-item>
                 </el-col>
                 <el-col :span="11" :push="1">
                     <el-form-item label-width="5"
                                   label="周"
                                   :rules="notEmpty"
                                   prop="week">
                         <el-select v-model="plan.week">
                             <el-option
                                     v-for="item in weekArray"
                                     :label="item.label"
                                     :key="item.value"
                                     :value="item.value"></el-option>
                         </el-select>
                     </el-form-item>
                 </el-col>
             </el-row>
            <el-form-item label="活动名称"
                          :rules="notEmpty"
                          prop="title">
                <el-input v-model="plan.title"></el-input>
            </el-form-item>

            <el-form-item label="活动内容"
                          :rules="notEmpty"
                          prop="context">
                <el-input type="textarea" v-model="plan.context"></el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="plan.remarks"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import organizedCascader from '../../components/organizedCascader.vue'
    export default {
        data() {
            return {
                notEmpty: [{required: true, message: '不许为空'}],
                weekArray: [
                    {label: '第一周', value: '1'},
                    {label: '第二周', value: '2'},
                    {label: '第三周', value: '3'},
                    {label: '第四周', value: '4'},
                    {label: '第五周', value: '5'}
                ],
            }
        },
        props:{
            plan:{}
        },
        methods:{
            cascaderChange(call){
                this.plan.dept_id = call[call.length - 1];
            }
        },
        components:{
            organizedCascader
        }
    }
</script>