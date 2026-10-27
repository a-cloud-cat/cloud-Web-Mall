<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page-404">
    <el-result icon="warning" title="404" sub-title="抱歉，你访问的页面不存在">
      <template #extra>
        <el-button type="primary" @click="router.push('/home')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.page-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
