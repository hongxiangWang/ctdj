<template>
    <div>
        <table1
            :operates="operate"
            :tableData="tableData"
            :tdArr="tdArr">
        </table1>

    </div>
</template>
<script>
    import table1 from '../../components/table1.vue'

    export default {
        data() {
            return {
                operate:[],
                tdArr:[],
                tableData:[],
            }
        },
        components: {
            table1
        },
        mounted(){
            this.$ajax.post('/notice/notice_list',{page:1,count:1,type:3}).then(res=>{
                console.log('res------',res.data)
            }).catch(err=>{
                console.log('res------',err.message)
            })
        }
    }
</script>