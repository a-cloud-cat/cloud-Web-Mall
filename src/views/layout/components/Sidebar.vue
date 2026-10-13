<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const router = useRouter()

const menus = [
  { path: '/home', title: '首页', icon: House },
]

const activeMenu = computed(() => router.currentRoute.value.path)

const handleSelect = (index) => {
  router.push(index)
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
  </el-aside>
</template>

<style scoped>
.sidebar {
  background-color: #304156;
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
