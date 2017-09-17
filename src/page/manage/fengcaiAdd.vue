<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="选择党支部"
                          label-width="100px"
                          :rules="notEmpty"
                          prop="dept_id">
                <organized-cascader
                        :cascderValue="cascderValue"
                        @cascaderChange="cascaderChange">
                </organized-cascader>
            </el-form-item>

            <el-form-item label="主题"
                          label-width="100px"
                          :rules="notEmpty"
                          prop="dept_id">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import organizedCascader from './organizedCascader.vue'

    export default {
        data() {
            return {
                form: {
                    dept_id: ''
                }
            }
        },
        components: {
            organizedCascader
        }
    }
</script>