import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken, clearAuth, getMemberToken, clearMemberAuth } from '@/utils/auth'

// 走 vite 代理转发，规避浏览器跨域
const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/c/')) {
      // C 端：带会员 token（与管理员 token 分开）
      const memberToken = getMemberToken()
      if (memberToken) {
        config.headers.Authorization = memberToken
      }
    } else {
      // B 端：带管理员 token
      const token = getToken()
      if (token) {
        config.headers.Authorization = token
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 防止多个并发 401 重复跳登录
let isRedirecting = false

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    const url = error.config?.url || ''
    if (error.response?.status === 401) {
      if (url.startsWith('/c/')) {
        // C 端 401：清会员登录态，不跳管理员登录页
        clearMemberAuth()
      } else if (!url.includes('/auth/login')) {
        clearAuth()
        if (!isRedirecting) {
          isRedirecting = true
          ElMessage.warning('登录已过期，请重新登录')
          router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } }).finally(() => {
            isRedirecting = false
          })
        }
      }
      return Promise.reject(error)
    }
    ElMessage.error(error.message || '网络异常')
    return Promise.reject(error)
  },
)

export default request
