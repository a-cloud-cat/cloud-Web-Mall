<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getOrderBySn } from '@/apis/order'

const orderSn = ref('')
const loading = ref(false)
const result = ref(null)
const error = ref('')

const statusMap = {
  0: { text: '待发货', type: 'warning' },
  1: { text: '已发货', type: 'primary' },
  2: { text: '已完成', type: 'success' },
  3: { text: '已关闭', type: 'info' },
}

const handleQuery = async () => {
  if (!orderSn.value.trim()) {
    error.value = '请输入订单号'
    result.value = null
    return
  }
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await getOrderBySn(orderSn.value.trim())
    result.value = res.data
  } catch {
    error.value = '订单不存在或查询失败'
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  orderSn.value = ''
  result.value = null
  error.value = ''
}
</script>

<template>
  <div class="shop-page">
    <h2 class="page-title">🔍 按单号查单</h2>
    <p class="page-desc">C 端用户凭订单号找回订单</p>

    <div class="query-bar">
      <el-input
        v-model="orderSn"
        placeholder="请输入订单号"
        clearable
        size="large"
        style="max-width: 400px"
        @keyup.enter="handleQuery"
      />
      <el-button type="primary" size="large" :icon="Search" :loading="loading" @click="handleQuery">
        查询
      </el-button>
      <el-button size="large" @click="handleReset">重置</el-button>
    </div>

    <div v-if="error" class="error-box">{{ error }}</div>

    <div v-if="result" class="result-box">
      <el-descriptions title="订单信息" :column="2" border>
        <el-descriptions-item label="订单号">{{ result.order.orderSn }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusMap[result.order.status]?.type || 'info'">
            {{ statusMap[result.order.status]?.text || '未知' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下单用户">{{ result.order.memberUsername }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ result.order.createTime }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          <b style="color: #f56c6c">￥{{ result.order.totalAmount }}</b>
        </el-descriptions-item>
        <el-descriptions-item label="实付金额">￥{{ result.order.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="收货人">{{ result.order.receiverName }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ result.order.receiverPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ result.order.receiverAddress }}</el-descriptions-item>
        <el-descriptions-item label="物流公司" v-if="result.order.deliveryCompany">
          {{ result.order.deliveryCompany }}
        </el-descriptions-item>
        <el-descriptions-item label="物流单号" v-if="result.order.deliverySn">
          {{ result.order.deliverySn }}
        </el-descriptions-item>
      </el-descriptions>

      <h3 class="section-title">商品明细</h3>
      <el-table :data="result.itemList" border stripe>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="productPrice" label="单价" width="120" />
        <el-table-column prop="productQuantity" label="数量" width="80" />
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            ￥{{ (row.productPrice * row.productQuantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="!loading && !result && !error" class="empty-hint">
      💡 提示：下单成功后系统会返回订单号，或者到后台「订单列表」也能找到
    </div>
  </div>
</template>

<style scoped>
.shop-page {
  padding: 20px;
}
.page-title {
  margin: 0 0 4px;
  font-size: 22px;
  color: #303133;
}
.page-desc {
  margin: 0 0 20px;
  color: #909399;
  font-size: 14px;
}
.query-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}
.error-box {
  padding: 12px 16px;
  background: #fef0f0;
  border-radius: 6px;
  color: #f56c6c;
  margin-bottom: 16px;
}
.result-box {
  max-width: 900px;
}
.section-title {
  margin: 24px 0 12px;
  font-size: 16px;
  color: #303133;
}
.empty-hint {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 6px;
  color: #606266;
  font-size: 14px;
  max-width: 500px;
}
</style>
