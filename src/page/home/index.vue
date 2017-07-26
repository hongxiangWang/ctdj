<template>
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
                        中国电信新疆公司党建
                    </header>
                </el-col>
                <el-col :span="16">
                    <el-menu style="float: right;"
                             class="el-menu-demo"
                             mode="horizontal"
                             @select="handleSelect"
                             :router="true">
                        <el-menu-item index="/">首页</el-menu-item>

                        <el-submenu index="2">
                            <template slot="title">活动/建设</template>
                            <el-menu-item index="userManage">上传</el-menu-item>
                            <el-menu-item index="permissionSet">检查</el-menu-item>
                        </el-submenu>

                        <el-submenu index="3">
                            <template slot="title">管理</template>
                            <el-menu-item index="userManage">用户管理</el-menu-item>
                            <el-menu-item index="permissionSet">角色管理</el-menu-item>
                            <el-menu-item index="2-3">权限管理</el-menu-item>
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
                    </el-menu>
                </el-col>
            </el-row>

            <router-view ref="main"></router-view>

        </div>
        <div id="bottom">
            <small><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-banquan"></use>
                        </svg> &nbsp;&nbsp;中国电信新疆公司企业信息化部自主研发</small>
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
                activeIndex2: '1'
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }

</script>

<style>

</style>
