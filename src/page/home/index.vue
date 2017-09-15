<template ref="" xmlns:v="http://www.w3.org/1999/html">
    <div>
        <div id="topMeun">
            <el-row id="top">
                <el-col :span="8">
                    <header>
                    <!--<span>-->
                        <!--<svg class="icon" aria-hidden="true">-->
                            <!--<use xlink:href="#icon-dianxin"></use>-->
                        <!--</svg>-->
                    <!--</span>-->
                        <!--<span style="color: #ccc; font-weight: 100">|</span>-->
                        <router-link to="/home/main" style="text-decoration: none;color:#444">
                        <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-party"></use>
                        </svg>
                    </span>
                        中国电信新疆公司数字党建
                        </router-link>
                    </header>
                </el-col>
                <el-col :span="16">
                    <el-menu style="float: right;"
                             class="el-menu-demo"
                             mode="horizontal"
                             @select="handleSelect"
                             default-active="/home/main"
                             :router="true">
                        <el-menu-item index="/home/main">首页</el-menu-item>
                        <el-submenu index="2">
                            <template slot="title">文化建设</template>
                            <el-menu-item index="/home/fengcaiManage">党员风采</el-menu-item>
                            <el-menu-item index="/home/recordAdd">滚动图</el-menu-item>
                        </el-submenu>

                        <el-submenu index="3">
                            <template slot="title">活动/建设</template>
                            <el-menu-item index="/home/recordAdd">新增活动</el-menu-item>
                            <el-menu-item index="/home/recordList">活动列表</el-menu-item>
                            <el-menu-item index="/home/planAdd">新增计划</el-menu-item>
                            <el-menu-item index="/home/planList">计划列表</el-menu-item>

                        </el-submenu>

                        <el-submenu index="4">
                            <template slot="title">管理</template>
                            <el-menu-item index="/home/roleManage" v-if="account.role_id<2">角色管理</el-menu-item>
                            <el-menu-item index="/home/permissionSet" v-if="account.role_id<2">权限管理</el-menu-item>
                            <el-menu-item index="/home/adminSet">管理员管理</el-menu-item>
                            <el-menu-item index="/home/organizedSet">组织管理</el-menu-item>
                            <el-menu-item index="/home/userManage">党员管理</el-menu-item>
                        </el-submenu>

                        <el-submenu index="5" style="padding-right: 50px">
                            <template slot="title"><span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-yonghu"></use>
                        </svg></span>&nbsp;&nbsp;账户</template>
                            <el-menu-item index="#">您好，{{account.people_name}}</el-menu-item>
                            <el-menu-item index="#">角色类型：{{roleType}}</el-menu-item>
                            <el-menu-item index="#" @click="exit">
                                <i class="fa fa-sign-out"></i>退出
                            </el-menu-item>
                        </el-submenu>

                        <el-submenu index="6" v-if="false">
                            <template slot="title">组件测试</template>
                            <el-menu-item index="/home/table1Mode">table1</el-menu-item>
                            <el-menu-item index="/home/cellMode">cellMode</el-menu-item>
                            <el-menu-item index="/home/editDialogMode">editDialogMode</el-menu-item>
                            <el-menu-item index="/home/formMode">formMode</el-menu-item>
                            <el-menu-item index="/home/organizedCascaderMode">organizedCascaderMode</el-menu-item>
                            <el-menu-item index="/home/listMode">listMode</el-menu-item>
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
                account:require('store').get('people_info')[0]
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            exit(){
                this.$confirm('是否退出当前账号['+this.account.username+']?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    require('store').clearAll();
                    this.$router.replace('/')
                }).catch(() => {
                });
            }
        },
        computed:{
            roleType(){
                let roleName=''
                switch(this.account.role_id){
                    case 1:
                        roleName = '一级管理员'
                        break;
                    case 2:
                        roleName = '党群管理员'
                        break;
                    case 3:
                        roleName = '党支部管理员'
                        break;
                    default:
                        roleName = '未知'
                }
                return roleName;
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
            //this.$router.replace('/home/main');
        }
    }

</script>

<style>

</style>
