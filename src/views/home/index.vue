<script setup>
import { ShoppingCart } from '@element-plus/icons-vue'

// TODO: 后续替换为接口数据，这里仅作硬编码示例
const statCards = [
  { title: '今日订单总数', value: 200, icon: ShoppingCart, color: '#409EFF' },
]
</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col v-for="card in statCards" :key="card.title" :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value" :style="{ color: card.color }">{{ card.value }}</div>
            </div>
            <el-icon :size="48" :style="{ color: card.color }">
              <component :is="card.icon" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
}
</style>
