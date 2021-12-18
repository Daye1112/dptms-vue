<template>
  <div class="app-container">
    <el-upload
      class="upload-demo"
      ref="upload"
      :multiple="false"
      action="void"
      :http-request="customUpload"
      :on-remove="handleRemove"
      :on-progress="getProgress"
      :file-list="fileList"
      multiple
      :auto-upload="true">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
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
  data() {
    return {
      fileList: []
    }
  },
  created() {
  },
  methods: {
    customUpload(file) {
      fileUpload(file.file, (progressEvent) => {
        let num = progressEvent.loaded / progressEvent.total * 100 | 0;
        num = num > 95 ? 95 : num;
        file.onProgress({percent: num});
      }).then(response => {
        file.onProgress({percent: 100});
        file.onSuccess();
      })
    },
    getProgress() {

    },
    handleRemove() {

    }
  }
}
</script>

<style scoped>

</style>
