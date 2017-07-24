import App from '../App.vue'
const home = r => require.ensure([], () => r(require('../page/home/index.vue')), 'home');
export default [{
    path: '/',
    component: App,
    children: [{
        path: '/',
        // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
        component: home
    },
    ]
}
]
