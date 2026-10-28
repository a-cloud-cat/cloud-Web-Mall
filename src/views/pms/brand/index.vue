<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBrandList,
  createBrand,
  updateBrand,
  deleteBrand,
} from '@/apis/brand'

const query = ref({ pageNum: 1, pageSize: 10, keyword: '' })
const list = ref([])
const total = ref(0)
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('新增品牌')
const editId = ref(null)

const defaultForm = {
  name: '',
  firstLetter: '',
  sort: 0,
  factoryStatus: 0,
  showStatus: 0,
  logo: '',
  bigPic: '',
  brandStory: '',
}
const form = ref({ ...defaultForm })

const getList = async () => {
  loading.value = true
  try {
    const res = await getBrandList(query.value)
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
  dialogTitle.value = '新增品牌'
  editId.value = null
  form.value = { ...defaultForm }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑品牌'
  editId.value = row.id
  form.value = { ...defaultForm, ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除品牌「${row.name}」？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteBrand(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const handleSubmit = async () => {
  if (!form.value.name) {
    ElMessage.warning('品牌名称不能为空')
    return
  }
  if (editId.value) {
    await updateBrand(editId.value, form.value)
    ElMessage.success('修改成功')
  } else {
    await createBrand(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

onMounted(getList)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="品牌名称">
          <el-input v-model="query.keyword" placeholder="请输入品牌名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增品牌</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column label="Logo" width="100">
          <template #default="{ row }">
            <img v-if="row.logo" :src="row.logo" style="height: 40px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品牌名称" min-width="160" />
        <el-table-column prop="firstLetter" label="首字母" width="80" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="制造商" width="100">
          <template #default="{ row }">
            <el-tag :type="row.factoryStatus === 1 ? 'success' : 'info'">
              {{ row.factoryStatus === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="显示状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.showStatus === 1 ? 'success' : 'info'">
              {{ row.showStatus === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="商品数" width="80" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="品牌名称">
          <el-input v-model="form.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="首字母">
          <el-input v-model="form.firstLetter" placeholder="请输入首字母" maxlength="1" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="制造商">
          <el-switch v-model="form.factoryStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="form.showStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="form.logo" placeholder="请输入 Logo 地址" />
        </el-form-item>
        <el-form-item label="大图">
          <el-input v-model="form.bigPic" placeholder="请输入大图地址" />
        </el-form-item>
        <el-form-item label="品牌故事">
          <el-input v-model="form.brandStory" type="textarea" :rows="3" placeholder="请输入品牌故事" />
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

.toolbar {
  margin-bottom: 12px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
