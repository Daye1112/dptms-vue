<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="请输入用户名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.ip" placeholder="请输入ip"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.ipAddress" placeholder="请输入登录地"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.browser" placeholder="请输入浏览器"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.os" placeholder="请输入操作系统"
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
      <el-table-column label="用户名" prop="key" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作系统" prop="value" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.os}}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" prop="expired" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{row.browser}}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" prop="expired" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录地" prop="expired" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.ipAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" prop="expired" min-width="120" align="center">
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
  name: "loginLog",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        username: '',
        ip:'',
        ipAddress:'',
        browser:'',
        os:''
      },
      list: [],
      total: 0,
      listLoading: false,
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
      request.get("/monitor-manage/loginLog/listPage", this.listQuery)
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

<style scoped>

</style>
