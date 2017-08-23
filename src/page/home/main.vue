<template>
       <el-row>
           <el-col :span="16">
               <div>
                   <label >通知广告/学习任务</label>
                   <el-select v-model="type" placeholder="请选择">
                       <el-option
                               label="通知广告/学习任务"
                               value="3">
                       </el-option>
                       <el-option
                               label="通知公告"
                               value="1">
                       </el-option>
                       <el-option
                               label="学习任务"
                               value="2">
                       </el-option>
                   </el-select>
                   <el-button type="text" class="more">更多</el-button>
               </div>

               <list :dataArray="list"
                     @liClick="liClick">
               </list>

               <el-pagination
                       style="text-align: center"
                       small
                       layout="prev, pager, next"
                       :total="50">
               </el-pagination>
           </el-col>

           <el-col :span="8">
               <!--<meun-left></meun-left>-->
           </el-col>
       </el-row>
    </div>
</template>
<script>
    import meunLeft from './meunLeft.vue';
    import '../../assets/elCss/pagination.css'
    import list from '../../components/list.vue'
    export default {
        data(){
            return {
                list:[{title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求,两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求，关于开什么什么的会谈',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求,两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},
                    {title:'两学一做的任务要求',time:'2017-08-04',type:'1'},],
                type:''
            }
        },
        methods:{
            liClick(li){

            }
        },
        components:{
            meunLeft,list
        }
    }
</script>
<style lang="less" scoped>
        @color:#E64A19;
        label{
            color: @color;
            padding-left: 1rem;
        }
    .more{
       color: fade(@color,60%);
        float: right;
        padding-right: 2rem;
        font-size: .9rem;
    }
</style>
