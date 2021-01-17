<template>
  <div class="app-container">
    <el-row class="menu_container">
      <el-col :span="4" class="menu_tree">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <h3>菜单</h3>
          <el-tree
            :data="menuTree"
            node-key="id"
            :default-expanded-keys="openMenuIds"
            @node-click="listPermission"
            @node-collapse="closeNode"
            @node-expand="openNode"
            :props="defaultProps">
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="permission_container">
        <h3>{{this.menuNode.menuName}} - {{this.menuNode.menuCode}}</h3>
        <div class="filter-container">
          <el-button round size="small" class="filter-item"
                     type="success" icon="el-icon-plus" @click="handleAdd">
            添加子节点
          </el-button>
          <el-button round size="small" class="filter-item"
                     type="primary" icon="el-icon-edit" @click="handleUpdate">
            修改
          </el-button>
          <el-button round size="small" class="filter-item"
                     type="danger" icon="el-icon-delete" @click="handleDelete">
            删除
          </el-button>
          <el-button round size="small" class="filter-item"
                     type="primary" icon="el-icon-setting" @click="handleAssignedPer">
            分配权限
          </el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="permissionList"
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
          <el-table-column label="权限名称" prop="perName" min-width="100" align="center">
            <template slot-scope="{row}">
              <span>{{row.perName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限码" prop="perCode" min-width="100" align="center">
            <template slot-scope="{row}">
              <span>{{row.perCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限组" prop="perGroup" min-width="80" align="center">
            <template slot-scope="{row}">
              <span>{{row.perGroup}}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限url" prop="perUrl" min-width="150" align="center">
            <template slot-scope="{row}">
              <span>{{row.perUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="mtime" min-width="130" align="center">
            <template slot-scope="{row}">
              <span>{{row.mtime}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <pop-transfer
      v-model="choosePermissionList"
      v-el-drag-dialog
      pop-title="分配权限"
      :list-titles="['权限池', '已分配']"
      :data="allPermissionList"
      :visible="visible"
      :on-close="close"
      :on-submit="assignedPer"/>
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
        label-width="80px"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName"/>
        </el-form-item>
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input v-model="temp.menuCode"/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="temp.menuType">
            <el-option v-for="item in menuTypeMap" :key="item.key" :label="item.value" :value="item.key"/>
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
import PopTransfer from '@/components/PopTransfer'

export default {
  name: "Menu",
  components: {Pagination, PopTransfer},
  directives: {waves, elDragDialog},
  data() {
    return {
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      listLoading: false,
      permissionList: [],
      menuNode: '',
      choosePermissionList: [],
      allPermissionList: [],
      visible: false,
      dialogStatus: '',
      textMap: {
        update: '修改菜单',
        create: '添加菜单'
      },
      menuTypeMap: [
        {
          "key": 1,
          "value": "普通菜单"
        },
        {
          "key": 2,
          "value": "新窗口"
        },
        {
          "key": 3,
          "value": "iframe"
        },
      ],
      dialogFormVisible: false,
      temp: {
        id: '',
        menuName: '',
        menuCode: '',
        menuType: '',
        menuParentId: ''
      },
      rules: {
        menuName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
        menuCode: [{required: true, message: '请输入菜单编号', trigger: 'blur'}],
        menuType: [{required: true, message: '请输入菜单类型', trigger: 'change'}],
      },
      openMenuIds: []
    }
  },
  created() {
    this.listTree();
  },
  methods: {
    listTree() {
      this.menuTree = [];
      request.get("/system-manage/sys/menu/listTree", {})
        .then(response => {
          let data = response.data;
          if (data) {
            this.menuTree.push(data);
            if (!this.menuNode) {
              this.menuNode = data;
            }
            if (this.openMenuIds.length === 0) {
              this.openMenuIds.push(data.id);
            }
            this.listByMenuId();
          }
        });
    },
    listPermission(node) {
      this.menuNode = node;
      this.listByMenuId();
    },
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.temp.menuParentId = this.menuNode.id;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/menu/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '菜单添加成功'
              })
              this.listTree();
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleUpdate() {
      this.temp = Object.assign({}, this.menuNode);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/menu/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '菜单更新成功'
              })
              this.menuNode = Object.assign({}, this.temp);
              this.listTree();
              this.dialogFormVisible = false
            })
        }
      })
    },
    listByMenuId() {
      this.listLoading = true;
      request.get("/system-manage/sys/permission/listByMenuId", {menuId: this.menuNode.id})
        .then(response => {
          this.permissionList = response.data
          this.listLoading = false;
        });
    },
    handleDelete() {
      this.$confirm('确定永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/sys/menu/deleteById", {id: this.menuNode.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.openMenuIds = this.openMenuIds.filter(id => id !== this.menuNode.id);
            this.menuNode = null;
            this.listTree();
          })
      }).catch(() => {

      })
    },
    handleAssignedPer() {
      this.allPermissionList = [];
      this.choosePermissionList = [];
      if (!this.menuNode) {
        this.$message({
          type: 'warning',
          message: '请选择菜单节点'
        })
        return;
      }
      request.get("/system-manage/sys/permission/listMenuAssigned", {menuId: this.menuNode.id})
        .then(response => {
          response.data.forEach(item => {
            this.allPermissionList.push({
              key: item.id,
              label: item.perName
            });
            if (item.isAssigned) {
              this.choosePermissionList.push(item.id);
            }
          });
          this.visible = true;
        });
    },
    close() {
      this.visible = false;
    },
    assignedPer() {
      const perIds = this.choosePermissionList.join(',')
      const param = {
        menuId: this.menuNode.id,
        perIds: perIds
      }
      request.post("/system-manage/sys/menu/assignedPer", param)
        .then(response => {
          this.$message({
            type: 'success',
            message: '权限分配成功'
          })
          this.listByMenuId();
          this.visible = false;
        });
    },
    closeNode(node) {
      this.openMenuIds = this.openMenuIds.filter(id => id !== node.id);
    },
    openNode(node) {
      this.openMenuIds.push(node.id);
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    height: 100%;

    .menu_container {
      height: 100%;

      .menu_tree {
        height: 100%;
        border-right: 1px solid #cbcbcb;

        .el-scrollbar {
          height: 100%;
        }

        h3 {
          margin: 10px 0;
          border-left: 5px solid #43cbe3;
          padding-left: 10px;
        }
      }

      .permission_container {
        padding-left: 20px;
      }
    }
  }
</style>

<style lang="scss">
  .app-container {
    .pop-transfer {
      .el-dialog {
        width: 45%;
      }

      .el-transfer-panel {
        width: 100%;
      }

      .el-transfer-panel__list.is-filterable {
        width: 100%;
      }
    }
  }
</style>
