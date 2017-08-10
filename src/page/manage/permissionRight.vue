<template>
    <div>
        <div><el-button style="float: right; margin-right: 2rem" type="primary" @click="getCheckedNodes">
            保存
        </el-button></div>
        <el-tree
                :data="data"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps">
        </el-tree>
        <p>TEST checknode:{{checkednode}}</p>
    </div>
</template>

<script>
    let allNodeId = [];
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id: 'id'
                },
                ajaxData: []
            };
        },
        computed: {
            data(){
                return this.$store.state.allFun;
            },
            checkednode(){
                let vm = this;
                let child = vm.$store.state.roleFun.length;
                console.log('roleFun----',vm.$store.state.roleFun);
                vm.$nextTick(function () {
                    let v = vm.$store.state.roleFun.length;
                    let n = [];
                    let c = [];
                    if (vm.$store.state.roleFun.length == 0) {

                    } else {
                        c = forEachChild(n, vm.$store.state.roleFun);
                    }
                    console.log("c===>",c);
                    this.$refs.tree.setCheckedKeys(c);
                })
                return child;
            }
        },
        methods: {
            //保存修改后节点
            getCheckedNodes(){
                let role_code = this.$store.state.permission.chooseTreeNodeRoleCode;
                if (role_code == -1) {
                    this.$message({message: '请先选择左侧角色', type: 'warning'})
                    return;
                }
                let terrParent = [];
                terrParent = forEachParent(this.$store.state.allFun, this.$refs.tree.getCheckedNodes(), terrParent);
                let terrNode = this.$refs.tree.getCheckedKeys();
                let sureNode = terrNode.concat(terrParent);
                console.log('sureNode', JSON.stringify(sureNode));
                let accessData = saveAjaxJson(role_code, sureNode, allNodeId);
                let params = {
                    role_id: role_code,
                    accessdata: accessData
                }
                console.log('allNodeId', JSON.stringify(params));

                this.$ajax.post('/access/access_edit', params).then(response => {
                    if (response.data.errno == 0) {
                        this.$message({message: '保存成功', type: 'success'})
                    } else {
                        this.$message({message: '保存失败', type: 'error'})
                    }
                }).catch(error => {
                    console.log(JSON.stringify(error.message));
                });
            }
        },
        mounted(){
            this.$ajax.post('/node/node_list').then(response => {
                response.data.data.forEach(value=>{
                   value.label = value.label+"--->"+value.id;
                   if(value.children.length>0){
                       value.children.forEach(value2=>{
                           value2.label = value2.label+"--->"+value2.id;
                       });
                   }
                });
                this.$store.commit('GET_ALL_FUN', response.data.data)
                allNodeId = [];
                allNodeId = getAllFunAllID(response.data.data, allNodeId);
            }).catch(error => {
                this.$message({message: '获取信息失败' + error.message, type: 'error'})
            });
        }
    };
    //遍历子节点
    function forEachChild(child, arr) {
        if (arr.length == 0) {
            return [];
        }
        arr.forEach(function (value, index, self) {
//      if (value.children.length > 0 && value.node_status == 0) {
//        forEachChild(child, value.children);
//      }
//      if (value.node_status == 0 && value.children.length ==0) {
//        child.push(value.id);
//        //console.log('length',value.children.length)
//      }

            if (value.node_status == 1) {
                if(value.children.length == 0){
                    child.push(value.node_id);
                }
                if (value.children.length > 0) {
                    forEachChild(child, value.children);
                }
            }
        });

        return child;
    }
    //追寻父节点
    function forEachParent(funArr, arr, terrParent) {
        arr.forEach(function (value, index, self) {
            if (terrParent.indexOf(value.pid) < 0) {
                terrParent.push(value.pid);
                forEachParentPid(funArr, value.pid, terrParent);
            }
            if (value.children.length > 0) {
                forEachParent(funArr, value.children, terrParent);
            }
        });
        return terrParent;
    }
    //追寻父节点PID
    function forEachParentPid(arr, pid, terrParent) {
        //alert(JSON.stringify(vm.$store.state.allFun))
        arr.forEach(function (value, index, self) {
            if (value.id == pid && value.pid != 0) {
                terrParent.push(value.pid);
            }
            if (value.children.length > 0) {
                forEachParentPid(value.children, pid, terrParent);
            }
        })
    }
    function getAllFunAllID(arr, allNodeId) {
        arr.forEach(function (value, index, self) {
            allNodeId.push(value.id);
            if (value.children.length > 0) {
                getAllFunAllID(value.children, allNodeId);
            }
        })
        return allNodeId;
    }
    //
    function saveAjaxJson(role_code, sureNode, allNodeId) {
        let jsonArr = [];
        allNodeId.forEach((value, index, self) => {
            let json = {};
            if (sureNode.indexOf(value) >= 0) {
                json.node_status = 1;
            } else {
                json.node_status = 0;
            }
            //json.role_code = role_code;
            json.node_id = value;
            jsonArr.push(json);
        })
        return jsonArr;
    }

</script>

