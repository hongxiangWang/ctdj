<template ref="">
    <div>
        <div id="topMeun">
            <el-row id="top">
                <el-col :span="8">
                    <header>
                    <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-dianxin"></use>
                        </svg>
                    </span>
                        <span style="color: #ccc; font-weight: 100">|</span>
                        <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-party"></use>
                        </svg>
                    </span>
                        中国电信新疆公司党建LOGO {{}}
                    </header>
                </el-col>
                <el-col :span="16">
                    <el-menu style="float: right;"
                             class="el-menu-demo"
                             mode="horizontal"
                             @select="handleSelect"
                             :router="true">
                        <el-menu-item index="/home/main">首页</el-menu-item>

                        <el-submenu index="2">
                            <template slot="title">活动/建设</template>
                            <el-menu-item index="2-1">上传</el-menu-item>
                            <el-menu-item index="2-2">检查</el-menu-item>
                        </el-submenu>

                        <el-submenu index="3">
                            <template slot="title">管理</template>
                            <el-menu-item index="/home/roleManage">角色管理</el-menu-item>
                            <el-menu-item index="/home/permissionSet">权限管理</el-menu-item>

                            <el-menu-item index="/home/organizedSet">组织管理</el-menu-item>
                            <el-menu-item index="/home/userManage">成员管理</el-menu-item>
                        </el-submenu>

                        <el-submenu index="4">
                            <template slot="title"><span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-yonghu"></use>
                        </svg></span></template>
                            <el-menu-item index="4-1">账户：王洪翔6</el-menu-item>
                            <el-menu-item index="4-2">账户：王洪翔6</el-menu-item>
                            <el-menu-item index="4-3">账户：王洪翔6</el-menu-item>
                        </el-submenu>

                        <el-submenu index="5">
                            <template slot="title">组件测试</template>
                            <el-menu-item index="/home/table1Mode">table1</el-menu-item>
                            <el-menu-item index="/home/cellMode">cellMode</el-menu-item>
                            <el-menu-item index="/home/editDialogMode">editDialogMode</el-menu-item>
                            <el-menu-item index="/home/formMode">formMode</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-row>

            <router-view ref="main" style="margin-top: 20px;margin-bottom: 20px"></router-view>

        </div>
        <div id="bottom">
            <small>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-banquan"></use>
                </svg> &nbsp;&nbsp;中国电信新疆公司企业信息化部自主研发
            </small>
        </div>
    </div>
</template>

<script>
    import '../../assets/elCss/menu.css'
    import '../../assets/style/app.less'
    import '../../assets/style/home.less'

    export default {
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',

            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        created() {
            let vm = this;
             this.$ajax.interceptors.request.use(function (config) {
                //在请求发出之前进行一些操作
                let token = vm.$localStore.get('token');
                if (token) {
                    config.headers.token = token;
                }
                return config;
            }, function (err) {
                //Do something with request error
                return Promise.reject(err);
            });

            this.$ajax.interceptors.response.use(function (res) {
                //在这里对返回的数据进行处理
                if (Number(res.data.errno) == 1000) {
                    vm.$router.replace('/')
                    return;
                }
                return res;
            }, function (err) {
                //Do something with response error
                return Promise.reject(err);
            })
        },
        mounted(){
           // this.$router.replace('/home/main');
        }
    }

</script>

<style>

</style>
