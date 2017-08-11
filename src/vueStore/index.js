import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';


Vue.use(Vuex);
const state = {
    permission: {
        treeTile: '',
        chooseTreeNodeRoleCode: -1,
        roleFun:[],
        allFun:[]
    },
    organized:{
        groupArray:[]
    }
};

export default new Vuex.Store({
    state,
    actions,
    mutations
})
