<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="请输入用户名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.ip" placeholder="请输入ip地址"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.businessType"
        placeholder="业务类型"
        style="width: 200px;"
        class="filter-item"
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in businessTypeList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.logLevel"
        placeholder="日志级别"
        style="width: 200px;"
        class="filter-item"
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in logLevelList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        size="small"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="异常详细">
                <span>{{row.exceptionContent}}</span>
              </el-form-item>
              <el-form-item label="请求参数">
                <span>{{row.requestParam}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="key" min-width="80" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" prop="value" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" prop="expired" min-width="180" align="center">
          <template slot-scope="{row}">
            <span>{{row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="expired" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{row.browser}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ip" prop="expired" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{row.ip}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ip地址" prop="expired" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{row.ipAddress}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日志级别" prop="expired" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{logLevelMap[row.logLevel]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" prop="expired" min-width="70" align="center">
          <template slot-scope="{row}">
            <span>{{businessTypeMap[row.businessType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="接口耗时" prop="expired" min-width="80" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.timeConsuming > 500 ? (row.timeConsuming > 1000 ? 'danger' : 'warning' ): 'success'">
              <span>{{ row.timeConsuming }} ms</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求时间" prop="expired" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{row.ctime}}</span>
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
    </div>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import elDragDialog from '@/directive/el-drag-dialog'
  import waves from '@/directive/waves'

  export default {
    name: "operateLog",
    components: {Pagination},
    directives: {waves, elDragDialog},
    data() {
      return {
        // 列表查询参数
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          username: '',
          ipAddress: '',
          logLevel: '',
          businessType: ''
        },
        // 列表数据
        list: [],
        // 从记录数
        total: 0,
        // 列表加载
        listLoading: false,
        // 业务类型
        businessTypeList: [
          {key: '', value: '全部'},
          {key: 0, value: '其它'},
          {key: 1, value: '新增'},
          {key: 2, value: '修改'},
          {key: 3, value: '删除'},
          {key: 4, value: '导出'},
          {key: 5, value: '导入'},
          {key: 6, value: '强退'},
          {key: 7, value: '查询'}
        ],
        businessTypeMap: {0: '其它', 1: '新增', 2: '修改', 3: '删除', 4: '导出', 5: '导入', 6: '强退', 7: '查询'},
        // 日志级别
        logLevelList: [
          {key: '', value: '全部'},
          {key: 0, value: 'TRACE'},
          {key: 1, value: 'DEBUG'},
          {key: 2, value: 'INFO'},
          {key: 3, value: 'WARN'},
          {key: 4, value: 'ERROR'}
        ],
        logLevelMap: {0: 'TRACE', 1: 'DEBUG', 2: 'INFO', 3: 'WARN', 4: 'ERROR'}
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
        request.get("/monitor-manage/operateLog/listPage", this.listQuery)
          .then(response => {
            const {content, total} = response.data;
            this.list = content;
            this.total = total;
            this.listLoading = false;
          }).catch((err) => {
          //对异常进行处理
          this.listLoading = false;
        });
      },
      handleFilter() {
        this.listQuery.currentPage = 1;
        this.listPage();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  }
</style>
