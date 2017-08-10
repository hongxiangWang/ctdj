<template>
    <div>
       <el-row>
           <el-col :span="4">
            <meun-left></meun-left>
           </el-col>

           <el-col :span="20">
               <router-view ref="main" style="margin-top: 20px;margin-bottom: 20px"></router-view>
           </el-col>
       </el-row>
    </div>
</template>
<script>
    import meunLeft from './meunLeft.vue';
    export default {
        components:{
            meunLeft
        }
    }
</script>
