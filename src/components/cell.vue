<template>
    <div class="cell" ref="cell">
        <el-row :gutter="0">
            <el-col :span="6" class="label"><span style="display: block" @click="edit">{{cell.label}}</span></el-col>
            <el-col :span="18" class="value">
                <span v-if="cell.type == 'text'">{{cell.value}}</span>
                <span v-if="cell.type == 'file'">
                        <el-button ref="fileBtn"
                                   v-for="file in fileArray"
                                   :key="file.name"
                                   type="text"
                                   @click="fileClick(file)">{{file.name}}</el-button>
                        <el-popover
                                ref="popover"
                                class="popover"
                                v-model="filePopover"
                                placement="bottom"
                                width="200"
                                :title="oFile.name">
                             <p>是否下载该文件</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="filePopover = false">算了</el-button>
                                <el-button type="primary" size="mini" @click="downloadFile">是的</el-button>
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
                filePopover: false,
                imageVisible:false,
                oFile:{}

            }
        },
        props: {
            cell: {},
            editMode: Boolean
        },
        methods: {
            fileClick(file) {
                //调整pop位置
                let $ = this.$jquery;
                let popDom = this.$refs.popover.$el;
                let cellDom = this.$refs.cell;
                let labelHeight = $(cellDom).find('.label').height();
                let valueWidth = $(cellDom).find('.value .el-button--text span').width();
                $(popDom).css({top: '-' + (labelHeight / 2 - 12) + 'px', left: '-' + valueWidth + 'px'})
                if(file.isImg){
                    this.$emit('imageDialog',file)
                }else{
                    this.filePopover = true;
                }
                this.oFile =file;
            },
            edit() {
                if (this.editMode) {
                    this.$emit('edit', this.cell);
                }
            },
            downloadFile(){
                let httpUri = require('../value/string.js').fileread+this.oFile.uri;
                require('../tools/helper').downloadFile(httpUri);
            }
        },
        computed: {
            fileArray() {
                let arr = [];
                console.log('cell.value----',this.cell.value);
                this.cell.value.split('|').forEach(value => {
                    if (value != null && value.length>3) {
                        let json = {
                            name: value.substr(value.indexOf('_') + 1),
                            uri: value
                        }
                        json.isImg = isImage(json.name);
                        arr.push(json);
                    }
                });
                return arr;
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
        }
    }

    function isImage(name) {
        let ext = name.substr(name.indexOf('.'));
        let extArr = ['.jpg', '.png', '.jpeg', '.svg', '.gif', '.ico','.JPG','.PNG'];
        let isExtImage = extArr.findIndex((value) => {
            return value == ext;
        })
        if(isExtImage>=0){
            return true;
        }else {
            return false;
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
        min-height:32px;
    .el-row,.el-col,.label{
        min-height:32px;
    }

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