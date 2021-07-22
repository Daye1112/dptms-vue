<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.realName" placeholder="姓名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-plus"
                 v-permission="['SYS_USER_ADD']"
                 @click="handleAdd">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="用户名" prop="username" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.username || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="realName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.realName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{row.gender === 1 ? "男" : (row.gender === 2 ? "女" : "--")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phoneNumber" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.phoneNumber || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.email || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="mtime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.mtime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary"
                     v-permission="['SYS_USER_ASSIGNED_ROLE']" @click="handleAssignedRole(row)">
            分配角色
          </el-button>
          <el-button size="mini" type="primary"
                     v-permission="['SYS_USER_ASSIGNED_ORG']" @click="handleAssignedOrg(row)">
            分配组织
          </el-button>
          <el-button size="mini" type="primary"
                     v-permission="['SYS_USER_UPDATE']" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger"
                     v-permission="['SYS_USER_DELETE']" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button size="mini" :type="row.isLocked === 0 ? 'danger' : 'primary'"
                     v-permission="['SYS_USER_LOCK']" @click="handleLock(row)">
            {{row.isLocked === 0 ? "锁定":"解锁"}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="pagination-fr"
      @pagination="setPagination"
    />
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender">
            <el-option key="" label="请选择" value=""/>
            <el-option v-for="item in genderMap" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
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
    <pop-transfer
      v-model="chooseRoleList"
      v-el-drag-dialog
      pop-title="分配角色"
      :list-titles="['角色池', '已分配']"
      :data="allRoleList"
      :visible="rolePopVisible"
      :on-close="rolePopClose"
      :on-submit="assignedRole"/>
    <pop-transfer
      v-model="chooseOrgList"
      v-el-drag-dialog
      pop-title="分配组织"
      :list-titles="['组织池', '已分配']"
      :data="allOrgList"
      :visible="orgPopVisible"
      :on-close="orgPopClose"
      :on-submit="assignedOrg"/>
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'
import PopTransfer from '@/components/PopTransfer'

export default {
  name: "User",
  components: {Pagination, PopTransfer},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        username: '',
        realName: ''
      },
      genderMap: [
        {
          "key": 1,
          "value": "男"
        },
        {
          "key": 2,
          "value": "女"
        }
      ],
      list: [],
      total: 0,
      listLoading: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '添加用户'
      },
      temp: {
        id: '',
        username: '',
        realName: '',
        gender: '',
        phoneNumber: '',
        email: ''
      },
      dialogFormVisible: false,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}]
      },
      chooseRoleList: [],
      allRoleList: [],
      rolePopVisible: false,
      roleAssignTemp: {
        userId: '',
        roleIds: ''
      },
      chooseOrgList: [],
      allOrgList: [],
      orgPopVisible: false,
      orgAssignTemp: {
        userId: '',
        orgIds: ''
      },
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      request.get("/auth/user/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/auth/user/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '用户更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/auth/user/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '用户添加成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/auth/user/deleteById", {id: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.listPage();
          })
      }).catch(() => {

      })
    },
    setPagination() {
      this.listPage();
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.listPage();
    },
    handleLock(row) {
      let msg = row.isLocked === 0 ? "锁定" : "解锁";
      let realIsLocked = row.isLocked === 0 ? 1 : 0;
      this.$confirm('确定' + msg + '该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/auth/user/updateLock", {id: row.id, isLocked: realIsLocked})
          .then(response => {
            this.$message({
              type: 'success',
              message: msg + '成功!'
            })
            this.listPage();
          })
      }).catch(() => {

      })
    },
    handleAssignedRole(row) {
      this.chooseRoleList = [];
      this.allRoleList = [];
      this.roleAssignTemp.userId = row.id;
      request.get("/auth/role/listUserAssigned", this.roleAssignTemp)
        .then(response => {
          response.data.forEach(item => {
            this.allRoleList.push({
              key: item.id,
              label: item.roleName
            });
            if (item.isAssigned) {
              this.chooseRoleList.push(item.id);
            }
          });
          this.rolePopVisible = true;
        });
    },
    assignedRole() {
      this.roleAssignTemp.roleIds = this.chooseRoleList.join(",");
      request.get("/auth/user/assignedRole", this.roleAssignTemp)
        .then(response => {
          this.$message({
            type: 'success',
            message: '分配角色成功'
          })
          this.rolePopVisible = false;
        });
    },
    handleAssignedOrg(row) {
      this.chooseOrgList = [];
      this.allOrgList = [];
      this.orgAssignTemp.userId = row.id;
      request.get("/auth/organization/listUserAssigned", this.orgAssignTemp)
        .then(response => {
          response.data.forEach(item => {
            this.allOrgList.push({
              key: item.id,
              label: item.orgName
            });
            if (item.isAssigned) {
              this.chooseOrgList.push(item.id);
            }
          });
          this.orgPopVisible = true;
        });
    },
    assignedOrg() {
      this.orgAssignTemp.orgIds = this.chooseOrgList.join(",");
      request.get("/auth/user/assignedOrg", this.orgAssignTemp)
        .then(response => {
          this.$message({
            type: 'success',
            message: '分配组织成功'
          })
          this.orgPopVisible = false;
        });
    },
    rolePopClose() {
      this.rolePopVisible = false;
    },
    orgPopClose() {
      this.orgPopVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
