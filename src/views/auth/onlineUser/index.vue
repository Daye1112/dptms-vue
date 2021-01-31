<template>
  <div class="app-container">
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
        <el-table-column label="IP" prop="ip" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{row.ip || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录地点" prop="ipAddress" min-width="50" align="center">
          <template slot-scope="{row}">
            <span>{{row.ipAddress || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="browser" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{row.browser || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" prop="os" min-width="150" align="center">
          <template slot-scope="{row}">
            <span>{{row.os || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录时间" prop="loginTime" min-width="130" align="center">
          <template slot-scope="{row}">
            <span>{{row.loginTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="80" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="danger"
                       v-permission="['SYS_ONLINE_USER_FORCED_OFFLINE']"
                       @click="handleForcedOffline(row)">
              强制下线
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
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'

export default {
  name: "OnlineUser",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        username: '',
        realName: ''
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
    listPage() {
      this.listLoading = true;
      request.get("/auth/onlineUser/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    setPagination() {
      this.listPage();
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.listPage();
    },
    handleForcedOffline(row) {
      this.$confirm('确定让该用户强制下线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/auth/onlineUser/forcedOffline", {userId: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.listPage();
          })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
