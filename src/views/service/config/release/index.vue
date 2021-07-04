<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input v-model="listQuery.researchKey" placeholder="请输入应用编号或应用名称"-->
                <!--size="small" class="filter-item"-->
                <!--@keyup.enter.native="handleFilter"/>-->
      <!--<el-button round size="small" class="filter-item"-->
                 <!--type="primary" icon="el-icon-search" @click="handleFilter">-->
        <!--查询-->
      <!--</el-button>-->
      <!--<el-button round size="small" class="filter-item fr"-->
                 <!--type="primary" icon="el-icon-s-promotion"-->
                 <!--v-permission="['SERVICE_CONFIG_RELEASE_MANAGE']" @click="viewRelease">-->
        <!--对比-->
      <!--</el-button>-->
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
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
      />
      <el-table-column label="发布版本" prop="releaseVersion" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.releaseVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布类型" prop="releaseType" min-width="40" align="center">
        <template slot-scope="{row}">
          <span>{{row.releaseType === 1 ? "普通发布" : (row.releaseType === 2 ? "回滚发布" : "--")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="mtime" min-width="60" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.mtime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="info"
                     v-permission="['SERVICE_CONFIG_PROFILE_MANAGE']" @click="viewProfile(row)">
            查看
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
  name: "Release",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        applicationId: '',
        profileId: ''
      },
      list: []
    }
  },
  computed: {
    currentApplicationId() {
      return this.$route.query.applicationId;
    },
    currentProfileId() {
      return this.$route.query.profileId;
    }
  },
  created() {
    if (this.currentProfileId && this.currentApplicationId) {
      this.listQuery.applicationId = this.currentApplicationId;
      this.listQuery.profileId = this.currentProfileId;
      this.listPage();
    }
  },
  methods: {
    setPagination() {
      this.listPage();
    },
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/service/config/release/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    handleFilter() {

    }
  }
}
</script>

<style lang="scss">

</style>
