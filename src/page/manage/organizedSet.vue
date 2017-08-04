<template>
    <div>
        <el-cascader
                expand-trigger="hover"
                :options="options"
                :props="props"
                v-model="selectValue"
                @change="cascaderChange">
        </el-cascader>
        {{selectValue}}
    </div>
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
                }
            }
        },
        methods: {
            cascaderChange(call) {
                console.log('res--5555----', call)
            }
        },
        mounted() {
            this.$ajax.post('/department/getdepttree', {}).then(res => {
                if (res.data.errno == 0) {
                    res.data.data[0].children.forEach(value => {
                        value.children.forEach(v => {
                            delete v.children;
                        })
                    })

                    this.options = res.data.data[0].children;
                    console.log('res------', JSON.stringify(this.options));

                }
            }).catch(err => {
                console.log('res------', res.data)
            })
        }

    }
</script>