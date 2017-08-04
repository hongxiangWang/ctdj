<template>
    <div style="padding: 0 20px">


        <el-row>
            <el-col :span="14">
                <label>选择党支部</label>
                <el-cascader
                        ref="cascader"
                        expand-trigger="hover"
                        :options="options"
                        :props="props"
                        v-model="selectValue"
                        @change="cascaderChange">
                </el-cascader>
                <span style="color: #F4511E">{{selcectTitle}}</span>
            </el-col>
            <el-col :span="10" >
                <el-row type="flex" justify="end">
                    <el-col :span="8">
                        <el-input
                                placeholder="请选择日期"
                                icon="search"
                                v-model="input"
                                :on-icon-click="handleIconClick">
                        </el-input>
                    </el-col>

                    <el-col :span="16" :offset="1">
                        <el-button icon="edit" >修改</el-button>
                        <el-button  icon="plus" >增加</el-button>
                        <el-button  icon="delete2" >删除</el-button>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>

        <br>
        <br>
        <cell-arr
                :cellDate="cellDate"
                :editMode="false"></cell-arr>
    </div>
</template>
<script>
    import cellArr from '../../components/cellArr.vue'

    const helper = require('../../tools/helper.js');
    import {deptment, selectArr} from '../../assets/kvword.js';

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
                cellDate: [],
                selcectTitle: '',
                input:''
            }
        },
        methods: {
            cascaderChange(call) {
                let title = ''
                this.options.forEach(value => {
                    if (value.id == call[0]) {
                        title = value.label;
                        value.children.forEach(v => {
                            if (v.id == call[1]) {
                                title += '/' + v.label;
                                this.selcectTitle = title;
                            }
                        })
                    }
                })
                this.$jquery(this.$refs.cascader.$el).find('.el-cascader__label').html()
                this.$ajax.post('/department/searchdeptbyId', {dept_id: call[1]}).then(res => {
                    let arr = helper.createTableArr(deptment, res.data.data[0]);
                    arr.forEach(value => {
                        value.oType = value.type;
                        value.type = value.type != 'file' ? 'text' : 'file';
                        helper.selectDataShow(['dept_status', 'dept_type'], selectArr, value)
                    })
                    this.cellDate = arr;
                }).catch(err => {
                    console.log('res------', err)
                })
            },
            handleIconClick(){

            }
        },
        components: {
            cellArr
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
                    return;
                }
                this.$message({message: '数据获取失败,请重试', type: 'error'})
            }).catch(err => {
                this.$message({message: '数据获取失败,请重试', type: 'error'})
                console.log('res------', res.data)
            })
        }

    }


    //select数据处理
    function selectDataShow(selectProps, cell) {
        selectProps.forEach(v => {
            if (cell.key == v) {
                selectArr[v].forEach(value => {
                    if (value.value == cell.value) {
                        cell.value = value.label;
                    }
                });
            }
        })
    }
</script>