/**
 * Created by cometlj on 2017/8/3.
 * seperate router
 */
import App from '../App.vue'
const roleManage = r => require.ensure([], () => r(require('../page/manage/roleSet.vue')), 'roleManage');
const home = r => require.ensure([], () => r(require('../page/home/index.vue')), 'home');
export default {
    path: '/',
    component: App,
    children: [
        {
            path: '/home',
            component: home,
            children: [
                {
                    path: 'roleManage',
                    // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
                    component: roleManage
                }
            ]
        }
    ]
}