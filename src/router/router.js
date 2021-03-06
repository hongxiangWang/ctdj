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
const listMode = r => require.ensure([], () => r(require('../components/listMode.vue')), 'listMode');
const quillEditer = r => require.ensure([], () => r(require('../components/quillEditer.vue')), 'listMode');
const noticeInfo = r => require.ensure([], () => r(require('../page/notice/noticeInfo.vue')), 'noticeInfo');
const noticeAdd = r => require.ensure([], () => r(require('../page/notice/noticeAdd.vue')), 'noticeAdd');
const noticeList = r => require.ensure([], () => r(require('../page/notice/noticeList.vue')), 'noticeList');
const fengcaiManage  = r => require.ensure([], () => r(require('../page/manage/fengcaiManage.vue')), 'fengcaiManage');
const fengcaiAdd  = r => require.ensure([], () => r(require('../page/manage/fengcaiAdd.vue')), 'fengcaiAdd');
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
                }, {
                    path: 'listMode',
                    component: listMode
                },
                {
                    path: 'quillEditer',
                    component: quillEditer
                },

                // {
                //     path: 'noticeInfo',
                //     name:'noticeInfo',
                //     component: noticeInfo
                // },
                {
                    path: 'noticeInfo/:id',
                    name:'noticeInfo',
                    component: noticeInfo
                },

                {
                    path: 'noticeAdd',
                    component: noticeAdd
                },
                {
                    path: 'noticeList',
                    component: noticeList
                },
                {
                    path: 'fengcaiManage',
                    component: fengcaiManage
                },
                {
                    path: 'fengcaiAdd',
                    component: fengcaiAdd
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
