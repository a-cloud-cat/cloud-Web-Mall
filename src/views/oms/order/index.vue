<script setup>
import { ref, onMounted } from 'vue'
import { Search, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, getOrder, deleteOrder } from '@/apis/order'

const query = ref({
  pageNum: 1,
  pageSize: 10,
  status: null,
})

const list = ref([])
const total = ref(0)
const loading = ref(false)

const detailVisible = ref(false)
const detail = ref({ order: {}, itemList: [] })

const statusMap = {
  0: { text: '待付款', type: 'warning' },
  1: { text: '待发货', type: 'primary' },
  2: { text: '已发货', type: 'success' },
  3: { text: '已完成', type: 'success' },
  4: { text: '已关闭', type: 'info' },
}

const getList = async () => {
  loading.value = true
  try {
    const res = await getOrderList(query.value)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.value.pageNum = 1
  getList()
}

const handleReset = () => {
  query.value = { pageNum: 1, pageSize: 10, status: null }
  getList()
}

const handlePageChange = (val) => {
  query.value.pageNum = val
  getList()
}

const handleSizeChange = (val) => {
  query.value.pageNum = 1
  query.value.pageSize = val
  getList()
}

const handleView = async (row) => {
  const res = await getOrder(row.id)
  detail.value = res.data
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除订单「${row.orderSn}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await deleteOrder(row.id)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

onMounted(getList)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="订单状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="(item, key) in statusMap" :key="key" :label="item.text" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="orderSn" label="订单号" width="180" />
        <el-table-column prop="memberUsername" label="用户账号" width="120" />
        <el-table-column label="总金额" width="120">
          <template #default="{ row }">￥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="实付金额" width="120">
          <template #default="{ row }">￥{{ row.payAmount }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="100">
          <template #default="{ row }">
            {{ ['未支付', '支付宝', '微信'][row.payType] || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type || 'info'">
              {{ statusMap[row.status]?.text || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiverName" label="收货人" width="100" />
        <el-table-column prop="createTime" label="下单时间" width="180">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.slice(0, 19) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">详情</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50]"
          v-model:current-page="query.pageNum"
          v-model:page-size="query.pageSize"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <el-descriptions :column="2" border v-if="detail.order">
        <el-descriptions-item label="订单号">{{ detail.order.orderSn }}</el-descriptions-item>
        <el-descriptions-item label="用户账号">{{ detail.order.memberUsername }}</el-descriptions-item>
        <el-descriptions-item label="总金额">￥{{ detail.order.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">￥{{ detail.order.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ ['未支付', '支付宝', '微信'][detail.order.payType] || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ statusMap[detail.order.status]?.text || '未知' }}
        </el-descriptions-item>
        <el-descriptions-item label="收货人">{{ detail.order.receiverName }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ detail.order.receiverPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ detail.order.receiverAddress }}</el-descriptions-item>
        <el-descriptions-item label="物流公司">{{ detail.order.deliveryCompany }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ detail.order.deliverySn }}</el-descriptions-item>
        <el-descriptions-item label="下单时间" :span="2">{{ detail.order.createTime }}</el-descriptions-item>
      </el-descriptions>

      <div class="item-title">商品明细</div>
      <el-table :data="detail.itemList" border stripe size="small">
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="productPrice" label="单价" width="100" />
        <el-table-column prop="productQuantity" label="数量" width="80" />
        <el-table-column prop="productSn" label="货号" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.app-container {
  padding: 16px;
}
.filter-card {
  margin-bottom: 16px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.item-title {
  margin: 20px 0 10px;
  font-weight: bold;
  font-size: 16px;
}
</style>
