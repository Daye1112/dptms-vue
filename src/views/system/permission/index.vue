<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.perGroup"
        size="small"
        style="width: 200px"
        class="filter-item"
        placeholder="权限组"
        @change="handleFilter"
      >
        <el-option key="全部" label="全部" value=""/>
        <el-option v-for="item in groupList" :key="item.perGroup" :label="item.perGroup" :value="item.perGroup"/>
      </el-select>
      <el-input v-model="listQuery.perName" placeholder="权限名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.perCode" placeholder="权限码"
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
      <el-table-column label="权限名称" prop="perName" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.perName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限码" prop="perCode" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.perCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限组" prop="perGroup" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.perGroup}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限url" prop="perUrl" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.perUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button round size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button round size="mini" type="danger" @click="handleDelete(row,$index)">
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
        label-width="70px"
      >
        <el-form-item label="权限组" prop="perGroup">
          <el-autocomplete
            v-model="temp.perGroup"
            :style="{width: '100%'}"
            :fetch-suggestions="querySearch"
          />
        </el-form-item>
        <el-form-item label="权限名" prop="perName">
          <el-input v-model="temp.perName"/>
        </el-form-item>
        <el-form-item label="权限码" prop="perCode">
          <el-input v-model="temp.perCode"/>
        </el-form-item>
        <el-form-item label="权限url" prop="perUrl">
          <el-input v-model="temp.perUrl"/>
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
import {mapGetters} from 'vuex'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'

export default {
  name: "Permission",
  components: {Pagination},
  directives: {waves, elDragDialog},
  computed: {
    ...mapGetters([])
  },
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        perName: '',
        perCode: '',
        perGroup: '',
        perUrl: '',
      },
      list: [],
      total: 0,
      listLoading: false,
      dialogStatus: '',
      textMap: {
        update: '修改权限',
        create: '添加权限'
      },
      temp: {
        id: '',
        perName: '',
        perCode: '',
        perGroup: '',
        perUrl: ''
      },
      groupList: [],
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
    this.listGroup();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      request.get("/system-manage/sys/permission/listPage", this.listQuery)
        .then(response => {
          const {content, total} = response.data;
          this.list = content;
          this.total = total;
          this.listLoading = false;
        });
    },
    listGroup() {
      request.get("/system-manage/sys/permission/listGroup")
        .then(response => {
          this.groupList = response.data;
        });
    },
    setPagination() {
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          request.post("/system-manage/sys/permission/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '权限添加成功'
              })
              this.listPage();
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.listPage();
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
          request.post("/system-manage/sys/permission/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '权限更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        request.get("/system-manage/sys/permission/deleteById", {id: row.id})
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
    querySearch(queryString, cb) {
      const rightsList = this.groupList.map(item => ({value: item.perGroup}));
      const queryExp = new RegExp(queryString);
      var results = queryString ? rightsList.filter(item => queryExp.test(item.value)) : rightsList;
      return cb(results);
    },
  }
}
</script>

<style scoped>

</style>
