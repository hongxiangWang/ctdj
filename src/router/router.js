import App from '../App.vue'

const home = r => require.ensure([], () => r(require('../page/home/index.vue')), 'home');
const login = r => require.ensure([], () => r(require('../page/login/index.vue')), 'login');
const userManage = r => require.ensure([], () => r(require('../page/manage/userSet.vue')), 'userManage');
const permissionSet = r => require.ensure([], () => r(require('../page/manage/permissionSetting.vue')), 'permissionSet');

const table1Mode = r => require.ensure([], () => r(require('../components/table1Mode.vue')), 'table1Mode');
const cellMode = r => require.ensure([], () => r(require('../components/cellMode.vue')), 'cellMode');
const editDialogMode = r => require.ensure([], () => r(require('../components/editDialogMode.vue')), 'editDialogMode');
const formMode = r => require.ensure([], () => r(require('../components/formMode.vue')), 'formMode');

export default [{
    path: '/',
    component: App,
    children: [
        {
            path: '/home',
            component: home,
            children: [
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
            ]
        },

        {
            path: '/',
            // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
            component: login
        }
    ]
}
]
