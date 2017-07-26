<template>
  <div>
    <el-dialog title="收货地址" v-model=isShowPop :modal="true">
      <el-table :data=data>
        <el-table-column property="id" label="日期" width="150"></el-table-column>
        <el-table-column property="username" label="姓名" width="200"></el-table-column>
        <el-table-column property="password" label="地址"></el-table-column>
      </el-table>
      <p>{{data}}{{index}}</p>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    name: "popover",
    data() {
      return {};
    }, props: {
      data: Array,
      isShowPop: Boolean,
      index:Number
    },
    computed: {}
  };

</script>
