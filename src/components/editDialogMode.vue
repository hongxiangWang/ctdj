<template>

    <div>

        <el-button @click="btClick">{{btTips}}</el-button>
        <edit-dialog
                :cell="cell"
                :editDialog="dialogVisible"
                @closeDia="closeDia"
                @sureEdit="sureEdit">
        </edit-dialog>

        {{cell}}


    </div>

</template>

<script>
    import editDialog from './editDialog.vue'

    export default {
        data() {
            return {
                dialogVisible: false,
                btTips: '打开',
//                cell: {
//                    "label": "出生日期",
//                    "value": "1",
//                    "type": "text",
//                    "key": "people_birthday",
//                    "oType": "text"
//                },
                cell:{
                    "label": "党员类型",
                    "value": "普通党员",
                    "type": "text",
                    "key": "type_name",
                    "oType": "select",
                    "tableIndex": 2
                }
            }
        },
        methods: {
            handleClose() {
                this.dialogVisible = false;
            },
            btClick() {
                this.dialogVisible = !this.dialogVisible;
                this.btTips = this.dialogVisible ? '关闭' : '打开';
            },
            closeDia() {
                this.dialogVisible = false;
                this.btTips = this.dialogVisible ? '关闭' : '打开';
            },
            sureEdit(form,cell){
                console.log('form---',form)
                this.cell.value = form.value;
                this.dialogVisible = false;
                this.btTips = this.dialogVisible ? '关闭' : '打开';
            }
        },
        components: {
            editDialog
        }
    }


</script>