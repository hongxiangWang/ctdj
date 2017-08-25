<template>
    <div id="leftMeun">
        <div class="cell" v-for="item in meuns" :key="item.label" @click="cellBtn(item)">
            <button class="button button-box button-giant button-longshadow-left" :class="item.btnBg">
                <i class='fa' :class="item.icon"></i>
            </button>
            <p>{{item.label}}</p>
        </div>
    </div>
</template>
<script>
    import '../../assets/style/buttons.css'
    import '../../assets/style/left-meun.less'

    export default {
        data() {
            return {
                meuns: [

                    {
                        label: '新增活动', icon: 'fa-futbol-o', to: 'recordAdd', btnBg: 'button-action'
                    },
                    {
                        label: '新增计划', icon: 'fa-bookmark', to: 'planAdd', btnBg: 'button-action'
                    },
                    {
                        label: '活动列表', icon: 'fa-list', to: 'recordList', btnBg: 'button-action'
                    },
                    {
                        label: '计划列表', icon: 'fa-list-alt', to: 'planList', btnBg: 'button-action'
                    },
                    {
                        label: '成员管理', icon: 'fa-users', to: 'userManage', btnBg: 'button-highlight'
                    }, {
                        label: '组织信息', icon: 'fa-sitemap', to: 'organizedSet', btnBg: 'button-highlight'
                    }, {
                        label: '权限管理', icon: 'fa-unlock-alt', to: 'permissionSet', btnBg: 'button-highlight'
                    }, {
                        label: '管理员管理', icon: 'fa-user', to: 'adminSet', btnBg: 'button-highlight'
                    }, {
                        label: '角色管理', icon: 'fa-diamond', to: 'roleManage', btnBg: 'button-highlight'
                    }]
            }
        },
        methods: {
            cellBtn(item) {
                this.$router.replace('/home/' + item.to)
            }

        }
    }
</script>

