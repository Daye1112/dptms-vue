<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyPrefix" placeholder="请输入缓存前缀"
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
      <el-table-column label="键" prop="key" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.key}}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="value" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间(s)" prop="expired" min-width="40" align="center">
        <template slot-scope="{row}">
          <span>{{row.expired}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="info" @click="handleView(row)">
            查看
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
        label-width="90px"
      >
        <el-form-item label="键" prop="key">
          <el-input :disabled="dialogStatus !== 'create'" v-model="temp.key"/>
        </el-form-item>
        <el-form-item label="值" prop="valueJson">
          <json-editor :disabled="dialogStatus === 'view'" v-model="temp.valueJson"/>
        </el-form-item>
        <el-form-item label="有效期(s)" prop="expired">
          <el-input :disabled="dialogStatus === 'view'" v-model="temp.expired"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button round size="medium" type="primary"
                   @click="dialogStatus === 'create'? add() : dialogFormVisible = false">
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
import JsonEditor from '@/components/JsonEditor'
import {formatJson, parseJson} from "@/utils/common"

export default {
  name: "Cache",
  components: {Pagination, JsonEditor},
  directives: {waves, elDragDialog},
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        keyPrefix: ''
      },
      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        create: '添加缓存',
        view: '查看详情'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        key: '',
        value: '',
        expired: '',
        valueJson: ''
      },
      rules: {
        key: [{required: true, message: '请输入键', trigger: 'blur'}],
        valueJson: [{required: true, message: '请输入值', trigger: 'blur'}],
        expired: [{required: true, message: '请输入有效期', trigger: 'blur'}]
      }
    }
  },
  created() {
  },
  methods: {
    setPagination() {
      this.listPage();
    },
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/cache/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
        }).catch((err) => {
        //对异常进行处理
      });
      this.listLoading = false;
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    add() {
      this.temp.value = formatJson(this.temp.valueJson);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/cache/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '缓存添加成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleView(row) {
      this.temp = Object.assign({}, row);
      this.temp.valueJson = parseJson(this.temp.value);
      this.dialogStatus = 'view';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/cache/deleteByKey", {key: row.key})
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

<style lang="scss">
  .json-editor {
    height: 200px !important;

    .CodeMirror {
      min-height: 200px !important;
      height: 200px !important;
    }

    .CodeMirror-scroll {
      min-height: 200px !important;
      height: 200px !important;
    }
  }
</style>
