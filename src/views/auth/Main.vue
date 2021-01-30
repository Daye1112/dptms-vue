<template>
  <side-left-menu :keepAliveList="keepAliveList"/>
</template>

<script>
  import SideLeftMenu from '@/components/common/SideLeftMenu'

  export default {
    name: "Main",
    components: {
      SideLeftMenu
    },
    data() {
      return {
        keepAliveList: ''
      }
    }
  }
</script>

<style scoped>

</style>
