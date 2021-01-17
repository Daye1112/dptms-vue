<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" placeholder="角色名称"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.roleCode" placeholder="角色编号"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-plus" @click="handleAdd">
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
      <el-table-column label="角色名称" prop="roleName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色编号" prop="roleCode" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.roleCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否管理员" prop="isAdmin" min-width="40" align="center">
        <template slot-scope="{row}">
          <span>{{row.isAdmin ? "是" : "否"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="mtime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.mtime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button round size="mini" type="primary" @click="handleAssignedMenu(row)">
            分配菜单
          </el-button>
          <el-button round size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button round size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
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
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="temp.roleName"/>
        </el-form-item>
        <el-form-item label="角色编号" prop="roleCode">
          <el-input v-model="temp.roleCode"/>
        </el-form-item>
        <el-form-item label="是否管理员" prop="isAdmin">
          <el-checkbox v-model="temp.isAdmin">是否管理员</el-checkbox>
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
    <el-dialog
      v-el-drag-dialog
      title="分配菜单"
      :visible.sync="dialogMenuVisible"
      width="35%"
    >
      <div class="menu-tree">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            show-checkbox
            :check-strictly="true"
            :highlight-current="true"
            :default-expanded-keys="openMenuIds"
            ref="menuTree"
            :data="menuTree"
            node-key="id"
            :props="defaultProps"/>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="dialogMenuVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary" @click="assignedMenu">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'

export default {
  name: "Role",
  components: {Pagination},
  directives: {waves, elDragDialog},
  computed: {
    ...mapGetters([
      'orgId',
    ]),
  },
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        roleName: '',
        roleCode: ''
      },
      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        update: '修改角色',
        create: '添加角色'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
        roleCode: [{required: true, message: '请输入角色编号', trigger: 'blur'}],
        isAdmin: [{required: true, message: '请选择是否管理员', trigger: 'blur'}]
      },
      temp: {
        id: '',
        roleName: '',
        roleCode: '',
        isAdmin: false
      },
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuTree: [],
      openMenuIds:[],
      dialogMenuVisible: false,
      assignTemp: {
        roleId: '',
        menuIds: ''
      }
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/sys/role/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.listPage();
    },
    initHandleParam() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.temp.isAdmin = false;
    },
    handleAdd() {
      this.initHandleParam();
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/role/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '角色添加成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
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
          request.post("/system-manage/sys/role/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '角色更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/sys/role/deleteById", {id: row.id})
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
    handleAssignedMenu(row) {
      this.assignTemp.roleId = row.id;
      this.menuTree = [];
      request.get("/system-manage/sys/menu/listRoleAssigned", this.assignTemp)
        .then(response => {
          let data = response.data;
          this.menuTree.push(data);
          this.openMenuIds = data.assignedIdList;
          this.$nextTick(() => {
            this.$refs.menuTree.setCheckedKeys(data.assignedIdList);
          });
          this.dialogMenuVisible = true;
        });
    },
    assignedMenu() {
      this.assignTemp.menuIds = this.$refs.menuTree.getCheckedKeys().join(",");
      request.get("/system-manage/sys/role/assignedMenu", this.assignTemp)
        .then(response => {
          this.$message({
            type: 'success',
            message: '分配菜单成功'
          })
          this.dialogMenuVisible = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-tree {
    height: 300px;

    .el-scrollbar {
      height: 100%;
    }
  }
</style>
