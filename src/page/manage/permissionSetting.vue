<template>
    <div id="permissionSet">
        <el-row :gutter="20">
            <el-col>
                <h2>权限管理--{{itemTile}}</h2>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8" id="menuFunSetLeft">
                <permissionTree></permissionTree>
            </el-col>
            <el-col :span="16">
                <permissionRight></permissionRight>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import permissionTree from './permissionTree.vue'
    import permissionRight from './permissionRight.vue'

    export default{
        name: 'meunFunSet',
        data(){
            return {
                parents: 'ppppp'
            }
        },
        components: {
            permissionTree, permissionRight
        },
        computed: {
            itemTile(){
                return this.$store.state.permission.treeTile;
            }
        }
    }
</script>
<style lang="less">
    #permissionSet {
        margin-top: 100px;
        padding: 10px 15px;
    }
</style>
