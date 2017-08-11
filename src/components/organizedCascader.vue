<template>
    <el-cascader
            ref="cascader"
            expand-trigger="hover"
            :options="options"
            :props="props"
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
                console.log('cascaderChange-----',call);
                this.$emit('cascaderChange',call)
            }
        },
        mounted(){
            this.$ajax.post('/department/dept_list_to_tree', {}).then(res => {
                console.log('res------', res.data)
                let groupArr = [];
                if (res.data.errno == 0) {
                    res.data.data[0].children.forEach(value => {
                        let json = {};
                        json.label = value.dept_name;
                        json.value = value.id;
                        groupArr.push(json);
                        value.children.forEach(v => {
                            delete v.children;
                        })
                    })
                    this.$store.commit('ORGANIZED_ARRAY',groupArr);
                    this.options = res.data.data[0].children;
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