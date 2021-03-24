<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.researchKey" placeholder="请输入应用编号或应用名称"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <!--配置环境修改/新增弹窗-->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[profileDialogStatus]"
      :visible.sync="profileDialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :rules="profileRules"
        :model="profileTemp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="应用编号" prop="appCode">
          <el-input v-model="temp.appCode"/>
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="temp.appName"/>
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <el-select v-model="temp.appType">
            <el-option key="" label="请选择" value=""/>
            <el-option v-for="item in appTypeMap" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary" @click="dialogStatus === 'create'? add() : update()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import elDragDialog from '@/directive/el-drag-dialog'
  import waves from '@/directive/waves'

  export default {
    name: "Profile",
    components: {Pagination},
    directives: {waves, elDragDialog},
    data() {
      return {
        // 环境查询条件
        profileListQuery: {
          applicationId: ''
        },
        // 配置查询条件
        propListQuery: {
          profileId: '',
          researchKey: ''
        },
        // 环境list
        profileList: [],
        // 配置list
        propList: [],
        // 当前环境id
        currentProfileId: '',
        // 弹窗状态
        profileDialogStatus: '',
        // 弹窗标题
        textMap: {
          update: '修改',
          create: '添加'
        },
        // 临时环境信息
        profileTemp: {
          id: '',
          orgId: '',
          appCode: '',
          appName: '',
          appType: ''
        },
        // 环境弹窗显示状态
        profileDialogFormVisible: false,
        profileRules: {
          appCode: [{required: true, message: '请输入应用编号', trigger: 'blur'}],
          appName: [{required: true, message: '请输入应用名称', trigger: 'blur'}],
          appType: [{required: true, message: '请选择应用类型', trigger: 'blur'}],
        },
      }
    },
    created() {
    },
    methods: {
      handleFilter() {

      },
      getProfileList() {
        request.get("/system/service/config/profile/list", this.profileListQuery)
          .then(response => {
            this.profileList = response.data;
            if (this.profileList) {
              this.currentProfileId = this.profileList[0].id;
            }
          });
      },
      getPropList() {
        request.get("/system/service/config/profile/prop/list", this.propListQuery)
          .then(response => {
            this.propList = response.data;
          });
      },
      handleProfileAdd(){

      },
      profileAdd(){

      },
      handleProfileUpdate(){

      },
      profileUpdate(){

      },
      profileDelete(){

      },
      handlePropAdd(){

      },
      propAdd(){

      },
      handlePropUpdate(){

      },
      propUpdate(){

      },
      propDelete(){

      }
    }
  }
</script>

<style lang="scss">

</style>
