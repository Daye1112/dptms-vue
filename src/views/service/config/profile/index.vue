<template>
  <div class="app-container">
    <el-row class="profile_container">
      <el-col :span="4" class="profile_list">
        <h3>{{this.currentApplicationName}}</h3>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <ul>
            <li v-for="item in this.profileList" :class="currentProfileId === item.id ? 'is-active':''">
              {{item.profileCode}}
            </li>
            <el-button class="add-profile-button" size="mini"
                       v-permission="['SERVICE_CONFIG_PROFILE_INSERT']"
                       @click="handleProfileAdd">+
            </el-button>
          </ul>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="profile_prop_list">
        <el-button type="text" @click="$router.back(-1)">&lt;&nbsp;返回</el-button>
      </el-col>
    </el-row>
    <!--配置环境修改/新增弹窗-->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="profileDialogFormVisible"
      width="40%"
    >
      <el-form
        ref="profileDataForm"
        :rules="profileRules"
        :model="profileTemp"
        size="small"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="环境编号" prop="profileCode">
          <el-input v-model="profileTemp.profileCode"/>
        </el-form-item>
        <el-form-item label="环境名称" prop="profileName">
          <el-input v-model="profileTemp.profileName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="profileDialogFormVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary"
                   @click="dialogStatus === 'create'? profileAdd() : profileUpdate()">
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
      dialogStatus: '',
      // 弹窗标题
      textMap: {
        update: '修改',
        create: '添加'
      },
      // 临时环境信息
      profileTemp: {
        id: '',
        applicationId: '',
        profileCode: '',
        profileName: ''
      },
      // 环境弹窗显示状态
      profileDialogFormVisible: false,
      profileRules: {
        profileCode: [{required: true, message: '请输入环境编号', trigger: 'blur'}],
        profileName: [{required: true, message: '请输入环境名称', trigger: 'blur'}]
      },
    }
  },
  computed: {
    currentApplicationId() {
      return this.$route.query.applicationId;
    },
    currentApplicationName() {
      return this.$route.query.applicationName;
    }
  },
  created() {
    // 获取应用id
    this.profileListQuery.applicationId = this.currentApplicationId;
    // 初始化数据
    if (this.profileListQuery.applicationId) {
      this.getProfileList();
    }
  },
  methods: {
    handleFilter() {

    },
    getProfileList() {
      request.get("/system-manage/service/config/profile/list", this.profileListQuery)
        .then(response => {
          this.profileList = response.data;
          if (this.profileList && this.profileList.size > 0) {
            this.currentProfileId = this.profileList[0].id;
          }
        });
    },
    getPropList() {
      request.get("/system-manage/service/config/profile/prop/list", this.propListQuery)
        .then(response => {
          this.propList = response.data;
        });
    },
    handleProfileAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.profileTemp).forEach(function (key) {
        _this.profileTemp[key] = '';
      });
      // 当前组织id
      this.profileTemp.applicationId = this.currentApplicationId;
      this.dialogStatus = 'create';
      this.profileDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['profileDataForm'].clearValidate()
      });
    },
    profileAdd() {
      this.$refs['profileDataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/service/config/profile/insert", this.profileTemp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '环境添加成功'
              })
              this.getProfileList();
              this.profileDialogFormVisible = false
            })
        }
      })
    },
    handleProfileUpdate() {

    },
    profileUpdate() {

    },
    profileDelete() {

    },
    handlePropAdd() {

    },
    propAdd() {

    },
    handlePropUpdate() {

    },
    propUpdate() {

    },
    propDelete() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    height: 100%;

    .profile_container {
      height: 100%;

      .profile_list {
        height: 100%;
        border-right: 1px solid #cbcbcb;

        .el-scrollbar {
          height: 600px;
        }

        h3 {
          margin: 10px 0;
          border-left: 5px solid #43cbe3;
          padding-left: 10px;
        }

        ul {
          padding: 0 5px 0 0;

          li {
            cursor: pointer;
            list-style-type: none;
            height: 35px;
            line-height: 35px;
          }

          li:hover, li:focus {
            outline: none;
            background-color: #e8f4ff;
          }

          .is-active {
            color: #1890ff;
          }
        }

        .add-profile-button {
          border: 2px dotted lightblue;
          width: 100%;
        }
      }

      .profile_prop_list {
        padding-left: 20px;

      }
    }
  }
</style>
