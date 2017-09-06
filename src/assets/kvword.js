const people = [
    {type_name: '党员类型', type: 'select'},
    {people_name: '姓名', type: 'input'},
    {people_gender: "性别", type: 'select'},
    {people_race: "族别", type: 'select'},
    {people_birthday: "出生日期", type: 'date'},
    {people_residence: "籍贯", type: 'select'},
    {people_culture: "学历", type: 'select'},
    {people_enter_party_time: "入党时间", type: 'date'},
    {people_enter_work_time: "工作时间", type: 'date'},
    {people_jobname: "现任职务", type: 'input'},
    {depart_id: "党支部", type: 'cascader'},
]
import {nation, province, city} from './staticData'

const selectArr = {
    type_name: [{label: '普通党员', value: '2'}, {label: '支部书记', value: '1'}],
    people_race: nation,
    people_gender: [{label: '男', value: '男'}, {label: '女', value: '女'}],
    people_residence: province,
    people_culture: [{label: '高中及以下', value: '高中及以下'}, {label: '本科', value: '本科'}, {label: '硕士', value: '硕士'}, {label: '博士及以上', value: '博士及以上'}],
    dept_type: [{label: '党支部', value: 1}, {label: '党群', value: 2}],
    dept_status: [{label: '有效', value: 1}, {label: '无效', value: 0}],
    record_type: [{label: '每周一学习', value: 1}, {label: '三会一课', value: 2}, {label: '新三会一课', value: 3}, {label: '主题党日', value: 4}, {label: '支局文化建设', value: 5}, {label: '其他', value: 6}],
    prov_latn_id:[
        {value:'99999',label:'区公司'},
        {value:'86991',label:'乌鲁木齐'},
        {value:'86992',label:'奎屯'},
        {value:'86993',label:'石河子'},
        {value:'86994',label:'昌吉'},
        {value:'86995',label:'吐鲁番'},
        {value:'86996',label:'巴州'},
        {value:'86997',label:'阿克苏'},
        {value:'86998',label:'喀什'},
        {value:'86999',label:'伊犁'},
        {value:'86991',label:'乌鲁木齐'},
        {value:'86901',label:'塔城'},
        {value:'86902',label:'哈密'},
        {value:'86903',label:'和田'},
        {value:'86906',label:'阿勒泰'},
        {value:'86908',label:'克州'},
        {value:'86909',label:'博州'},
        {value:'86990',label:'克拉玛依'},
    ]
}

const peopleQuerySelect = [
    {label: '普通党员', value: 2}, {label: '支部书记', value: 1}, {label: '姓名查询', value: 3}
]

const cascaderArr = {
    prov_latn_id: dealCity(city),
    depart_id: [],
}
const cascaderProps = {
    prov_latn_id: {
        label: 'label',
        value: 'label',
        children: 'children'
    },
    depart_id: {
        label: "dept_name",
        value: "id",
        children: "children"
    }
}

const deptment = [
    {dept_type: '组织类型', type: 'select'},
    {dept_name: '名称', type: 'input'},
    {prov_latn_id: '本地网', type: 'select'},
    {dept_status: '有效/无效', type: 'select'},
]

const plan = [
    {activity_name: '名称', type: 'input'},
    {activity_content: '内容', type: 'input'},
    {activity_memo: '备注', type: 'input'},
    {dept_name: '党支部', type: 'text'},
    {yearMonth: '年/月', type: 'date'},
    {week: '周', type: 'date'},
]

const record = [
    {record_type: '活动类型', type: 'select'},
    {dept_name: '党支部', type: 'text'},
    {record_title: '名称', type: 'input'},
    {record_subtitle: '主题', type: 'input'},
    {record_content: '内容', type: 'input'},
    {activity_start_time: '开始时间', type: 'date'},
    {activity_end_time: '结束时间', type: 'select'},
    {activity_place: '地点', type: 'input'},
    {file_id_list: '附件', type: 'file'},
    {attend_people_name: '参与党员', type: 'text'},
]
export {
    people, selectArr, deptment, cascaderArr, cascaderProps, peopleQuerySelect, plan, record
}

function dealCity(arr) {
    arr.forEach(value => {
        value.value = value.label;
        value.children.forEach(v => {
            v.value = v.label;
        })
    })
    return arr;
}