<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const menus = [
  { path: '/home', title: '首页', icon: House },
]

const activeMenu = computed(() => route.path)

const handleSelect = (index) => {
  router.push(index)
}

const goLogin = () => {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}
</script>

<template>
  <el-aside width="210px" class="sidebar">
    <div class="logo">Cloud Mall</div>
    <el-menu
      :default-active="activeMenu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
      @select="handleSelect"
    >
      <el-menu-item
        v-for="menu in menus"
        :key="menu.path"
        :index="menu.path"
      >
        <el-icon><component :is="menu.icon" /></el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </el-menu>
    <div class="login-entry" @click="goLogin">
      <el-icon><User /></el-icon>
      <span>登录</span>
    </div>
  </el-aside>
</template>

<style scoped>
.sidebar {
  background-color: #304156;
  display: flex;
  flex-direction: column;
}

.sidebar .el-menu {
  flex: 1;
}

.login-entry {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #bfcbd9;
  cursor: pointer;
  border-top: 1px solid #1f2d3d;
}

.login-entry:hover {
  color: #409eff;
  background-color: #263445;
}

.logo {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #263445;
  letter-spacing: 2px;
}
</style>
