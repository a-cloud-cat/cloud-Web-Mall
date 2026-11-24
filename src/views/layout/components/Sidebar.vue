<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  House, User, UserFilled, Goods, GoodsFilled, Folder, Avatar, Menu, List,
  ShoppingCart, Search, SwitchButton,
} from '@element-plus/icons-vue'
import { getToken, getUsername, clearAuth } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const username = ref('')

const refreshAuth = () => {
  isLoggedIn.value = !!getToken()
  username.value = getUsername() || ''
}
onMounted(refreshAuth)

const menus = [
  { path: '/home', title: '首页', icon: House },
]

const pmsMenus = [
  { path: '/pms/product', title: '商品列表', icon: Goods },
  { path: '/pms/brand', title: '品牌管理', icon: GoodsFilled },
  { path: '/pms/category', title: '商品分类', icon: Folder },
]

const umsMenus = [
  { path: '/ums/admin', title: '管理员', icon: UserFilled },
  { path: '/ums/role', title: '角色', icon: Avatar },
  { path: '/ums/menu', title: '菜单', icon: Menu },
]

const omsMenus = [
  { path: '/oms/order', title: '订单列表', icon: List },
]

// C 端体验页：匿名可访问，不登录也能点
const shopMenus = [
  { path: '/shop/buy', title: '模拟购买', icon: ShoppingCart },
  { path: '/shop/query', title: '按单号查单', icon: Search },
]

const activeMenu = computed(() => route.path)

const handleSelect = (index) => {
  router.push(index)
}

const goLogin = () => {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    .then(() => {
      clearAuth()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
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
      <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="menu.icon" /></el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>

      <el-sub-menu index="pms">
        <template #title>
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </template>
        <el-menu-item v-for="menu in pmsMenus" :key="menu.path" :index="menu.path">
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="ums">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item v-for="menu in umsMenus" :key="menu.path" :index="menu.path">
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="oms">
        <template #title>
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item v-for="menu in omsMenus" :key="menu.path" :index="menu.path">
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="shop">
        <template #title>
          <el-icon><ShoppingCart /></el-icon>
          <span>购买中心</span>
        </template>
        <el-menu-item v-for="menu in shopMenus" :key="menu.path" :index="menu.path">
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 已登录：显示用户名 + 退出 -->
    <div v-if="isLoggedIn" class="login-entry logged" @click="handleLogout">
      <el-icon><UserFilled /></el-icon>
      <span class="username">{{ username || '已登录' }}</span>
      <el-icon class="logout-icon"><SwitchButton /></el-icon>
    </div>
    <!-- 未登录：显示登录入口 -->
    <div v-else class="login-entry" @click="goLogin">
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
  border-right: none;
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
.login-entry.logged .username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logout-icon {
  font-size: 14px;
  opacity: 0.7;
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
