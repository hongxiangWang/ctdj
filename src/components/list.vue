<template>
    <div id="list-components">
        <el-row v-if="false">
            <el-col :span="2" class="index">
                #
            </el-col>
            <el-col :span="19" class="index">
                标题
            </el-col>
            <el-col :span="3" class="index">
                时间
            </el-col>
        </el-row>
        <hr>
        <ul>
            <li v-for="(li,index) in dataArray">
                <el-row>
                    <el-col :span="2" class="index">
                        {{index+1}}
                    </el-col>
                    <el-col :span="16" class="title">
                        {{li.title}}
                    </el-col>
                    <el-col :span="6" style="text-align: center">
                        {{li.time}}
                    </el-col>
                </el-row>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'Hello world!'
            }
        },
        props: {
            dataArray: Array
        },

    }
</script>
<style lang="less" scoped>
    #list-components {
    @color:#FFAB91;
    hr{
        border-color: fade(@color,30%);
        width: 98%;
       text-align: center;
    }
    ul {
        list-style: none;
        -webkit-padding-start: 0;
        li{
            height: 36px;
            line-height: 36px;

        }
        li:hover{
            color:#FFAB91;
            cursor: pointer;
        }
        li:visited{
            color: desaturate(@color,80%);
        }
    }

    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 10px
    }
    .index{
        text-align: center;
        color:#999
    }

    }
</style>