<template>
  <div id="meunFunSet">
    <el-row>
      <el-col :span="4">
      </el-col>
      <el-col :span="16" :push="4" >
        <h3>配置菜单是否显示
          <el-button type="primary" :disabled="isDisabledSaveButton()" @click="save">保存</el-button>
        </h3>
        <hr>
        <div class="choose-item">
          <label>一、录入文档</label>
          <el-switch
            v-model="showRecord"
            on-text="显示"
            off-text="隐藏"
            :width=60
            @change="switchChange" >
          </el-switch>
          <el-checkbox-group v-model="checkList" v-show="recordOpen" @change="recordChange">
            <el-checkbox label="复选框 1-1"></el-checkbox>
            <el-checkbox label="复选框 1-2"></el-checkbox>
            <el-checkbox label="复选框 1-3"></el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="choose-item">
          <label>二、查&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;询</label>
          <el-switch
            v-model="showSearch"
            on-text="显示"
            off-text="隐藏"
            :width=60
            @change="switchChange">
          </el-switch>
          <el-checkbox-group v-model="checkList" v-show="searchOpen" @change="recordChange">
            <el-checkbox label="复选框 2-1"></el-checkbox>
            <el-checkbox label="复选框 2-2"></el-checkbox>
            <el-checkbox label="复选框 2-3"></el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="choose-item">
          <label>三、审&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;批</label>
          <el-switch
            v-model="showApprove"
            on-text="显示"
            off-text="隐藏"
            :width=60
            @change="switchChange">
          </el-switch>
          <el-checkbox-group v-model="checkList" v-show="approveOpen" @change="recordChange">
            <el-checkbox label="复选框 3-1"></el-checkbox>
            <el-checkbox label="复选框 3-2"></el-checkbox>
            <el-checkbox label="复选框 3-3"></el-checkbox>
          </el-checkbox-group>
        </div>


        <div class="choose-item">
          <label>四、模板下载</label>
          <el-switch
            v-model="showModelDownload"
            on-text="显示"
            off-text="隐藏"
            :width=60
            >
          </el-switch>
          <el-checkbox-group v-model="checkList" v-show="modelDownloadOpen" @change="recordChange">
            <el-checkbox label="复选框 4-1"></el-checkbox>
            <el-checkbox label="复选框 4-2"></el-checkbox>
            <el-checkbox label="复选框 4-3"></el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="choose-item">
          <label>五、统&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</label>
          <el-switch
            v-model="showStatistics"
            on-text="显示"
            off-text="隐藏"
            :width=60
            @change="switchChange">
          </el-switch>
          <el-checkbox-group v-model="checkList" v-show="statisticsChange" @change="recordChange">
            <el-checkbox label="复选框 5-2"></el-checkbox>
            <el-checkbox label="复选框 5-3"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>

  </div>

</template>

<script>
  import '../../style/switch.css'
  //import '../../style/checkbox.css'
  let chooseItems = [];
  export default{
    name: 'meunFunSet',
    data(){
      return {
        showRecord: true,
        showSearch: true,
        showApprove: true,
        showModelDownload: true,
        showStatistics: true,
        checkList: [],
        isDisabledSave: true,
        items:[{'mes':'sss'},{'mes':'ooooo'}],
        defaultProps:{
            mes:'mes'
        }
      }
    }, components: {},
    created(){
      // this.$store.commit('CHANGE_MEUNSETFUN_DATA', tableData);
    }, computed: {
      recordOpen(){
        return this.showRecord ? true : false;
      },
      searchOpen(){
        return this.showSearch ? true : false;
      },
      approveOpen(){
        return this.showApprove ? true : false;
      },
      modelDownloadOpen(){
        return this.showModelDownload ? true : false;
      }, statisticsChange(){
        return this.showStatistics ? true : false;
      }


    }, methods: {
      recordChange(call){
        chooseItems = call;
        this.isDisabledSave = false;
      },
      isDisabledSaveButton(){
        return this.isDisabledSave
      },
      switchChange:function(){

        this.isDisabledSave = false;
      },
      save(){
          this.$notify({title:'保存成功',message:chooseItems+this.showSearch,type:'success'})
      }
    }
  }
</script>
<style lang="less">


</style>
