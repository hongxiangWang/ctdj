<template>
    <div>
        <cell ref="cellArr"
              v-for="ce in cellDate"
              :cell="ce"
              :key="ce.text"
              :editMode="true"
              @edit ="edit"
              @adjustHeight="adjustHeight">
        </cell>
    </div>
</template>

<script>
    import cell from './cell.vue'

    export default {
        data() {
            return {
                cellDate: [{
                    label: "1111",
                    type: "text",
                    value: 'sdadasd'
                }, {
                    label: "1111",
                    type: "text",
                    value: 'sdadasd'
                }, {
                    label: "1111",
                    type: "text",
                    value: '啊速度快会撒娇等哈数据库框架好看教案十大看哈三德科技安徽的卡萨丁和空间撒谎的卡萨科技哈可点击哈萨克几点后撒科技爱好的空间爱仕达'
                }, {
                    label: "1111",
                    type: "file",
                    value: '请问'
                },
                    {
                        label: "1111",
                        type: "text",
                        value: '啊速度快会撒娇等哈数啊速度快会撒娇等哈数据库框架好看教案十大看哈三德科技安徽的卡萨丁和空间撒谎的卡萨科技哈可点击哈萨克几点后撒科技爱好的空间爱仕达据库框架好看教案十大看哈三德科技安徽的卡萨丁和空间撒谎的卡萨科技哈可点击哈萨克几点后撒科技爱好的空间爱仕达'
                    },
                    {
                        label: "1111",
                        type: "text",
                        value: 'sdadasd'
                    }, {
                        label: "1111",
                        type: "text",
                        value: 'sdadasd'
                    },
                    {
                        label: "1111",
                        type: "file",
                        value: 'sdadasd'
                    }]
            }
        },
        components: {
            cell
        },
        methods: {
            //调节后一个cell的高度，勿动
            adjustHeight(index, h) {
                let $ = this.$jquery;
                if (index % 2 == 0 && index < this.$refs.cellArr.length - 1) {
                    let cellArr = this.$refs.cellArr;
                    let nextCellDom = cellArr[index + 1].$el;
                    $(nextCellDom).find('.el-row').css({height: h + 'px', lineHeight: h + 'px'})
                }
            },

            edit(cell){
                console.log('cell---',cell)
            }
        }
    }
</script>