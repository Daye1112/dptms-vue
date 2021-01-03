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
          <span>{{row.gender === 1 ? "男" : (row.gender === 2 ? "女" : "--")}}</span>
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
      <el-table-column label="上次登录时间" prop="lastLoginTime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.lastLoginTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码更新时间" prop="pwdUpdateTime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.pwdUpdateTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="mtime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.mtime}}</span>
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
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender">
            <el-option key="" label="请选择" value=""/>
            <el-option v-for="item in genderMap" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary" @click="dialogStatus === 'create'? add() : update()">
          确定
        </el-button>
      </div>
    </el-dialog>
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
      genderMap: [
        {
          "key": 1,
          "value": "男"
        },
        {
          "key": 2,
          "value": "女"
        }
      ],
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
        email: ''
      },
      dialogFormVisible: false,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}]
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
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/user/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '用户更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/user/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '用户添加成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/sys/user/deleteById", {id: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.listPage();
          })
      }).catch(() => {

      })
    },
    setPagination() {
      this.listPage();
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
