<template>
    <span id="organizedCascader">
    <el-cascader
            ref="cascader"
            expand-trigger="hover"
            :options="options"
            :props="props"
            :clearable="true"
            :show-all-levels="true"
            placeholder="请选择党支部"
            filterable
            v-model="selectValue"
            @change="cascaderChange">
    </el-cascader>
        <!--<small class="organizedName">{{label}}</small>-->
        <span v-show="false">{{setDefaultValue}}</span>
    </span>
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
                label:''

            }
        },
        props: {
            cascderValue: Number
        },
        computed: {
            setDefaultValue() {
                if (this.cascderValue != undefined && this.cascderValue != 0) {
                    let temp = this.cascderValue;
                    let vArr = [];
                    let arr = this.$store.state.organized.cascader_data;
                    if (arr.length == 1) {
                        if (arr[0].children == undefined) {
                            vArr.push(temp)
                        } else {
                            vArr.push(arr[0].id);
                            vArr.push(temp)
                        }
                    } else {
                        arr.forEach(value => {
                            if (value.children.length > 0) {
                                value.children.forEach(v => {
                                    if (v.id == temp) {
                                        vArr.push(value.id);
                                        vArr.push(temp);
                                        return;
                                    }
                                })
                            }
                        });
                    }
                    this.selectValue = vArr;
                }
            }
        },
        methods: {
            cascaderChange(call) {
                let $ = this.$jquery;
                this.$nextTick(_=>{
                    let label = $('#organizedCascader .el-cascader__label').text().replaceAll(/\s+/g, "");
                    this.label = label;
                    this.$emit('cascaderChange', call,label);
                })
                //this.$emit('cascaderChange', call,)
            },

        },
        mounted() {
            if (this.$store.state.organized.cascader_data.length > 0) {
                this.options = this.$store.state.organized.cascader_data;
                return;
            }
            let $ = this.$jquery;
            let cascaderDom = this.$refs.cascader.$el;
            let boxW = $(cascaderDom).width();
            $(cascaderDom).click(_ => {
                $('.el-cascader-menus:first .el-cascader-menu__item').css({minWidth: boxW + 'px'})
            })
            this.$ajax.post('/department/dept_list_to_tree', {}).then(res => {
                let groupArr = [];
                if (res.data.errno == 0) {

                    if (res.data.data.length == 1 && res.data.data[0].id != 1) {
                        if (res.data.data[0].children == undefined) {
                            this.options = res.data.data;
                            this.$store.commit('ORGANIZED_CASCADER_DATA', res.data.data);
                            return;
                        }
                        let parent = res.data.data[0];
                        let json = {};
                        json.label = parent.dept_name;
                        json.value = parent.id;
                        groupArr.push(json);
                        this.options = res.data.data;
                        this.$store.commit('ORGANIZED_CASCADER_DATA', res.data.data);
                    } else {
                        res.data.data[0].children.forEach(value => {
                            let json = {};
                            json.label = value.dept_name;
                            json.value = Number(value.id);
                            groupArr.push(json);
                        });

                        this.options = res.data.data[0].children;
                        this.$store.commit('ORGANIZED_CASCADER_DATA', res.data.data[0].children);
                    }
                    this.$store.commit('ORGANIZED_PARTY', groupArr);
                    return;
                }
                this.$message({message: '数据获取失败,请重试111', type: 'error'})
                console.log('res------', res.data)
            }).catch(err => {
                this.$message({message: '数据获取失败,请重试222', type: 'error'})
                console.log('err------', err)
            })
        }
    }

    function ClearBr(key) {
        key = key.replace(/<\/?.+?>/g,"");
        key = key.replace(/[\r\n]/g, "");
        return key;
    }
</script>
<style lang="less">
    div.el-cascader-menu {
        left: 0px;
    }

</style>