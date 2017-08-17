<template>
    <div>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px">
                <!--<el-form-item label="登陆账号" prop="username">-->
                <!--<el-input v-model="addForm.username" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="绑定员工" prop="people_id">-->
                <!--<el-autocomplete-->
                <!--class="inline-input"-->
                <!--v-model="addForm.bind_people"-->
                <!--:fetch-suggestions="bindSearch"-->
                <!--placeholder="请输入员工姓名"-->
                <!--:trigger-on-focus="false"-->
                <!--@select="handleBindSelect"-->
                <!--&gt;</el-autocomplete>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="管理员角色" prop="admin_role">-->
                <!--<el-select v-model="addForm.admin_role" placeholder="请选择">-->
                <!--<el-option-->
                <!--v-for="item in select_role_list"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="所属本地网" prop="prov_latn_id">-->
                <!--<prov-latn :prov_latn_id="addForm.prov_latn_id"></prov-latn>-->
                <!--</el-form-item>-->
                <el-form-item label="状态" prop="add_status">
                    <el-radio-group v-model="addForm.status">
                        <el-radio  :label="1">有效</el-radio>
                        <el-radio  :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                addFormVisible:true,
                addForm:{
                    status:1
                }
            }
        }
    }
</script>
<style>

</style>