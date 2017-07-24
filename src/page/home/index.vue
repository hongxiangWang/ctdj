<template>
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
                    中国电信新疆公司
                </header>
            </el-col>
            <el-col :span="16">
                <el-menu style="float: right;" :default-active="activeIndex2" class="el-menu-demo" mode="horizontal"
                         @select="handleSelect">
                    <el-menu-item index="1">首页</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">我的工作台</template>
                            <el-menu-item index="2-1">选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                            <el-menu-item index="2-3">选项3</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3"><span>管理</span>
                    </el-menu-item>

                    <el-submenu index="4">
                        <template slot="title"><span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-yonghu"></use>
                        </svg></span></template>
                        <el-menu-item index="4-1">选项1</el-menu-item>
                        <el-menu-item index="4-2">选项2</el-menu-item>
                        <el-menu-item index="4-3">选项3</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>

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
