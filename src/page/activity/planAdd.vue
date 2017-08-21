<template>
    <div>
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <label>选择党支部</label>
                <organized-cascader
                        @cascaderChange="cascaderChange">
                </organized-cascader>

                <label style="margin-left: 2rem">选择年/月</label>
                <el-date-picker
                        v-model="yearMonth"
                        type="month"
                        placeholder="选择年月">
                </el-date-picker>
                <el-button style="float: right" type="primary" @click="submit">提交</el-button>
                <br>
                <week-plan
                        ref="weekPlan"
                        v-for="(plan,index) in planArray"
                        @add="addItem"
                        @remove="removeItem"
                        :key="plan.week"
                        :plan="plan"
                        :index="index">
                </week-plan>


            </el-col>
        </el-row>
    </div>
</template>
<script>
    import weekPlan from './planItem.vue'
    import organizedCascader from '../../components/organizedCascader.vue'

    export default {
        data() {
            return {
                yearMonth: '',

                planArray: [
                    {
                        week: '',
                        title: '',
                        context: '',
                        remarks: ''
                    }
                ]
            }
        },
        components: {
            weekPlan,
            organizedCascader
        },
        methods: {
            cascaderChange(call) {
                console.log(call)
            },
            submit() {
                let weeks = []
                this.planArray.forEach(plan => {
                    weeks.push(plan.week);
                })
                let isRule = true;
                weeks.forEach((v, i, s) => {
                    if (s.indexOf(v) != i) {
                        isRule = false;
                        return;
                    }
                });
                if (!isRule) {
                    console.log('-weeks-----', weeks)
                    this.$message({message: '星期有重复，请检查', type: 'warning'});
                }
                let isFull = false;
                this.$refs.weekPlan.forEach(con=>{
                    con.$refs.planForm.validate(valid=>{
                        isFull = valid
                    })
                });
                if(isFull){
                    let params = {}
                    this.$ajax.post('/activity_plan/activity_plan_add',).then(res=>{

                    }).catch(err=>{

                    })
                }else{
                    this.$message({message: '请填写完整', type: 'warning'});
                }
                console.log(this.$refs.weekPlan);
            },
            addItem(index) {
                let plan = {
                    week: '',
                    title: '',
                    context: '',
                    remarks: ''
                }
                if (this.planArray.length < 5) {
                    this.planArray.push(plan)
                } else {
                    this.$message({message: '最多添加五个', type: 'warning'});
                }

            },
            removeItem(index) {
                this.planArray.splice(index, 1);
            }
        },
    }
</script>