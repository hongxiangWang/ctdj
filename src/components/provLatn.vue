<template>
    <el-select v-model="prov_latn_select" placeholder="请选择">
        <el-option
                v-for="item in prov_latn_list"
                :key="item.id"
                :label="item.name"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        data () {
            return {
                prov_latn_select:'',
                prov_latn_list:[
                    {id:99999,name:'区公司'},
                    {id:86991,name:'乌鲁木齐'},
                    {id:86992,name:'奎屯'},
                    {id:86993,name:'石河子'},
                    {id:86994,name:'昌吉'},
                    {id:86995,name:'吐鲁番'},
                    {id:86996,name:'巴州'},
                    {id:86997,name:'阿克苏'},
                    {id:86998,name:'喀什'},
                    {id:86999,name:'伊犁'},
                    {id:86991,name:'乌鲁木齐'},
                    {id:86901,name:'塔城'},
                    {id:86902,name:'哈密'},
                    {id:86903,name:'和田'},
                    {id:86906,name:'阿勒泰'},
                    {id:86908,name:'克州'},
                    {id:86909,name:'博州'},
                    {id:86990,name:'克拉玛依'},
                ]
            }
        },
        props:{
            prov_latn_id:String
        }
    }
</script>
<style>

</style>