<template>
    <div id="planItem">
        <el-form :model="plan" ref="planForm" label-width="80px">
            <el-row>
                <el-col :span="4">
                    <el-form-item label-width="5"
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
                <el-col :span="20">
                    <el-form-item label="活动名称"
                                  :rules="notEmpty"
                                  prop="title">
                        <el-input v-model="plan.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="4" style="text-align: center">
                    <el-button type="danger" v-if="index!=0" @click="remove">删除</el-button>

                </el-col>
                <el-col :span="20" :push="pushNum">
                    <el-form-item label="活动内容"
                                  :rules="notEmpty"
                                  prop="context">
                        <el-input type="textarea" v-model="plan.context"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4" style="text-align: center">
                    <el-button @click="add">新增</el-button>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="备注">
                        <el-input v-model="plan.remarks"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                weekArray: [
                    {label: '第一周', value: '1'},
                    {label: '第二周', value: '2'},
                    {label: '第三周', value: '3'},
                    {label: '第四周', value: '4'},
                    {label: '第五周', value: '5'}
                ],
                notEmpty: [{required: true, message: '不许为空'}]
            }
        },
        props: {
            plan: {},
            index: Number
        },
        methods: {
            selectClick(call) {
                console.log('call-----', call)
            },
            add(index) {
                this.$emit('add', index);
            },
            remove() {
                this.$emit('remove', this.index)
            }
        },
        mounted() {
            console.log('vue---mounted---')
        },
        computed: {
            pushNum() {
                if (this.index == 0) {
                    return 4
                }
                return 0;
            }
        }
    }
</script>

<style lang="less" scoped>
    #planItem {
        padding: 20px 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .3);
        border-top: #FFAB91 dashed 3px;
        margin: 20px 0;
    }
</style>