<template>
    <div>
        <el-form :model="form" ref="planAdd" label-width="100px">
            <el-row type="flex" justify="center">
                <el-col :span="16">
                    <el-row>
                    <el-col :span="10">
                        <el-form-item label="选择党支部"
                                      :rules="notEmpty"
                                      prop="dept_id">
                            <organized-cascader
                                    @cascaderChange="cascaderChange">
                            </organized-cascader>
                        </el-form-item>
                    </el-col>


                    <el-col :span="8">
                        <el-form-item label="选择年/月"
                                      :rules="notEmpty"
                                      prop="yearMonth">
                            <el-date-picker
                                    v-model="form.yearMonth"
                                    type="month"
                                    placeholder="选择年月">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-button style="float: right" type="primary" @click="submit" :disabled="submitBtnDisable">提交</el-button>
                    </el-col>
                    </el-row>


                    <el-row>
                    <week-plan
                            ref="weekPlan"
                            v-for="(plan,index) in planArray"
                            @add="addItem"
                            @remove="removeItem"
                            :key="plan.week"
                            :plan="plan"
                            :index="index">
                    </week-plan>
                    </el-row>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import weekPlan from './planItem.vue'
    import organizedCascader from '../../components/organizedCascader.vue'
    import ElRow from "element-ui/packages/row/src/row";

    export default {
        data() {
            return {
                form:{
                    yearMonth: '',
                    dept_id: '',
                },

                planArray: [
                    {
                        week: '',
                        title: '',
                        context: '',
                        remarks: ''
                    }
                ],
                notEmpty: [{required: true, message: '不许为空'}],
                submitBtnDisable:false,
            }
        },
        components: {
            ElRow,
            weekPlan,
            organizedCascader
        },
        methods: {
            cascaderChange(call) {
                this.form.dept_id = call[call.length - 1];
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
                    return;
                }
                let isFull = false;
                this.$refs.planAdd.validate(valid => {
                    isFull = valid;
                });
                this.$refs.weekPlan.forEach(con => {
                    con.$refs.planForm.validate(valid => {
                        isFull = valid && isFull;
                    })
                });
                if (isFull) {
                    let activityplan_data = [];
                    let admin_id = require('store').get('people_info')[0].admin_id;
                    this.planArray.forEach(v => {
                        let json = {};
                        json.pub_year = this.form.yearMonth.Format('yyyy');
                        json.pub_month = this.form.yearMonth.Format('MM');
                        json.pub_week = v.week;
                        json.activity_name = v.title;
                        json.activity_content = v.context;
                        json.activity_memo = v.remarks;
                        json.dept_id = this.form.dept_id;
                        json.admin_id = admin_id;
                        activityplan_data.push(json);
                    });
                    this.submitBtnDisable = true;
                    this.$ajax.post('/activity_plan/activity_plan_add', {activityplan_data: activityplan_data}).then(res => {
                        console.log('res--------', res.data);
                        if (res.data.errno == 0) {
                            this.$message({message: '添加成功,2秒后自动跳转', type: 'success'});

                            setTimeout(_ => {
                                this.$router.replace('/home/planList');
                                this.submitBtnDisable = false;
                            }, 2000);

                        }
                    }).catch(err => {
                        console.log('error--------', err.message);
                    })
                } else {
                    this.$message({message: '请填写完整', type: 'warning'});
                }
                console.log();
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