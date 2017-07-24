import App from '../App.vue'
//const login = r => require.ensure([], () => r(require('../page/login/index.vue')), 'login');
export default [{
    path: '/',
    component: App,
    children: [{
        path: '/',
        // 使用vue-route + Webpack 的 code splitting feature 把组件按组分块
       // component: login
    },
    ]
}
]
