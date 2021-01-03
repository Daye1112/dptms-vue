<template>
  <div class="app-container">
    <el-row class="menu_container">
      <el-col :span="4" class="menu_tree">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            :data="menuTree"
            node-key="id"
            @node-click="listPermission"
            :props="defaultProps">
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">

      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'

export default {
  name: "Menu",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      }
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
          }
        });
    },
    listPermission(node) {
      console.log(node);
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
        border-right: 1px solid #e3e3e3;

        .el-scrollbar {
          height: 100%;
        }
      }
    }
  }
</style>
