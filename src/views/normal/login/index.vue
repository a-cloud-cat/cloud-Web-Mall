<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/apis/user'
import { setToken } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

// 仅允许站内绝对路径，防止 redirect 被构造成外链造成开放重定向
const getRedirectTarget = () => {
  const redirect = route.query.redirect
  if (
    typeof redirect === 'string'
    && redirect.startsWith('/')
    && !redirect.startsWith('//')
  ) {
    return redirect
  }
  return '/home'
}

const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await login({ ...form })
      if (res.data?.token) {
        setToken(res.data.token)
      }
      ElMessage.success('登录成功')
      router.push(getRedirectTarget())
    } catch {
      // 失败提示已由 request 拦截器统一处理
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <div class="login-title">Cloud Mall 后台管理</div>
      <div class="login-subtitle">欢迎登录</div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #304156 0%, #409eff 100%);
}

.login-card {
  width: 400px;
  border-radius: 8px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #303133;
}

.login-subtitle {
  text-align: center;
  font-size: 14px;
  color: #909399;
  margin: 8px 0 24px;
}

.login-button {
  width: 100%;
}
</style>
