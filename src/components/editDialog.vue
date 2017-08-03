<template>
    <el-dialog
            :visible.sync="editDialog"
            :before-close="handleClose">
        <span slot="title">
            <span>信息修改</span>
        </span>
        <div style="padding-right:40px">
            <el-form ref="form" :model="cell" label-width="80px">
                <el-form-item
                        v-if="cell.oType=='input'"
                        :label="cell.label">
                    <el-input v-model="cell.value"></el-input>
                </el-form-item>

                <el-form-item
                        v-if="cell.oType=='select'"
                        :label="cell.label">
                    <el-select v-model="cell.value" placeholder="请选择">
                        <el-option
                                v-for="(se,index) in selectArray"
                                :label="se.label"
                                :key="se.label"
                                :value="se.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        v-if="cell.oType=='date'"
                        :label="cell.label">
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="cell.value"
                    ></el-date-picker>

                </el-form-item>


                <el-form-item
                        v-if="cell.oType=='switch'"
                        :label="cell.label">
                    <el-switch on-text="" off-text=""
                               v-model="cell.value" @change="switchChange"></el-switch>
                </el-form-item>

            </el-form>

            <span v-if="cell.oType == 'text'">
                {{cell.label}}:{{cell.value}} <small class="noedit">[不可修改]</small>
            </span>


        </div>
        <div slot="footer">
            <el-button @click="$emit('closeDia')">取 消</el-button>
            <el-button type="primary" @click="sureEdit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {selectArr} from '../assets/kvword.js'

    export default {
        data() {
            return {
            }
        },
        props: {
            cell: {},
            editDialog : Boolean,

        },
        methods: {
            handleClose() {
                this.$emit('closeDia')
            },
            sureEdit() {
                this.$emit('sureEdit', this.form,this.cell)
            },
            switchChange() {

            }
        },
        computed: {
            selectArray(){
                return selectArr[this.cell.key]
            },
            form(){
                return {
                    label: this.cell.label,
                    value: this.cell.value
                }
            }
        },
    }


</script>

<style lang="less">
    .noedit{
        color: #FFAB91;
    }
</style>