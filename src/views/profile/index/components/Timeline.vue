<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) of timeline"
        :key="index"
        :timestamp="item.ctime"
        placement="top">
        <el-card>
          <p>
            <el-icon class="el-icon-link"/>
            IP：{{ item.ip }}
          </p>
          <p>
            <el-icon class="el-icon-location-outline"/>
            登录地点：{{ item.ipAddress }}
          </p>
          <p>
            <el-icon class="el-icon-bangzhu"/>
            浏览器：{{ item.browser }}
          </p>
          <p>
            <el-icon class="el-icon-monitor"/>
            登录系统：{{ item.os }}
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

export default {
  name: "Timeline",
  data() {
    return {
      timeline: []
    }
  },
  mounted() {
    this.getTimeLine();
  },
  methods: {
    getTimeLine() {
      this.$request.get('/monitor-manage/loginLog/listCurrentUser')
        .then((response) => {
          this.timeline = response.data;
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card.is-always-shadow {
    box-shadow: none;
  }

  .el-card {
    border: 1px solid #f1f1f1;
    border-radius: 2px;
  }
</style>
