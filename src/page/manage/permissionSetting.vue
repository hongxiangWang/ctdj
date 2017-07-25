<template>
  <div id="permissionSet">
    <el-row>
      <el-col :span="8" id="meunFunSetLeft">
        <permissionTree></permissionTree>
      </el-col>
      <el-col :span="16">
        <permissionRight></permissionRight>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import permissionTree from './permissionTree.vue'
  import permissionRight from './permissionRight.vue'

  export default{
    name: 'meunFunSet',
    data(){
      return {
        parents: 'ppppp'
      }
    }, components: {
      permissionTree, permissionRight
    },
    computed: {

    }
  }

</script>
