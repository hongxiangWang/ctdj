<template>
    <div>
        <form1
        :dataArr="dataArr"
        :selectArr="selectArr"></form1>
    </div>

</template>
<script>
    import form1 from './form.vue'
    import {notEmpty} from '../assets/rules.js'
    import {selectArr} from '../assets/kvword.js'
    export default {
        data() {
            return {
                dataArr: [
                    {
                        label: '姓名',
                        value: 'whx',
                        type: 'input',
                        key:'name',
                        rule: notEmpty
                    },
                    {
                        label: '性别',
                        value: '男',
                        type: 'select',
                        key:'people_gender',
                        rule: notEmpty
                    },
                    {
                        label: '年龄',
                        value: '23',
                        type: 'input',
                        key:'age',
                        rule: notEmpty
                    },
                    {
                        label: '年龄',
                        value: '23',
                        type: 'select',
                        key:'people_race',
                        rule: notEmpty
                    },
                    {
                        label: '时间',
                        value: '1990-03-06',
                        type: 'date',
                        key:'people_birthday',
                        rule: notEmpty
                    }
                ],
                selectArr:selectArr,
            }
        },
        components: {
            form1
        }
    }
</script>