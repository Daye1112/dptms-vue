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
      <el-button round size="small" class="filter-item"
                 v-if="this.filePath.length > 1"
                 type="primary" @click="returnLast">
        <svg-icon icon-class="goBack"/>
        返回上级
      </el-button>
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
      @row-dblclick="handleDbclick"
    >
      <el-table-column
        class="table-selection-cell"
        type="selection"
        width="55"
      />
      <el-table-column label="文件名" prop="fileName" min-width="150" align="left">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.fileType === 1 ? 'otherFile' : 'folder'"/>
          <span>{{row.fileName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="fileType" min-width="60" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.fileType === 1 ? '' : 'warning'">
            <span>{{row.fileType === 1 ? '文件' : '文件夹'}}</span>
          </el-tag>
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
    <el-dialog
      v-el-drag-dialog
      :title="uploadTextMap[fileUploadStatus]"
      class="file-upload-process"
      :visible.sync="fileUploadVisible"
      width="30%"
    >
      <el-progress :text-inside="true"
                   :stroke-width="26"
                   :percentage="fileUploadPercent"/>
    </el-dialog>
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
import {fileDownloadBlob, fileUpload, fileView} from "@/utils/file"

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
      listQuery: {
        fileName: '',
        parentId: 0
      },
      filePath: [0],
      lastParentId: 0,
      listLoading: false,
      fileList: [],
      currentRowData: {},
      multipleSelection: [],
      temp: {
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
      fileUploadVisible: false,
      fileUploadStatus: '',
      uploadTextMap: {
        upload: '上传进度',
        download: '下载进度'
      },
      fileUploadPercent: 0
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
      this.fileUploadPercent = 0;
      this.fileUploadVisible = true;
      this.fileUploadStatus = 'upload';
      fileUpload(file.file, (progressEvent) => {
        let num = progressEvent.loaded / progressEvent.total * 100 | 0;
        this.fileUploadPercent = num > 95 ? 95 : num;
        file.process = this.fileUploadPercent;
      }).then(response => {
        let fileInfo = response;
        _this.temp.fileName = fileInfo.fileName;
        _this.temp.fileType = 1;
        _this.temp.fileParentId = _this.listQuery.parentId;
        _this.temp.fileParentPath = _this.filePath.join("/");
        _this.temp.fileId = fileInfo.id;
        _this.$request.post("/file-manage/fileCenter/insert", _this.temp)
          .then(response => {
            _this.$message({
              type: 'success',
              message: '文件上传成功'
            })
            _this.listPage();
            file.process = 100;
            this.fileUploadPercent = 100;
            this.fileUploadVisible = false;
          })
      });
    },
    handleAdd() {
      let _this = this;
      Object.getOwnPropertyNames(this.temp).forEach(function (key) {
        _this.temp[key] = '';
      });
      this.temp.fileType = 2;
      this.temp.fileParentId = this.listQuery.parentId;
      this.temp.fileParentPath = this.filePath.join("/");
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
      this.fileUploadPercent = 0;
      this.fileUploadStatus = 'download';
      this.fileUploadVisible = true;
      this.$request.download('/file-manage/file/download', {fileId: row.fileId}, (progressEvent) => {
        let num = progressEvent.loaded / progressEvent.total * 100 | 0;
        this.fileUploadPercent = num > 95 ? 95 : num;
      }).then(response => {
        fileDownloadBlob(response, row.fileName);
        this.fileUploadPercent = 100;
        this.fileUploadVisible = false;
      }).catch(() => {

      })
    },
    // 预览文件
    viewFile(row) {
      fileView(row.fileId);
    },
    // 监听行双击事件
    handleDbclick(row, column, event) {
      const {id, fileType} = row;
      // 判断是否是文件夹
      if (fileType === 2) {
        this.lastParentId = this.listQuery.parentId;
        this.filePath.push(id);
        this.listQuery.parentId = id;
        this.listPage();
      }
    },
    // 返回上级
    returnLast() {
      if (this.filePath.length === 1) {
        return;
      }
      this.filePath.pop();
      let filePathLength = this.filePath.length;
      this.listQuery.parentId = this.filePath[filePathLength - 1];
      this.lastParentId = this.filePath[filePathLength === 1 ? filePathLength - 1 : filePathLength - 2];
      this.listPage();
    }
  }
}
</script>

<style lang="scss" scoped>
  .file-upload-process /deep/ .el-progress-bar__innerText {
    color: black;
  }
</style>
