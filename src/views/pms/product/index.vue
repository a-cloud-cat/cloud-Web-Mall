<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductList, createProduct, updateProduct, deleteProduct } from '@/apis/product'
import { getBrandListAll } from '@/apis/brand'

const query = ref({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
})

const list = ref([])
const total = ref(0)
const loading = ref(false)
const brandOptions = ref([])

const dialogVisible = ref(false)
const dialogTitle = ref('新增商品')
const form = reactive({
  id: null,
  brandId: null,
  brandName: '',
  name: '',
  pic: '',
  productSn: '',
  price: 0,
  sale: 0,
  publishStatus: 1,
})

const resetForm = () => {
  Object.assign(form, {
    id: null,
    brandId: null,
    brandName: '',
    name: '',
    pic: '',
    productSn: '',
    price: 0,
    sale: 0,
    publishStatus: 1,
  })
}

const loadBrands = async () => {
  const res = await getBrandListAll()
  brandOptions.value = res.data
}

const getList = async () => {
  loading.value = true
  try {
    const res = await getProductList(query.value)
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
  query.value = { pageNum: 1, pageSize: 10, keyword: '' }
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

const handleAdd = () => {
  resetForm()
  dialogTitle.value = '新增商品'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialogTitle.value = '编辑商品'
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除商品「${row.name}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await deleteProduct(row.id)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const handleBrandChange = (val) => {
  const brand = brandOptions.value.find((b) => b.id === val)
  form.brandName = brand ? brand.name : ''
}

const handleSubmit = async () => {
  if (form.id) {
    await updateProduct(form.id, form)
    ElMessage.success('修改成功')
  } else {
    await createProduct(form)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

onMounted(() => {
  getList()
  loadBrands()
})
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="商品名称">
          <el-input v-model="query.keyword" placeholder="请输入商品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <img v-if="row.pic" :src="row.pic" style="height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="brandName" label="品牌" width="120" />
        <el-table-column label="价格" width="120">
          <template #default="{ row }">￥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="productSn" label="货号" width="120" />
        <el-table-column prop="sale" label="销量" width="80" />
        <el-table-column label="上架状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.publishStatus === 1 ? 'success' : 'info'">
              {{ row.publishStatus === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="所属品牌">
          <el-select v-model="form.brandId" placeholder="请选择品牌" style="width: 100%" @change="handleBrandChange">
            <el-option
              v-for="brand in brandOptions"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="货号">
          <el-input v-model="form.productSn" placeholder="请输入货号" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="销量">
          <el-input-number v-model="form.sale" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="上架状态">
          <el-radio-group v-model="form.publishStatus">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="form.pic" placeholder="请输入图片地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
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

.table-header {
  margin-bottom: 16px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
