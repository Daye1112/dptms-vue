<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.module"
        placeholder="查询模块"
        style="width: 200px;"
        class="filter-item"
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in serverList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        size="small"
        type="primary"
        round
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="600"
      size="small"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="{row}">
          <el-form label-position="left" :inline="true" class="demo-api-table-expand" size="mini">
            <el-form-item label="请求最慢发生时间">
              <span>{{ row.requestTimeMillisMaxOccurTime }}</span>
            </el-form-item>
            <el-form-item label="最后一次请求时间">
              <span>{{ row.lastAccessTime }}</span>
            </el-form-item>
            <el-form-item label="更新行数高峰">
              <span>{{ row.jdbcUpdatePeak }}</span>
            </el-form-item>
            <el-form-item label="读取行数高峰">
              <span>{{ row.jdbcFetchRowPeak }}</span>
            </el-form-item>
            <el-form-item label="连接池连接打开数">
              <span>{{ row.jdbcPoolConnectionOpenCount }}</span>
            </el-form-item>
            <el-form-item label="连接池连接关闭数">
              <span>{{ row.jdbcPoolConnectionCloseCount }}</span>
            </el-form-item>
            <el-form-item label="jdbc执行高峰">
              <span>{{ row.jdbcExecutePeak }}</span>
            </el-form-item>
            <el-form-item label="区间分布">
              <span>{{ row.histogram }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="uri" align="center" min-width="250">
        <template slot-scope="{row}">
          <span>{{ row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大并发" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concurrentMax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行中" min-width="70" align="center">
        <template slot-scope="{row}">
          <span>{{ row.runningCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最慢请求" min-width="80" align="center">
        <template slot-scope="{row}">
          <el-tag
            :type="row.requestTimeMillisMax > 500 ? (row.requestTimeMillisMax > 1000 ? 'danger' : 'warning' ): 'success'">
            <span>{{ row.requestTimeMillisMax }} ms</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平均请求时间" min-width="110" align="center">
        <template slot-scope="{row}">
          <el-tag
            :type="parseInt(row.requestTimeMillis / row.requestCount) > 200 ? (parseInt(row.requestTimeMillis / row.requestCount) > 500 ? 'danger' : 'warning' ): 'success'">
            <span>{{ parseInt(row.requestTimeMillis / row.requestCount) }} ms</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求次数" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.requestCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="读取行数" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jdbcFetchRowCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jdbc时间" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jdbcExecuteTimeMillis }} ms</span>
        </template>
      </el-table-column>
      <el-table-column label="jdbc出错数" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jdbcExecuteErrorCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jdbc执行数" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jdbcExecuteCount }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import request from '@/utils/request'
import waves from '@/directive/waves'

export default {
  name: 'apiStat',
  directives: {waves},
  data() {
    return {
      serverList: [],
      list: [],
      listLoading: false,
      listQuery: {
        module: ''
      }
    }
  },
  created() {
    this.getSystemModules();
  },
  methods: {
    getSystemModules() {
      request.get("/monitor-manage/serverStat/serverList")
        .then(response => {
          this.serverList = response.data;
          this.listQuery.module = this.serverList[0].key;
          this.getList();
        }).catch((err) => {
        //对异常进行处理
        this.listLoading = false;
      });
    },
    getList() {
      this.listLoading = true
      // 1. 格式化时间
      request.get("/monitor-manage/serverStat/apiStatList", this.listQuery)
        .then(response => {
          this.list = response.data
          this.listLoading = false
        }).catch((err) => {
        //对异常进行处理
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;

    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }

  }
</style>
<style lang="scss">
  .app-container {
    .el-dialog__body {
      padding-bottom: 0;
    }

    .el-select {
      width: 100%;
    }

    .demo-api-table-expand {
      font-size: 0;
    }

    .demo-api-table-expand label {
      color: #99a9bf;
    }

    .demo-api-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>
