import App from '../App.vue'

const home = r => require.ensure([], () => r(require('../page/home/index.vue')), 'home');
const main = r => require.ensure([], () => r(require('../page/home/main.vue')), 'main');
const login = r => require.ensure([], () => r(require('../page/login/index.vue')), 'login');
const userManage = r => require.ensure([], () => r(require('../page/manage/userSet.vue')), 'userManage');
const permissionSet = r => require.ensure([], () => r(require('../page/manage/permissionSetting.vue')), 'permissionSet');
const organizedSet = r => require.ensure([], () => r(require('../page/manage/organizedSet.vue')), 'organizedSet');
const recordAdd = r => require.ensure([], () => r(require('../page/activity/recordAdd.vue')), 'recordAdd');
const planAdd = r => require.ensure([], () => r(require('../page/activity/planAdd.vue')), 'planAdd');
const recordList = r => require.ensure([], () => r(require('../page/activity/recordList.vue')), 'recordList');
const planList = r => require.ensure([], () => r(require('../page/activity/planList.vue')), 'planList');

const table1Mode = r => require.ensure([], () => r(require('../components/table1Mode.vue')), 'table1Mode');
const cellMode = r => require.ensure([], () => r(require('../components/cellMode.vue')), 'cellMode');
const editDialogMode = r => require.ensure([], () => r(require('../components/editDialogMode.vue')), 'editDialogMode');
const formMode = r => require.ensure([], () => r(require('../components/formMode.vue')), 'formMode');
const organizedCascaderMode = r => require.ensure([], () => r(require('../components/organizedCascaderMode.vue')), 'organizedCascaderMode');

export default {
    path: '/',
    component: App,
    children: [
        {
            path: '/home',
            component: home,
            children: [
                {
                    path: 'main',
                    // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
                    component: main
                },
                {
                    path: 'userManage',
                    // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
                    component: userManage
                },
                {
                    path: 'permissionSet',
                    component: permissionSet
                },
                {
                    path: 'organizedSet',
                    component: organizedSet
                },
                {
                    path: 'recordAdd',
                    component: recordAdd
                },
                {
                    path: 'recordList',
                    component: recordList
                },
                {
                    path: 'planAdd',
                    component: planAdd
                },
                {
                    path: 'planList',
                    component: planList
                },
                {
                    path: 'table1Mode',
                    component: table1Mode
                },
                {
                    path: 'cellMode',
                    component: cellMode
                },
                {
                    path: 'editDialogMode',
                    component: editDialogMode
                },
                {
                    path: 'formMode',
                    component: formMode
                },
                {
                    path: 'organizedCascaderMode',
                    component: organizedCascaderMode
                },
            ]
        },

        {
            path: '/',
            // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
            component: login
        }
    ]
}
