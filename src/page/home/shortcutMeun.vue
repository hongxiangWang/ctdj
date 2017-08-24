<template>
    <div id="leftMeun">
        <div class="cell" v-for="item in meuns" :key="item.label">
            <button class="button button-box button-giant button-longshadow-left" :class="item.btnBg" >
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
                meuns: [{
                    label:'成员管理',icon:'fa-users',to:'userSet',btnBg:'button-action'
                },{
                    label:'组织信息',icon:'fa-sitemap',to:'userSet',btnBg:'button-highlight'
                },{
                    label:'成员管理',icon:'fa-users',to:'userSet',btnBg:'button-royal'
                },{
                    label:'成员管理',icon:'fa-users',to:'userSet',btnBg:'button-royal'
                },{
                    label:'成员管理',icon:'fa-users',to:'userSet',btnBg:'button-royal'
                }]
            }
        }
    }
</script>

