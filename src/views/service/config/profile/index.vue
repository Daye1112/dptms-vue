<template>
  <div class="app-container">
    <el-row class="profile_container">
      <el-col :span="6" class="profile_list">
        <h3>{{this.currentApplicationName}}</h3>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <ul>
            <li v-for="item in this.profileList"
                @click="changeProfile(item)"
                :class="currentProfileId === item.id ? 'is-active':''">
              {{item.profileCode}}
              <el-button circle size="mini"
                         v-permission="['SERVICE_CONFIG_PROFILE_DELETE']"
                         @click="profileDelete(item)">
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button circle size="mini"
                         v-permission="['SERVICE_CONFIG_PROFILE_UPDATE']"
                         @click="handleProfileUpdate(item)">
                <i class="el-icon-edit"></i>
              </el-button>
            </li>
            <el-button class="add-profile-button" size="mini"
                       v-permission="['SERVICE_CONFIG_PROFILE_INSERT']"
                       @click="handleProfileAdd">+
            </el-button>
          </ul>
        </el-scrollbar>
      </el-col>
      <el-col :span="18" class="profile_prop_list">
        <el-button type="text" @click="$router.back(-1)">&lt;&nbsp;返回</el-button>
        <div class="filter-container">
          <el-input v-model="propListQuery.propKey" placeholder="请输入Key"
                    size="small" class="filter-item"
                    @keyup.enter.native="handleFilter"/>
          <el-button round size="small" class="filter-item"
                     type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button round size="small" class="filter-item fr"
                     type="success" icon="el-icon-plus"
                     v-permission="['SERVICE_CONFIG_PROFILE_PROP_ADD']" @click="handlePropAdd">
            添加
          </el-button>
          <el-button round size="small" class="filter-item fr"
                     type="primary" icon="el-icon-s-promotion"
                     v-permission="['SERVICE_CONFIG_RELEASE_ADD']" @click="handleRelease">
            发布
          </el-button>
          <el-button round size="small" class="filter-item fr"
                     type="info" icon="el-icon-s-promotion"
                     v-permission="['SERVICE_CONFIG_RELEASE_MANAGE']" @click="viewRelease">
            发布记录
          </el-button>
        </div>
        <el-table
          v-loading="propListLoading"
          :data="propList"
          border
          fit
          size="small"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="50"
          />
          <el-table-column label="Key" prop="propKey" min-width="80" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.propKey}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Value" prop="propValue" min-width="80" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.propValue}}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="propDesc" min-width="80" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.propDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="mtime" min-width="60" align="center">
            <template slot-scope="{row}">
              <span>{{row.mtime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary"
                         v-permission="['SERVICE_CONFIG_PROFILE_PROP_UPDATE']" @click="handlePropUpdate(row)">
                修改
              </el-button>
              <el-button size="mini" type="danger"
                         v-permission="['SERVICE_CONFIG_PROFILE_PROP_DELETE']" @click="propDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
    <!--配置环境属性修改/新增弹窗-->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="propDialogFormVisible"
      width="40%"
    >
      <el-form
        ref="propDataForm"
        :rules="propRules"
        :model="propTemp"
        size="small"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="Key" prop="propKey">
          <el-input v-model="propTemp.propKey"/>
        </el-form-item>
        <el-form-item label="Value" prop="propValue">
          <el-input v-model="propTemp.propValue"/>
        </el-form-item>
        <el-form-item label="描述" prop="propDesc">
          <el-input v-model="propTemp.propDesc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="propDialogFormVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary"
                   @click="dialogStatus === 'create'? propAdd() : propUpdate()">
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
      propListLoading: false,
      // 环境查询条件
      profileListQuery: {
        applicationId: ''
      },
      // 配置查询条件
      propListQuery: {
        profileId: '',
        propKey: ''
      },
      // 环境list
      profileList: [],
      // 配置list
      propList: [],
      // 当前环境
      currentProfile: {
        id: '',
        applicationId: '',
        profileName: '',
        profileCode: ''
      },
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
      // 临时属性信息
      propTemp: {
        id: '',
        profileId: '',
        propKey: '',
        propValue: '',
        propDesc: ''
      },
      // 环境弹窗显示状态
      propDialogFormVisible: false,
      propRules: {
        propKey: [{required: true, message: '请输入Key', trigger: 'blur'}],
        propValue: [{required: true, message: '请输入Value', trigger: 'blur'}]
      },
    }
  },
  computed: {
    currentApplicationId() {
      return this.$route.query.applicationId;
    },
    currentApplicationName() {
      return this.$route.query.applicationName;
    },
    currentProfileId() {
      return this.currentProfile.id;
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
      if (!this.currentProfileId) {
        this.$message({
          type: 'warning',
          message: '请选择环境'
        });
        return;
      }
      this.getPropList();
    },
    getProfileList() {
      request.get("/system-manage/service/config/profile/list", this.profileListQuery)
        .then(response => {
          this.profileList = response.data;
          if (this.profileList && this.profileList.length > 0) {
            this.currentProfile = this.profileList[0];
            this.getPropList();
          }
        });
    },
    getPropList() {
      if (this.currentProfileId) {
        this.propListLoading = true;
        this.propListQuery.profileId = this.currentProfileId;
        request.get("/system-manage/service/config/profile/prop/list", this.propListQuery)
          .then(response => {
            this.propList = response.data;
            this.propListLoading = false;
          });
      }
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
              });
              this.getProfileList();
              this.profileDialogFormVisible = false;
            })
        }
      })
    },
    handleProfileUpdate(row) {
      this.profileTemp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.profileDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['profileDataForm'].clearValidate();
      });
    },
    profileUpdate() {
      this.$refs['profileDataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/service/config/profile/update", this.profileTemp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '环境更新成功'
              });
              if (this.profileTemp.id === this.currentProfile.id) {
                this.currentProfile = this.profileTemp;
              }
              this.profileDialogFormVisible = false;
            })
        }
      })
    },
    profileDelete(row) {
      this.$confirm('确定永久删除该环境, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/service/config/profile/deleteById", {id: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getProfileList();
          })
      }).catch(() => {

      })
    },
    changeProfile(row) {
      this.currentProfile = row;
      this.getPropList();
    },
    handlePropAdd() {
      if (!this.currentProfileId) {
        this.$message({
          type: 'warning',
          message: '请选择环境'
        });
        return;
      }
      let _this = this;
      Object.getOwnPropertyNames(this.propTemp).forEach(function (key) {
        _this.propTemp[key] = '';
      });
      // 当前组织id
      this.propTemp.profileId = this.currentProfileId;
      this.dialogStatus = 'create';
      this.propDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['propDataForm'].clearValidate()
      });
    },
    propAdd() {
      this.$refs['propDataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/service/config/profile/prop/insert", this.propTemp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '属性添加成功'
              });
              this.getPropList();
              this.propDialogFormVisible = false;
            })
        }
      })
    },
    handlePropUpdate(row) {
      this.propTemp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.propDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['propDataForm'].clearValidate();
      });
    },
    propUpdate() {
      this.$refs['propDataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/service/config/profile/prop/update", this.propTemp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '属性更新成功'
              });
              this.getPropList();
              this.propDialogFormVisible = false;
            })
        }
      })
    },
    propDelete(row) {
      this.$confirm('确定永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/service/config/profile/prop/deleteById", {id: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPropList();
          })
      }).catch(() => {

      })
    },
    handleRelease() {
      if (!this.currentProfileId) {
        this.$message({
          type: 'warning',
          message: '请选择环境'
        });
        return;
      }
      this.$confirm('确定发布当前环境, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 封装参数
        let jsonParam = {
          applicationId: this.currentApplicationId,
          profileId: this.currentProfileId,
          releaseType: 1
        };
        // 发送请求
        request.post("/system-manage/service/config/release/insert", jsonParam)
          .then(response => {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.getPropList();
          })
      }).catch(() => {

      })
    },
    viewRelease() {
      this.$router.push({
        path: '/service/release',
        query: {applicationId: this.currentApplicationId, profileId: this.currentProfileId}
      });
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
            padding-left: 5px;

            button {
              float: right;
              margin: 3px;
              border: 1px dotted lightblue;
            }
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
