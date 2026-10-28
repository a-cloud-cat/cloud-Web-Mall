import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

export const constantRoutes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/normal/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'House' },
      },
      {
        path: 'pms/product',
        name: 'pmsProduct',
        component: () => import('@/views/pms/product/index.vue'),
        meta: { title: '商品列表', icon: 'Goods' },
      },
      {
        path: 'pms/brand',
        name: 'pmsBrand',
        component: () => import('@/views/pms/brand/index.vue'),
        meta: { title: '品牌管理', icon: 'GoodsFilled' },
      },
      {
        path: 'ums/admin',
        name: 'umsAdmin',
        component: () => import('@/views/ums/admin/index.vue'),
        meta: { title: '管理员', icon: 'UserFilled' },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/normal/404/index.vue'),
    meta: { title: '404' },
  },
  // 通配路由放最后，匹配不到的路径走 404
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
