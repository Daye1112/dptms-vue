<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.researchKey" placeholder="请输入应用编号或应用名称"
                size="small" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button round size="small" class="filter-item"
                 type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import elDragDialog from '@/directive/el-drag-dialog'
  import waves from '@/directive/waves'

  export default {
    name: "Release",
    components: {Pagination},
    directives: {waves, elDragDialog},
    data() {
      return {
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          researchKey: ''
        },
      }
    },
    created() {
    },
    methods: {
      handleFilter() {

      }
    }
  }
</script>

<style lang="scss">

</style>
