<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" placeholder="权限名或权限code" style="width: 200px;" class="filter-item"/>
      <el-input size="small" placeholder="权限组" style="width: 200px;" class="filter-item"/>
    </div>
    <el-table
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
      <el-table-column label="权限名称" prop="perName" min-width="120" align="center">
        <!--<template slot-scope="{row}">-->
          <span>新增用户</span>
        <!--</template>-->
      </el-table-column>
      <el-table-column label="权限code" prop="perCode" min-width="120" align="center">
        <!--<template slot-scope="{row}">-->
          <span>userAdd</span>
        <!--</template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: "Permission",
  components: {Pagination},
  data() {
    return {

    }
  },
  created() {

  },
  methods: {}
}
</script>

<style scoped>

</style>
