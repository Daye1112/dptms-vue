<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.realName" placeholder="姓名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-plus" @click="handleAdd">
        添加
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
      <el-table-column label="用户名" prop="username" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.username || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="realName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.realName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{genderMap[row.gender] || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phoneNumber" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.phoneNumber || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.email || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" prop="lastLoginTime" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.lastLoginTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码更新时间" prop="pwdUpdateTime" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.pwdUpdateTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button round size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button round size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button round size="mini" :type="row.isLocked === 0 ? 'danger' : 'primary'" @click="handleDelete(row)">
            {{row.isLocked === 0 ? "锁定":"解锁"}}
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
  name: "User",
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
      genderMap: {
        "": null,
        1: "男",
        2: "女"
      },
      list: [],
      total: 0,
      listLoading: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '添加用户'
      },
      temp: {
        id: '',
        username: '',
        realName: '',
        gender: '',
        phoneNumber: '',
        email: '',
        isLocked: ''
      },
      dialogFormVisible: false,
      rules: {
        perGroup: [{required: true, message: '请输入权限组', trigger: ['blur', 'change']}],
        perName: [{required: true, message: '请输入权限名', trigger: 'blur'}],
        perCode: [{required: true, message: '请输入权限码', trigger: 'blur'}],
        perUrl: [{required: true, message: '请输入权限url', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/sys/user/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    handleUpdate(row) {
    },
    update() {
    },
    handleAdd() {

    },
    add() {

    },
    handleDelete(row) {
    },
    setPagination() {
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
