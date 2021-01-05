<template>
  <div class="app-container">
    <el-row class="menu_container">
      <el-col :span="4" class="menu_tree">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <h3>菜单</h3>
          <el-tree
            :data="menuTree"
            node-key="id"
            @node-click="listPermission"
            :props="defaultProps">
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="permission_container">
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
      menuId: '',
      choosePermissionList: [],
      allPermissionList: [],
      visible: false
    }
  },
  created() {
    this.listTree();
  },
  methods: {
    listTree() {
      request.get("/system-manage/sys/menu/listTree", {})
        .then(response => {
          let data = response.data;
          if (data) {
            this.menuTree.push(data);
            this.menuId = data.id;
            this.listByMenuId();
          }
        });
    },
    listPermission(node) {
      this.menuId = node.id;
      this.listByMenuId();
    },
    handleAdd() {

    },
    handleUpdate() {

    },
    listByMenuId() {
      this.listLoading = true;
      request.get("/system-manage/sys/permission/listByMenuId", {"menuId": this.menuId})
        .then(response => {
          this.permissionList = response.data
          this.listLoading = false;
        });
    },
    handleDelete() {

    },
    handleAssignedPer() {
      this.allPermissionList = [];
      this.choosePermissionList = [];
      if (!this.menuId) {
        this.$message({
          type: 'warning',
          message: '请选择菜单节点'
        })
        return;
      }
      request.get("/system-manage/sys/permission/listMenuAssigned", {"menuId": this.menuId})
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
      console.log(this.choosePermissionList);
      const perIds = this.choosePermissionList.join(',')
      const param = {
        menuId: this.menuId,
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
