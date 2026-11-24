<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { getProductList } from '@/apis/product'
import { createOrder } from '@/apis/order'

const loading = ref(false)
const products = ref([])

// 购买弹窗
const buyVisible = ref(false)
const buyLoading = ref(false)
const currentProduct = ref(null)
const form = ref({
  productId: null,
  quantity: 1,
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
})
const buyResult = ref(null)

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProductList({ pageNum: 1, pageSize: 20 })
    products.value = res.data.list || []
  } finally {
    loading.value = false
  }
}

const handleBuy = (product) => {
  currentProduct.value = product
  form.value = {
    productId: product.id,
    quantity: 1,
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  }
  buyResult.value = null
  buyVisible.value = true
}

const submitOrder = async () => {
  const f = form.value
  if (!f.receiverName || !f.receiverPhone || !f.receiverAddress) {
    ElMessage.warning('请完整填写收货人信息')
    return
  }
  if (f.quantity < 1) {
    ElMessage.warning('购买数量至少为 1')
    return
  }
  buyLoading.value = true
  try {
    const res = await createOrder({ ...f })
    buyResult.value = res.data
    ElMessage.success('下单成功！')
  } catch {
    // 失败提示已由 request 拦截器处理
  } finally {
    buyLoading.value = false
  }
}

const closeBuy = () => {
  buyVisible.value = false
  buyResult.value = null
}

onMounted(loadProducts)
</script>

<template>
  <div class="shop-page">
    <h2 class="page-title">🛒 模拟购买</h2>
    <p class="page-desc">模拟 C 端用户浏览商品并下单的完整流程</p>

    <div v-loading="loading" class="product-grid">
      <div v-for="p in products" :key="p.id" class="product-card">
        <div class="product-pic">
          <img v-if="p.pic" :src="p.pic" :alt="p.name" />
          <div v-else class="product-pic-placeholder">{{ p.name?.charAt(0) }}</div>
        </div>
        <div class="product-info">
          <div class="product-name">{{ p.name }}</div>
          <div class="product-price">￥{{ p.price }}</div>
        </div>
        <el-button type="primary" :icon="ShoppingCart" @click="handleBuy(p)">
          立即购买
        </el-button>
      </div>
    </div>

    <!-- 下单弹窗 -->
    <el-dialog v-model="buyVisible" :title="buyResult ? '下单成功' : '确认订单'" width="480px" @close="closeBuy">
      <!-- 表单状态 -->
      <template v-if="!buyResult">
        <div class="buy-product">
          <span class="buy-product-label">商品</span>
          <span class="buy-product-name">{{ currentProduct?.name }}</span>
          <span class="buy-product-price">￥{{ currentProduct?.price }}</span>
        </div>

        <el-form label-width="100px" style="margin-top: 16px">
          <el-form-item label="购买数量">
            <el-input-number v-model="form.quantity" :min="1" :max="99" />
          </el-form-item>
          <el-form-item label="收货人">
            <el-input v-model="form.receiverName" placeholder="请输入收货人姓名" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.receiverPhone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="form.receiverAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="buyVisible = false">取消</el-button>
          <el-button type="primary" :loading="buyLoading" @click="submitOrder">提交订单</el-button>
        </template>
      </template>

      <!-- 成功状态 -->
      <template v-else>
        <div class="success-box">
          <div class="success-title">🎉 下单成功！</div>
          <div class="success-item"><span>订单号：</span><code>{{ buyResult.orderSn }}</code></div>
          <div class="success-item"><span>订单状态：</span><el-tag type="warning">待发货</el-tag></div>
          <div class="success-item"><span>订单金额：</span><b>￥{{ buyResult.totalAmount }}</b></div>
          <div class="success-hint">
            登录后台 → 订单列表 → 找到该订单 → 点「发货」完成流程<br />
            或到「按单号查单」页面输入订单号查看详情
          </div>
        </div>
        <template #footer>
          <el-button @click="closeBuy">关闭</el-button>
        </template>
      </template>
    </el-dialog>
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
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: transform 0.15s, box-shadow 0.15s;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.product-pic {
  width: 180px;
  height: 180px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
.product-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-pic-placeholder {
  font-size: 64px;
  color: #c0c4cc;
  font-weight: bold;
}
.product-info {
  text-align: center;
}
.product-name {
  font-size: 15px;
  color: #303133;
  margin-bottom: 4px;
}
.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}
.buy-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}
.buy-product-label {
  color: #909399;
}
.buy-product-name {
  flex: 1;
  color: #303133;
}
.buy-product-price {
  color: #f56c6c;
  font-weight: bold;
}
.success-box {
  text-align: center;
  padding: 20px 0;
}
.success-title {
  font-size: 20px;
  color: #67c23a;
  margin-bottom: 16px;
}
.success-item {
  margin: 8px 0;
  font-size: 14px;
}
.success-item code {
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}
.success-item b {
  color: #f56c6c;
  font-size: 18px;
}
.success-hint {
  margin-top: 20px;
  padding: 12px;
  background: #ecf5ff;
  border-radius: 6px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
}
</style>
