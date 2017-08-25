<template>
    <div>
        <label>打个分数：</label>
        <el-rate
                v-model="rate.grades"
                class="fa"
                :show-text="true"
                :icon-classes="['fa-frown-o', 'fa-meh-o', 'fa-smile-o']"
                void-icon-class="fa-meh-o"
                :colors="['#99A9BF', '#F7BA2A', '#FFAB91']"
                @change="rateChange">
        </el-rate>
        <br>
        <br>
        <label>评语:</label>
        <el-input type="textarea" v-model="rate.desc"></el-input>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                grades:3,
                desc:''
            }
        },
        methods:{
            rateChange(call){
                console.log(call)
            }
        },
        props:{
            rate:{}
        }
    }
</script>
<style lang="less">
    .el-rate i{
        font-style:normal;
        font-size: 1.5rem;
        margin-right: 10px;
    }
</style>