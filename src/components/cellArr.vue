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
            return {}
        },
        props:{
            cellDate:Array,
            editMode:Boolean,
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
                this.$emit('edit',cell);
            }
        }
    }
</script>