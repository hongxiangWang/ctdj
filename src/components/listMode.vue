<template>
    <list :dataArray="list"
          @liClick="liClick">
    </list>
</template>
<script>
    import list from './list.vue'

    export default {
        data() {
            return {
                list: [{title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'}]
            }
        },
        methods:{
            liClick(li){

            }
        },
        components:{
            list
        }
    }
</script>