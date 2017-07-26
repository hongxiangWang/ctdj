import App from '../App.vue'
const home = r => require.ensure([], () => r(require('../page/home/index.vue')), 'home');
const userManage = r => require.ensure([], () => r(require('../page/manage/userSet.vue')), 'userManage');
const permissionSet = r => require.ensure([], () => r(require('../page/manage/permissionSetting.vue')), 'permissionSet');
export default [{
    path: '/',
    component: App,
    children: [
        {
        path: '/',
        // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
        component: home,
            children: [
                {
                    path: '/userManage',
                    // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
                    component: userManage
                },
                {
                    path: '/permissionSet',
                    // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
                    component: permissionSet
                },
            ]
         },
    ]
}
]
