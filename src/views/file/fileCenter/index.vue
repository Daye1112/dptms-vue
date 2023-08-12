<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.fileName" placeholder="请输入文件名"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <!--<el-button round size="small" class="filter-item fr"-->
      <!--type="danger" icon="el-icon-delete"-->
      <!--v-permission="['SYS_USER_ADD']"-->
      <!--@click="">-->
      <!--删除-->
      <!--</el-button>-->
      <!--<el-button round size="small" class="filter-item fr"-->
      <!--type="info" icon="el-icon-upload"-->
      <!--v-permission="['SYS_USER_ADD']"-->
      <!--@click="handleFileUploadList">-->
      <!--上传列表-->
      <!--</el-button>-->
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-folder-add"
                 v-permission="['FILE_CENTER_INSERT']"
                 @click="handleAdd()">
        创建文件夹
      </el-button>
      <el-upload
        class="filter-item fr upload-info"
        ref="upload"
        :multiple="false"
        action="void"
        :http-request="customUpload"
        :show-file-list="false"
        :auto-upload="true">
        <el-button round slot="trigger"
                   size="small" type="success"
                   v-permission="['FILE_CENTER_INSERT']"
                   icon="el-icon-upload2">
          上传
        </el-button>
      </el-upload>
    </div>
    <!--文件区-->
    <el-table
      ref="fileTable"
      v-loading="listLoading"
      :data="fileList"
      fit
      style="width: 100%"
      size="mini"
      class="file-table"
      :height="tableHeight"
      @row-contextmenu="rightClick"
      @row-dblclick="handleDbclick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        class="table-selection-cell"
        type="selection"
        width="55"
      />
      <el-table-column label="文件名" prop="fileName" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.fileName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="fileType" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{row.fileType === 1 ? '文件' : '文件夹'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" prop="fileSize" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{row.fileType === 1 ? (row.fileSizeStr || '0 KB') : (row.fileSizeCountStr || '0 KB')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" prop="creatorName" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{row.creatorName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="mtime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{row.mtime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="info"
                     v-if="row.fileType === 1"
                     v-permission="['FILE_CENTER_DOWNLOAD']"
                     @click="downloadFile(row)">
            下载
          </el-button>
          <el-button size="mini" type="info"
                     v-if="row.fileType === 1"
                     v-permission="['FILE_CENTER_VIEW']"
                     @click="viewFile(row)">
            预览
          </el-button>
          <el-button size="mini" type="primary"
                     v-permission="['FILE_CENTER_UPDATE']"
                     @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger"
                     v-permission="['FILE_CENTER_DELETE']"
                     @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="file-upload-list" v-show="showFileUploadList">
      1111
    </div>
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
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="temp.fileName"/>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDesc">
          <el-input v-model="temp.fileDesc"/>
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
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'
import PopTransfer from '@/components/PopTransfer'
import {fileUpload} from "@/utils/file"

export default {
  name: "FileCenter",
  components: {Pagination, PopTransfer},
  directives: {waves, elDragDialog},
  computed: {
    tableHeight() {
      return window.innerHeight - 126
    },
  },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      listQuery: {
        fileName: '',
        parentId: 0,
        filePath: ['0']
      },
      uploadFileList: [],
      listLoading: false,
      fileList: [],
      currentRowData: {},
      multipleSelection: [],
      showFileUploadList: false,
      temp: {
        orgId: '',
        fileName: '',
        fileDesc: '',
        fileType: '',
        fileParentId: '',
        fileParentPath: '',
        fileOrder: '',
        fileId: '',
        remark: ''
      },
      dialogStatus: '',
      textMap: {
        update: '修改文件/文件夹',
        create: '创建文件夹'
      },
      dialogFormVisible: false,
      rules: {
        fileName: [{required: true, message: '请输入应用编号', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.listPage();
  },
  methods: {
    listPage() {
      this.listLoading = true;
      this.$request.get("/file-manage/fileCenter/list", this.listQuery)
        .then(response => {
          this.fileList = response.data;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listPage();
    },
    customUpload(file) {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.uploadFileList.push(file);
      fileUpload(file.file, (progressEvent) => {
        let num = progressEvent.loaded / progressEvent.total * 100 | 0;
        num = num > 95 ? 95 : num;
        file.process = num;
      }).then(response => {
        let fileInfo = response;
        _this.temp.orgId = 1;
        _this.temp.fileName = fileInfo.fileName;
        _this.temp.fileType = 1;
        _this.temp.fileParentId = _this.listQuery.parentId;
        _this.temp.fileParentPath = _this.listQuery.filePath.join("/");
        _this.temp.fileId = fileInfo.id;
        _this.$request.post("/file-manage/fileCenter/insert", _this.temp)
          .then(response => {
            _this.$message({
              type: 'success',
              message: '文件上传成功'
            })
            _this.listPage();
            file.process = 100;
          })
      });
    },
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      // 当前组织id
      this.temp.orgId = 1;
      this.temp.fileType = 2;
      this.temp.fileParentId = this.listQuery.parentId;
      this.temp.fileParentPath = this.listQuery.filePath.join("/");
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      });
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$request.post("/file-manage/fileCenter/insert", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '文件夹创建成功'
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
          this.$request.post("/file-manage/fileCenter/update", this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '文件/文件夹更新成功'
              });
              this.listPage();
              this.dialogFormVisible = false;
            })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该文件/文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$request.get("/file-manage/fileCenter/deleteById", {id: row.id})
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
    // 下载文件
    downloadFile(row) {
      let a = document.createElement('a')
      a.download = row.fileName
      a.style.display = 'none'
      const fileUrl = this.baseApi + '/file-manage/file/download' + '?fileId=' + row.fileId
      a.href = fileUrl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    // 预览文件
    viewFile(row) {
      window.open(
        this.baseApi + '/file-manage/file/view' + '?fileId=' + row.fileId,
        '_blank'
      );
    },
    handleFileUploadList() {
      this.showFileUploadList = !this.showFileUploadList;
    },
    // 右键事件
    rightClick(row, column, event) {
      this.currentRowData = row;
    },
    // 监听行双击事件
    handleDbclick(row, column, event) {
      // const { fileType, fileId, fileName } = row;
      // // 1. 判断是否是文件夹
      // if (fileType === 2) {
      //   // 2. 是，进入文件夹
      //   this.fileParentId = fileId;
      //   this.getFileList()
      //     .then(() => {
      //       // 3. 添加导航
      //       this.navList.push({ fileId, fileName })
      //     })
      // }
    },
    // 行选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  }
}
</script>

<style lang="scss" scoped>
  .file-upload-list {
    width: 600px;
    position: absolute;
    border: 1px solid #f0f0f0;
    box-shadow: 4px -4px 13px 0 rgb(213, 217, 220);
    border-radius: 2px;
    z-index: 120;
  }
</style>
