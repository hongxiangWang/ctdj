<template>
    <div id="permissionMenuTree">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" highlight-current></el-tree>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data: [],
                defaultProps: {
                    'label': 'name',
                    'id': 'id',
                }
            };
        },
        methods: {
            handleNodeClick(data, node, nodeData) {
                this.$store.dispatch('getRoleFun', data.id);
                this.$store.commit('CHANGE_TREENODE_ROLECODE', data.id);
                this.$store.commit('CHANGE_PERMISSION_TREE_TITLE', data.name);
            }
        },
        computed: {

        },
        mounted(){
            this.$ajax.post('/role/role_list')
                .then((response) => {
                    this.$data.data = response.data.data;
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    this.$message({message: '获取信息失败' + error.message, type: 'error'});
                    this.$data.data = []
                })

        }

    };
</script>
