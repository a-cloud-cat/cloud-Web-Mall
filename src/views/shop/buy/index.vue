<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ShoppingCart, User, SwitchButton } from '@element-plus/icons-vue'
import { cGetProductList } from '@/apis/product'
import { cCreateOrder } from '@/apis/order'
import { memberLogin, memberRegister, memberLogout } from '@/apis/member'
import {
  getMemberToken,
  getMemberInfo,
  setMemberToken,
  setMemberInfo,
  clearMemberAuth,
} from '@/utils/auth'

const loading = ref(false)
const products = ref([])

// ===== 会员登录态 =====
const memberInfo = ref(getMemberInfo())
const loggedIn = ref(!!getMemberToken())

const authVisible = ref(false)
const authTab = ref('login')
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', nickname: '' })
const authLoading = ref(false)
// 未登录时点了提交订单 → 暂存，登录成功后自动提交
const pendingOrder = ref(null)

const refreshMember = () => {
  memberInfo.value = getMemberInfo()
  loggedIn.value = !!getMemberToken()
}

const openAuth = (tab) => {
  authTab.value = tab
  authVisible.value = true
}

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  authLoading.value = true
  try {
    const res = await memberLogin(loginForm.value)
    setMemberToken(res.data.token)
    setMemberInfo(res.data)
    refreshMember()
    ElMessage.success(`欢迎，${res.data.nickname || res.data.username}`)
    authVisible.value = false
    // 登录成功后若有待提交订单，自动下单
    if (pendingOrder.value) {
      const p = pendingOrder.value
      pendingOrder.value = null
      doSubmit(p)
    }
  } catch {
    // 错误已由拦截器提示
  } finally {
    authLoading.value = false
  }
}

const handleRegister = async () => {
  const f = registerForm.value
  if (!f.username || !f.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }
  authLoading.value = true
  try {
    await memberRegister(f)
    ElMessage.success('注册成功，请登录')
    loginForm.value = { username: f.username, password: f.password }
    authTab.value = 'login'
  } catch {
    // 错误已由拦截器提示
  } finally {
    authLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await memberLogout()
  } catch {
    // 忽略
  }
  clearMemberAuth()
  refreshMember()
  ElMessage.success('已退出会员')
}

// ===== 商品 =====
const loadProducts = async () => {
  loading.value = true
  try {
    const res = await cGetProductList({ pageNum: 1, pageSize: 20 })
    products.value = res.data.list || []
  } finally {
    loading.value = false
  }
}

// ===== 下单 =====
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

const submitOrder = () => {
  const f = form.value
  if (!f.receiverName || !f.receiverPhone || !f.receiverAddress) {
    ElMessage.warning('请完整填写收货人信息')
    return
  }
  if (f.quantity < 1) {
    ElMessage.warning('购买数量至少为 1')
    return
  }
  if (!loggedIn.value) {
    pendingOrder.value = { ...f }
    ElMessage.info('请先登录会员再下单')
    buyVisible.value = false
    openAuth('login')
    return
  }
  doSubmit(f)
}

const doSubmit = async (payload) => {
  buyVisible.value = true
  buyLoading.value = true
  try {
    const res = await cCreateOrder(payload)
    buyResult.value = res.data
    ElMessage.success('下单成功！')
  } catch {
    // 失败已由拦截器提示
  } finally {
    buyLoading.value = false
  }
}

const closeBuy = () => {
  buyVisible.value = false
  buyResult.value = null
}

onMounted(() => {
  loadProducts()
  refreshMember()
})
</script>

<template>
  <div class="shop-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">🛒 模拟购买</h2>
        <p class="page-desc">C 端用户浏览商品 → 会员登录 → 下单的完整流程</p>
      </div>
      <div class="member-bar">
        <template v-if="loggedIn">
          <el-icon><User /></el-icon>
          <span class="member-name">{{ memberInfo?.nickname || memberInfo?.username }}</span>
          <el-button text type="danger" :icon="SwitchButton" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button type="primary" link @click="openAuth('login')">登录</el-button>
          <span class="bar-sep">/</span>
          <el-button type="primary" link @click="openAuth('register')">注册</el-button>
        </template>
      </div>
    </div>

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
      <!-- 表单 -->
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

        <div v-if="!loggedIn" class="login-tip">
          ⚠️ 下单前需要先登录会员，点击「提交订单」将自动弹出登录框
        </div>
      </template>

      <!-- 成功 -->
      <template v-else>
        <div class="success-box">
          <div class="success-title">🎉 下单成功！</div>
          <div class="success-item"><span>下单会员：</span><b>{{ buyResult.memberUsername }}</b></div>
          <div class="success-item"><span>订单号：</span><code>{{ buyResult.orderSn }}</code></div>
          <div class="success-item"><span>订单状态：</span><el-tag type="warning">待发货</el-tag></div>
          <div class="success-item"><span>订单金额：</span><b>￥{{ buyResult.totalAmount }}</b></div>
          <div class="success-hint">
            登录后台 → 订单列表 → 找到该订单 → 点「发货」完成流程<br />
            或到「按单号查单」页面输入订单号查看详情
          </div>
        </div>
      </template>

      <template #footer>
        <el-button v-if="buyResult" @click="closeBuy">关闭</el-button>
        <template v-else>
          <el-button @click="buyVisible = false">取消</el-button>
          <el-button type="primary" :loading="buyLoading" @click="submitOrder">提交订单</el-button>
        </template>
      </template>
    </el-dialog>

    <!-- 会员登录 / 注册弹窗 -->
    <el-dialog v-model="authVisible" :title="authTab === 'login' ? '会员登录' : '会员注册'" width="400px">
      <el-tabs v-model="authTab">
        <el-tab-pane label="登录" name="login">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" @keyup.enter="handleLogin" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" placeholder="3-20 位" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="registerForm.nickname" placeholder="选填" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="registerForm.password" type="password" show-password placeholder="至少 3 位" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="authVisible = false">取消</el-button>
        <el-button v-if="authTab === 'login'" type="primary" :loading="authLoading" @click="handleLogin">登录</el-button>
        <el-button v-else type="primary" :loading="authLoading" @click="handleRegister">注册</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.shop-page {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.page-title {
  margin: 0 0 4px;
  font-size: 22px;
  color: #303133;
}
.page-desc {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
.member-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}
.member-name {
  color: #409eff;
  font-weight: 500;
}
.bar-sep {
  color: #dcdfe6;
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
.login-tip {
  margin-top: 8px;
  padding: 8px 12px;
  background: #fdf6ec;
  border-radius: 6px;
  color: #e6a23c;
  font-size: 13px;
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
  font-size: 16px;
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
