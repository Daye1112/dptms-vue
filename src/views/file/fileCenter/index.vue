<template>
  <div class="app-container">
    文件管理-介绍
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves'
import PopTransfer from '@/components/PopTransfer'

export default {
  name: "Index",
  components: {Pagination, PopTransfer},
  directives: {waves, elDragDialog},
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
