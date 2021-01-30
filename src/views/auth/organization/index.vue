<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orgName" placeholder="组织名称"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.orgCode" placeholder="组织编号"
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
      <el-table-column label="组织名称" prop="orgName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.orgName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织编号" prop="orgCode" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.orgCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="mtime" min-width="130" align="center">
        <template slot-scope="{row}">
          <span>{{row.mtime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
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
        label-width="80px"
      >
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="temp.orgName"/>
        </el-form-item>
        <el-form-item label="组织编号" prop="orgCode">
          <el-input v-model="temp.orgCode"/>
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
  name: "Organization",
  components: {Pagination},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        orgName: '',
        orgCode: ''
      },
      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        update: '修改组织',
        create: '添加组织'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        orgName: [{required: true, message: '请输入组织名称', trigger: 'blur'}],
        orgCode: [{required: true, message: '请输入组织编号', trigger: 'blur'}]
      },
      temp: {
        id: '',
        orgName: '',
        orgCode: ''
      }
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      request.get("/auth/organization/listPage", this.listQuery)
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
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      });
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/auth/organization/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '组织添加成功'
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
          request.post("/auth/organization/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '组织更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/auth/organization/deleteById", {id: row.id})
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
  }
}
</script>

<style lang="scss" scoped>

</style>
