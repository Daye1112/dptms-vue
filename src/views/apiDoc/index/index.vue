<template style="width: 100%">
  <!--<div class="app-container">-->
  <i-frame :src="baseApi" :width="'100%'"/>
  <!--</div>-->
</template>

<script>
import iFrame from '@/components/iFrame'

export default {
  name: "ApiDoc",
  components: {iFrame},
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API + '/doc.html'
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
