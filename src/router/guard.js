import router from './index'
import { getToken } from '@/utils/auth'

// 白名单：无需登录即可访问的路由
const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  const hasToken = !!getToken()

  if (hasToken) {
    // 已登录再去登录页，直接回首页
    if (to.path === '/login') {
      next('/home')
    } else {
      next()
    }
  } else {
    // 未登录：白名单放行，否则跳登录并带回跳地址
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})
