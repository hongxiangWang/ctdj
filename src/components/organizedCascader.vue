<template>
    <el-cascader
            ref="cascader"
            expand-trigger="hover"
            :options="options"
            :props="props"
            :clearable="true"
            :show-all-levels="true"
            placeholder="选择党支部"
            v-model="selectValue"
            @change="cascaderChange">
    </el-cascader>
</template>
<script>
    export default {
        data() {
            return {
                options: [],
                selectValue: [],
                props: {
                    label: "dept_name",
                    value: "id",
                    children: "children"
                },

            }
        },
        methods:{
            cascaderChange(call){
                this.$emit('cascaderChange',call)
            },
            cascaderClear(){

            }
        },
        mounted(){
            this.$ajax.post('/department/dept_list_to_tree', {}).then(res => {
                console.log('res------', res.data)
                let groupArr = [];
                if (res.data.errno == 0) {
                    if(res.data.data.length==1 && res.data.data[0].id!=1 ){
                        if(res.data.data[0].children==undefined ){
                            this.options = res.data.data;
                            this.$store.commit('ORGANIZED_CASCADER_DATA',res.data.data);
                            return;
                        }
                        let parent = res.data.data[0];
                        let json = {};
                        json.label = parent.dept_name;
                        json.value = parent.id;
                        groupArr.push(json);
                        this.options = res.data.data;
                        this.$store.commit('ORGANIZED_CASCADER_DATA',res.data.data);
                    }else{
                        res.data.data[0].children.forEach(value => {
                            let json = {};
                            json.label = value.dept_name;
                            json.value = value.id;
                            groupArr.push(json);
                            value.children.forEach(v => {
                                delete v.children;
                            })
                        })
                        this.options = res.data.data[0].children;
                        this.$store.commit('ORGANIZED_CASCADER_DATA',res.data.data[0].children);
                    }
                    this.$store.commit('ORGANIZED_PARTY',groupArr);
                    return;
                }
                this.$message({message: '数据获取失败,请重试', type: 'error'})
            }).catch(err => {
                this.$message({message: '数据获取失败,请重试', type: 'error'})
                console.log('err------', err)
            })
        }
    }
</script>