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
      <el-button round size="small" class="filter-item fr"
                 type="danger" icon="el-icon-delete"
                 v-permission="['SYS_USER_ADD']"
                 @click="">
        删除
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="info" icon="el-icon-upload"
                 v-permission="['SYS_USER_ADD']"
                 @click="handleFileUploadList">
        上传列表
      </el-button>
      <el-button round size="small" class="filter-item fr"
                 type="success" icon="el-icon-folder-add"
                 v-permission="['SYS_USER_ADD']"
                 @click="">
        添加文件夹
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
                   v-permission="['SYS_USER_ADD']"
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
      <el-table-column label="大小" prop="fileSize" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{row.fileSize || '--'}}</span>
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
      <el-table-column label="操作" align="center" min-width="90" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="info"
                     v-permission="['SYS_USER_ASSIGNED_ROLE']"
                     @click="">
            下载
          </el-button>
          <el-button size="mini" type="primary"
                     v-permission="['SYS_USER_ASSIGNED_ROLE']"
                     @click="">
            修改
          </el-button>
          <el-button size="mini" type="danger"
                     v-permission="['SYS_USER_DELETE']"
                     @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="file-upload-list" v-show="showFileUploadList">
      1111
    </div>
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
      listQuery: {
        fileName: '',
        parentId: 0
      },
      uploadFileList: [],
      listLoading: false,
      fileList: [],
      currentRowData: {},
      multipleSelection: [],
      showFileUploadList: false
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
    customUpload(file) {
      this.uploadFileList.push(file);
      fileUpload(file.file, (progressEvent) => {
        let num = progressEvent.loaded / progressEvent.total * 100 | 0;
        num = num > 95 ? 95 : num;
        file.process = num;
      }).then(response => {
        file.process = 100;
      });
    },
    handleFilter() {
      this.listPage();
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
