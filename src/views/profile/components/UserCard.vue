<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <el-link type="primary" class="change-avatar" @click="dialogVisible = true">
            更换头像
          </el-link>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.realName }}</div>
        <div class="user-role text-center text-muted">
          <span>暂未开发</span>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <el-icon class="el-icon-tickets"/>
          <span>个人描述</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            暂未开发
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <el-icon class="el-icon-connection"/>
          <span>{{ $t('table.user.social') }}</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <template v-for="(l, index) in logo">
              <div :key="index" class="logo-wrapper">
                <img v-if="l.bind" :src="resolveLogo(l.img)" :class="{ 'radius': l.radius }" alt=""
                     :title="$t('common.unbind')" @click="unbind(l.name)">
                <img v-else :src="resolveLogo(l.img)" :class="{ 'radius': l.radius }" alt="" :title="$t('common.bind')"
                     class="unbind" @click="bind(l.name)">
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <avatar
      :dialog-visible="dialogVisible"
      @close="dialogVisible = false"
      @success="changeSuccess"
    />
  </el-card>
</template>

<script>

import PanThumb from '@/components/PanThumb'

export default {
  name: "UserCard",
  components: {PanThumb},
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      page: {
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.5
      }
    }
  },
}
</script>

<style scoped>

</style>
