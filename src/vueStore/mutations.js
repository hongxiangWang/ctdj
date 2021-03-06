/*
* permissionSet
* */
const GET_ROLE_FUN = 'GET_ROLE_FUN'
const GET_ALL_FUN = 'GET_ALL_FUN'
const CHANGE_PERMISSION_TREE_TITLE = 'CHANGE_PERMISSION_TREE_TITLE'//改变左侧树权限管理标题改变
const CHANGE_TREENODE_ROLECODE = 'CHANGE_TREENODE_ROLECODE'//改变左侧树角色管理

/*
* organizedSet
* */
const ORGANIZED_PARTY = 'ORGANIZED_PARTY' // 组织数组 organizedSet
const ORGANIZED_CASCADER_DATA = 'ORGANIZED_CASCADER_DATA' // 组织数组 organizedSet
export default {
     /*
    * permissionSet
    * */
    [GET_ROLE_FUN](state, payload) {
        state.permission.roleFun = payload;
    },
    [GET_ALL_FUN](state, payload) {
        state.permission.allFun = payload;
    },
    [CHANGE_PERMISSION_TREE_TITLE](state, payload) {
        state.permission.treeTile = payload;
    },
    [CHANGE_TREENODE_ROLECODE](state, payload) {
        state.permission.chooseTreeNodeRoleCode = payload;
    },
    /*
    * organizedSet
    * */
    [ORGANIZED_PARTY](state, payload) {
        state.organized.party = payload;
    },
    [ORGANIZED_CASCADER_DATA](state, payload){
        state.organized.cascader_data = payload;

    }

}
