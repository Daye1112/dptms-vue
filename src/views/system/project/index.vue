<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.researchKey" placeholder="请输入项目名称"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-plus"
                 v-permission="['SYS_PROJECT_INSERT']" @click="handleAdd">
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
      <el-table-column label="项目名称" prop="projectName" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="AppKey" prop="projectAppKey" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.projectAppKey}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" prop="projectDesc" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.projectDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary"
                     v-permission="['SYS_PROJECT_UPDATE']" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger"
                     v-permission="['SYS_PROJECT_DELETE']" @click="handleDelete(row)">
            删除
          </el-button>
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
        label-width="80px"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="temp.projectName"/>
        </el-form-item>
        <el-form-item label="AppKey" prop="projectAppKey">
          <el-input v-model="temp.projectAppKey"/>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectDesc">
          <el-input type="textarea" v-model="temp.projectDesc"/>
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
  name: "Application",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        researchKey: ''
      },
      list: [],
      total: 0,
      dialogStatus: '',
      textMap: {
        update: '修改项目信息',
        create: '添加项目信息'
      },
      temp: {
        id: '',
        orgId: '',
        projectName: '',
        projectAppKey: '',
        projectDesc: ''
      },
      dialogFormVisible: false,
      rules: {
        projectName: [{required: true, message: '请输入项目名称', trigger: 'blur'}]
      }
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
      request.get("/system-manage/project/info/listPage", this.listQuery)
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
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      // 当前组织id
      this.temp.orgId = 1;
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      });
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/project/info/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '应用项目成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
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
          request.post("/system-manage/project/info/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '项目更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/project/info/deleteById", {id: row.id})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.listPage();
          })
      }).catch(() => {

      })
    },
    handleAssignedOrg(row) {

    }
  }
}
</script>

<style lang="scss">

</style>
