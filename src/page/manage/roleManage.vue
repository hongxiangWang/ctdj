<template>
  <div id="roleManage">
    <div id="roleManageTop" @keyup.enter="key">
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入ID或者角色名进行筛选"
            icon="delete"
            v-model="input"
            :on-icon-click="handleIconClick" @change="inputChange"></el-input>
        </el-col>
        <el-col :span="16" :push="2">
          <!--<el-button type="primary" icon="search">搜索</el-button>-->
          <el-button type="primary" icon="plus" @click="dialogFormVisible = true">添加</el-button>
          <!--<el-button type="primary" icon="upload2">导出</el-button>-->
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="label"
        label="角色名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="120">
      </el-table-column>
      <el-table-column
        prop="role_code"
        label="角色编码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="620">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template scope="scope">
          <el-button
            @click.native.prevent="edit(scope.$index, tableData)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny" @close='dialogClose'>
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="form.remarks" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let axajData = [];
  export default {
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: '80px',
        dialogTitle: '新增角色',
        rowEditIndex: -1,
        input: '',
        form: {
          name: '',
          remarks: ''
        }
      }
    },
    methods: {
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(this, rows, index);
        }).catch(() => {
          console.log(JSON.stringify('sssss'))
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      edit(index, data){
        this.rowEditIndex = index;
        this.dialogTitle = '修改角色信息';
        this.form.name = data[index].label;
        this.form.remarks = data[index].remark;
        this.dialogFormVisible = true;
      },
      dialogClose(){
        this.form.name = '';
        this.form.remarks = ''
        this.dialogTitle = '新增角色';
        this.rowEditIndex = -1;
      },
      save(call){
        this.rowEditIndex != -1 ? editSave(this) : addRole(this);
        this.dialogFormVisible = false;
      },
      handleIconClick(ev) {
        this.input = ''
        this.tableData = axajData
        this.dialogTableVisible = false;
      },
      inputChange(call){
        if (call.length <= 0) {
          this.tableData = axajData;
        } else {
          this.tableData = axajData.filter(function (element, index, self) {
            return element.id == call || element.label.indexOf(call) >= 0;
          })
        }
        this.dialogTableVisible = false;
      }
    },
    components: {},
    mounted(){
      this.$ajax.post('/role/rolelist').then(response => {
        this.tableData = response.data.data;
        axajData = response.data.data;
      }).catch(error => {
        this.$message({message: '获取信息失败' + error.message, type: 'error'})
        let v = {name: 'test2', remarks: '测试4'}
      })
    }
  }

  function editSave(vm) {
    vm.tableData[vm.rowEditIndex].label = vm.form.name;
    vm.tableData[vm.rowEditIndex].remark = vm.form.remarks;
    let newItem = {
      roledata: {
        name: vm.form.name,
        remark: vm.form.remarks
      },
      role_code:vm.tableData[vm.rowEditIndex].role_code
    }
    vm.$ajax.post('/role/updateroleinfo', newItem)
      .then(response => {
        console.log(JSON.stringify(response.data))
      }).catch(error => {
      console.log(JSON.stringify(error.message))
    })
  }

  function addRole(vm) {
    let params = {
      roledata: {
        name: vm.form.name,
        remark: vm.form.remarks
      }
    }
    let newItem ={};
    newItem.label = vm.form.name;
    newItem.remark = vm.form.remarks;
    vm.$ajax.post('/role/addrole', params)
      .then(response => {
        console.log(JSON.stringify(response.data))
        if(Number(response.data.data.flg)===0){
          newItem = response.data.data.data;
          newItem.label = newItem.name
          vm.tableData.push(newItem);
          vm.$message({message:'添加角色成功',type:'success'})
        }else{
          vm.$message({message:'添加角色失败'+response.data.data.msg,type:'error'})
        }
        //
      }).catch(error => {
      console.log(JSON.stringify(error.message))
    })
  }


  function deleteRole(vm, rows, index) {
   // console.log(JSON.stringify(response.data))
    vm.$ajax.post('/role/deleterole', {role_code: rows[index].role_code}).
    then(response => {
      console.log(JSON.stringify(response.data))
      if (Number(response.data.data.flg) == 0) {
        rows.splice(index, 1);
        vm.$message({
          type: 'success',
          message: '删除成功'
        });
      }
    }).catch(error => {
      console.log(JSON.stringify(error.message))
    })
  }
</script>
<style lang="less">

</style>
