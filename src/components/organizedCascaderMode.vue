<template>
    <organized-cascader
            @cascaderChange="cascaderChange">
    </organized-cascader>
</template>
<script>
    import organizedCascader from './organizedCascader.vue'
    export default {
        data() {
            return {
                msg: 'Hello world!'
            }
        },
        methods:{
            cascaderChange(call){
                console.log(call)
            }
        },
        components:{
            organizedCascader
        }
    }
</script>