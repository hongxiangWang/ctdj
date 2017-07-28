<template>
    <div class="cell" ref="cell">
        <el-row :gutter="0">
            <el-col :span="6" class="label"><span style="display: block" @click="edit" >{{cell.label}}</span></el-col>
            <el-col :span="18" class="value">
                <span v-if="cell.type == 'text'">{{cell.value}}</span>
                <span v-if="cell.type == 'file'">
                        <el-button ref="fileBtn" type="text" @click="fileClick">{{cell.value}}</el-button>
                        <el-popover
                                ref="popover"
                                class="popover"
                                v-model="filePopover"
                                placement="bottom"
                                width="200"
                                title="标题">
                             <p>这是一段内容这是一段内容确定删除吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="filePopover = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="filePopover = false">确定</el-button>
                            </div>
                        </el-popover>
                </span>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                filePopover: false
            }
        },
        props: {
            cell: {},
            editMode:Boolean
        },
        methods: {
            fileClick() {
                //调整pop位置
                let $ = this.$jquery;
                let popDom = this.$refs.popover.$el;
                let cellDom = this.$refs.cell;
                let labelHeight = $(cellDom).find('.label').height();
                let valueWidth = $(cellDom).find('.value .el-button--text span').width();
                $(popDom).css({top: '-' + (labelHeight / 2 - 12) + 'px', left: '-' + valueWidth + 'px'})
                this.filePopover = true;
            },
            edit(){
                if(this.editMode){
                    this.$emit('edit',this.cell);
                }

            }
        },
        mounted() {
            //调整label height lineheight ,使其垂直居中
            let cellDom = this.$refs.cell;
            let $ = this.$jquery;
            let labelHeight = $(cellDom).find('.label').height();
            let valueheight = $(cellDom).find('.value').height();
            if (labelHeight != valueheight) {
                $(cellDom).find('.el-col.el-col-6').css({height: valueheight + 'px', lineHeight: valueheight + 'px'});
                this.$emit('adjustHeight', $(cellDom).index(), valueheight)
            }

            //
        }
    }
</script>
<style lang="less" scoped>
    .cell {
        width: 49.8%;
        display: inline-block;
        margin: 0;
        border: 1px #ECDBD6 solid;
        margin-left: -1px;
        margin-top: -1px;
        mix-height: 2rem;
        line-height: 32px;
        vertical-align: middle;

    .label {
        border-right: 1px solid #ECDBD6;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
    }

    .value {
        border-left: 1px solid #ECDBD6;
        padding: 0 5px;
        vertical-align: middle;
        margin-left: -1px;
    }

    .el-dialog {
        box-shadow: 0 0px 10px rgba(0, 0, 0, .3);;
    }

    .el-button {
        padding: 2px;
    }

    }
    .popover {
        line-height: 1rem;
        position: relative;
    }

</style>