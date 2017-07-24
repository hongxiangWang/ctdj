const GET_ROLE_FUN = 'GET_ROLE_FUN'
const GET_ALL_FUN = 'GET_ALL_FUN'
const ADD_ITEMNUM = 'ADD_ITEMNUM'
const REMBER_ANSWER = 'REMBER_ANSWER'
const REMBER_TIME = 'REMBER_TIME'
const INITIALIZE_DATA = 'INITIALIZE_DATA'
const GET_USER_INFORM = 'GET_USER_INFORM'
const ADD_RECORD_STEP = 'ADD_RECORD_STEP'
const SUB_RECORD_STEP = 'SUB_RECORD_STEP'
const RECORD_STEP_1 = 'RECORD_STEP_1' //步骤变为1
const SHOW_STYSTEM_MEUN = 'SHOW_STYSTEM_MEUN'
const HIDE_STYSTEM_MEUN = 'HIDE_STYSTEM_MEUN'
const SHOW_PROCESS_MEUN = 'SHOW_PROCESS_MEUN'
const HIDE_PROCESS_MEUN = 'HIDE_PROCESS_MEUN'
const CHANGE_MEUNSETFUN_DATA = 'CHANGE_MEUNSETFUN_DATA'
const CHANGE_PERMISSION_TREE_TITLE = 'CHANGE_PERMISSION_TREE_TITLE'//改变左侧树权限管理标题改变
const CHANGE_TREENODE_ROLECODE = 'CHANGE_TREENODE_ROLECODE'//改变左侧树角色管理
const RECORD_BUSINESS_TYPE = 'RECORD_BUSINESS_TYPE' //business_type 1:语音中继，2：400 ，3：呼叫中心
const RECORD_FILLTABLE = 'RECORD_FILLTABLE' //填写表单数据
const RECORD_UPLOADFILES = 'RECORD_UPLOADFILES'//上传附件
const RECORD_SUBMITDATA = 'RECORD_SUBMITDATA' //最终提交数据
const RECORD_CLENTDATE = 'RECORD_CLENTDATE' //根据建议输入后选择的客户信息

const UPDATE_ACCOUT = 'UPDATE_ACCOUT'//更新用户信息

export default {
    [GET_ROLE_FUN](state, payload) {
        state.roleFun = payload;
    },

    [GET_ALL_FUN](state, payload){
        state.allFun = payload;
    },

    [GET_USER_INFORM](state, payload) {
        state.user_id = payload.res.users_id;
    },

    [ADD_ITEMNUM](state, payload) {
        state.itemNum += payload.num;
    },

    [REMBER_ANSWER](state, payload) {
        state.answerid[state.itemNum] = payload.id;
    },

    [REMBER_TIME](state) {
        state.timer = setInterval(() => {
            state.allTime++;
        }, 1000)
    },

    [INITIALIZE_DATA](state) {
        state.itemNum = 1;
        state.allTime = 0;
    },

    [ADD_RECORD_STEP](state){
        state.recored_step++;
    },

    [SUB_RECORD_STEP](state){
        state.recored_step--;
    },
    [RECORD_STEP_1](state){
        state.recored_step = 1;
    },
    [SHOW_STYSTEM_MEUN](state){
        state.manage_system_meun = true;
    },
    [HIDE_STYSTEM_MEUN](state){
        state.manage_system_meun = false;
    },
    [SHOW_PROCESS_MEUN](state){
        state.manage_process_meun = true;
    },
    [HIDE_PROCESS_MEUN](state){
        state.manage_process_meun = false;
    },
    [CHANGE_MEUNSETFUN_DATA](state, payload){
        state.changeMeunSetFunData = payload;
    },
    [CHANGE_PERMISSION_TREE_TITLE](state, payload){
        state.permission.treeTile = payload;
    },
    [CHANGE_TREENODE_ROLECODE](state, payload){
        state.permission.chooseTreeNodeRoleCode = payload;
    },
    [RECORD_BUSINESS_TYPE](state, payload){
        state.recordTable.business_type = payload;
    },
    [RECORD_FILLTABLE](state, payload){
        state.recordTable.fillTable = payload;
    },
    [RECORD_SUBMITDATA](state, payload){
        state.recordTable.submitData = payload;
    },
    [RECORD_CLENTDATE](state, payload){
        state.recordTable.clientData = payload;
    }

}
