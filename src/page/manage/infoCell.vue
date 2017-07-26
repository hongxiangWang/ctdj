<template>
    <div id="cell">
        <el-row :gutter="0">
            <el-col :span="8" class="title">
                <span style="display: block" @click="edit">{{title}}<span v-if="isRequiredItem" style="color:#ff7e7e">*</span></span>

            </el-col>
            <el-col :span="16" class="value" v-show="isText">{{dataValue}}</el-col>
            <el-col :span="16" class="value" v-show="isFile">

                <el-button v-for="item,index in realName" type="text" @click="fileCilck(index)">
                    {{item}}
                </el-button>
                <el-popover
                        id="cellFile"
                        placement="bottom"
                        width="260"
                        :visible-arrow="true"
                        v-model="popoverVisible">
                    <p>该文件"{{fileName}}"无法预览，是否下载该文件？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="popoverCancel">取消</el-button>
                        <el-button type="primary" size="mini" @click="popoverDown">确定</el-button>
                    </div>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {switchArr, dateItem, requiredItem} from './searchCon.js'
    export default{
        data(){
            return {
                realName: [],
                realUrl: [],
                dialogImageUrl: '',
                fileName: '',
                popoverVisible: false,
            }
        },
        props: {
            id: Number,
            title: String,
            dataJson: {},
            value: String,
            sonId: Number
        },
        computed: {
            dataValue(){
                let s = this.value;
                return isFile(this.dataJson[s], this);
            },
            isFile(){
                let s = this.dataJson[this.value];
                return s != null && ((s.indexOf("/static/upload/") >= 0) || (s.indexOf("/app/ftp/") >= 0)) ? true : false;

            },
            isText(){
                let s = this.dataJson[this.value];
                return s != null && ((s.indexOf("/static/upload/") >= 0) || (s.indexOf("/app/ftp/") >= 0)) ? false : true;
            },
            isRequiredItem(){
                return requiredItem.indexOf(this.value) >= 0 ? true : false;
            }
        },
        methods: {
            fileCilck(index){
                let u = this.realUrl[index];
                let token = this.$localStore.get('token');
                this.dialogImageUrl = encodeURI(require('../../value/string.js').fileread + u + "&token=" + token);
                console.log(this.dialogImageUrl);
                this.fileName = this.realName[index];
                let ext = this.fileName.substring(this.fileName.indexOf('.'));
                let extArr = ['.jpg', '.png', '.jpeg', '.svg', '.gif', '.ico','.JPG','.PNG'];
                let isExtImage = extArr.findIndex((value) => {
                    return value == ext;
                })
                if (isExtImage >= 0) {
                    let imageData = {
                        isImage: true,
                        fileName: this.fileName,
                        url: this.dialogImageUrl,
                    }
                    this.$emit('cellFileOpen', imageData);
                } else {
                    this.popoverVisible = true;
                }
            },
            popoverCancel(){
                this.popoverVisible = false;
            },
            popoverDown(){
                this.popoverVisible = false;
                downloadFile(this.dialogImageUrl);
                //window.open(uri);
            },
            edit(){
                let cellData = {
                    key: this.value
                }
                if (this.sonId != undefined) {
                    cellData.sonIndex = this.id;
                    cellData.sonId = this.sonId;
                }
                this.$emit('editInfo', cellData)
            }
        }
    }

    function isFile(s, _this) {
        _this.realName = [];
        _this.realUrl = [];
        if (s != null && (s.indexOf("/static/upload/") >= 0 || s.indexOf("/app/ftp/") >= 0)) {
            let arr = s.split('|');
            arr.forEach((value) => {
                if (_this.$jquery.trim(value) != "") {
                    let sub = value.substring(value.indexOf('_') + 1);
                    _this.realName.push(sub);
                    _this.realUrl.push(value.replace('undefined', ''));
                }
            })
        } else {
            isSWitch(s, _this);
            return s;
        }
    }

    function isSWitch(s, _this) {
        let key = _this.value;
        if (switchArr.findIndex((value) => {
                return value == key
            }) >= 0) {
            if (s == '0') {
                return '否'
            }
            if (s == '1') {
                return '是'
            }
        }
    }

    function downloadFile(url) {
        try {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            console.log('----encodeURI-6666--', url)
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        } catch (e) {

        }
    }
</script>
<style lang="less">

</style>
