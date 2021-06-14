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
      <el-table-column label="应用编号" prop="appCode" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.appCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名称" prop="appName" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.appName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用类型" prop="appType" min-width="40" align="center">
        <template slot-scope="{row}">
          <span>{{row.appType === 1 ? "服务" : (row.appType === 2 ? "网关" : "--")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="info"
                     v-permission="['SERVICE_APPLICATION_VIEW_PROFILE']" @click="viewProfile(row)">
            环境
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
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'

export default {
  name: "Config",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        researchKey: ''
      },
      list: [],
      total: 0,
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    setPagination() {
      this.listPage();
    },
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/service/application/listPage", this.listQuery)
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
    viewProfile(row) {

    }
  }
}
</script>

<style lang="scss">

</style>
