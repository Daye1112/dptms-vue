<template>
  <app-main :keepAliveList="keepAliveList"/>
</template>

<script>
import AppMain from '@/components/common/AppMain'

export default {
  name: "Main",
  components: {
    AppMain
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
