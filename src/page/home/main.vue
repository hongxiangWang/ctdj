<template>
    <el-row type="flex" justify="center">
        <el-col :span="10" class="list">
            <div>
                <label>{{noticelabel}}</label>
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

        <el-col :span="13" >
            <div class="shortcut">
                <label>快捷菜单</label>
                <hr>
                <shortcut-meun>
                </shortcut-meun>
            </div>

            <div class="chart shortcut">
                <label>统计分析</label>
                <hr>
                <chart  :options="polar" theme="macarons" style="margin: 10px auto"></chart>
            </div>
        </el-col>

    </el-row>
    </div>
</template>
<script>
    import shortcutMeun from './shortcutMeun.vue';
    import '../../assets/elCss/pagination.css'
    import list from '../../components/list.vue'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'

    export default {
        data() {
            let data = []

            for (let i = 0; i <= 360; i++) {
                let t = i / 180 * Math.PI
                let r = Math.sin(2 * t) * Math.cos(2 * t)
                data.push([r, i])
            }
            return {
                list: [{title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求,两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求，关于开什么什么的会谈', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求,两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},
                    {title: '两学一做的任务要求', time: '2017-08-04', type: '1'},],
                type: "3",
                noticelabel:'通知广告/学习任务',
                polar: {
                    title: {
                        text: '本地网党组织数量'
                    },
                    tooltip: {},
                    legend: {
                        data:['数量']
                    },
                    xAxis: {
                        data: ["哈密","伊犁","乌鲁木齐","巴州","喀什","石河子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '数量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }],

                }

            }
        },
        methods: {
            liClick(li) {

            }
        },
        components: {
            shortcutMeun, list
        }
    }
</script>
<style lang="less" scoped>
    @color :#E64A19;
    label {
        color: @color;
        padding-left: 1rem;
    }

    .more {
        color: fade(@color, 60%);
        float: right;
        padding-right: 2rem;
        font-size: .9rem;
    }

    .list, .shortcut {
        box-shadow: 0 0 25px rgba(0, 0, 0, .2);
        padding: 1rem 0;
        border: rgba(0, 0, 0, .1) 1px solid;
        border-radius: 8px;
        z-index: 10;

        hr {
            border-color: fade(#FFAB91, 30%);
            width: 98%;
            text-align: center;
        }
    }
    .list{
        height: auto;
    }
    .shortcut{
        margin-left: 1rem;
    }
    .chart{
        margin-top: 20px;
    }
</style>
