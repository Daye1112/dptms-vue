<template style="width: 100%">
</template>

<script>
import iFrame from '@/components/iFrame'

export default {
  name: "ApiDoc",
  components: {iFrame},
  data() {
    return {
      env: process.env.NODE_ENV
    }
  },
  created() {
    if (this.env === 'development') {
      window.open('http://localhost:9006/sba-manage/login', "_blank");
    } else if (this.env === 'production') {
      window.open('http://www.mrdarren.cn/sba-manage/login', "_blank");
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
