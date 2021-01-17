<template>
  <div class="home-content">
    <el-carousel>
      <el-carousel-item v-for="item in 4" :key="item">
        <img src="../../assets/images/index_background.jpg" class="carousel_image"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      height: ''
    }
  },
  created() {
    this.height = document.documentElement.clientHeight - 60 + 'px';
  }
}
</script>

<style lang="scss" scoped>
  .home-content {
    width: 100%;
    height: 100%;
  }

  .el-carousel {
    width: 100%;
    height: 100%;
  }

  .carousel_image {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss">
  .home-content {
    width: 100%;
    height: 100%;

    .el-carousel {
      width: 100%;
      height: 100%;

      .el-carousel__container {
        width: 100%;
        height: 100%;
      }
    }

    .carousel_image {
      width: 100%;
      height: 100%;
    }
  }
</style>
