<template>
  <el-container>
    <el-container>
      <el-main>
        <keep-alive :include="keepAliveList">
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "SideLeftMenu",
    props: ['keepAliveList']
  }
</script>

<style scoped>

</style>
