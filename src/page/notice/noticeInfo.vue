<template>
    <div>
        <el-row>
            <el-col :span="18" style="border:1px #ccc solid;padding: 1rem 2rem; margin-left: 1rem">
                <h2 style="text-align: center">{{oData.title}}</h2>
                <div v-html="oData.content" class="ql-editor"></div>
                <br>
                <label v-if="file_list.length>0">附件：</label>
                <div>
                    <el-button
                            v-for="item in file_list"
                            :key="item.name"
                            type="text"
                            @click="downLoadFile(item)">
                        {{item.name}}
                    </el-button>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    const helper  = require('../../tools/helper')
    export default {
        data() {
            return {
                msg: 'Hello world!',
                oData: {}
            }
        },
        methods:{
            downLoadFile(file){

                let httpUri = require('../../value/string.js').fileread+file.uri;
                console.log(httpUri,'frssss---')
                helper.downloadFile(httpUri);
            }
        },
        created() {
            console.log('=======>>=====', this.$route.params.id);
            require('store').get('notice_list').forEach(v => {
                if (v.id == this.$route.params.id) {
                    this.oData = v;
                }
            })
        },
        computed: {
            file_list() {
                let arr = [];
                this.oData.file_id_str.split('|').forEach(value => {
                    if (value != null && value.length > 3) {
                        let json = {
                            name: value.substr(value.indexOf('_') + 1),
                            uri: value
                        }
                        // json.isImg = isImage(json.name);
                        arr.push(json);
                    }
                });
                return arr;
            }
        }
    }
</script>