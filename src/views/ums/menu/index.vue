<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuList, createMenu, updateMenu, deleteMenu } from '@/apis/menu'

const list = ref([])
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const form = reactive({
  id: null,
  parentId: 0,
  title: '',
  level: 0,
  sort: 0,
  name: '',
  icon: '',
  hidden: 0,
})

const resetForm = () => {
  Object.assign(form, {
    id: null,
    parentId: 0,
    title: '',
    level: 0,
    sort: 0,
    name: '',
    icon: '',
    hidden: 0,
  })
}

const buildTree = (data) => {
  const map = new Map()
  data.forEach((item) => map.set(item.id, { ...item, children: [] }))
  const tree = []
  data.forEach((item) => {
    const node = map.get(item.id)
    if (item.parentId === 0) {
      tree.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) parent.children.push(node)
    }
  })
  return tree
}

const getList = async () => {
  loading.value = true
  try {
    const res = await getMenuList({})
    list.value = buildTree(res.data)
  } finally {
    loading.value = false
  }
}

const handleAdd = (row) => {
  resetForm()
  if (row) {
    form.parentId = row.id
    form.level = 1
  }
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialogTitle.value = '编辑菜单'
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除菜单「${row.title}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const handleSubmit = async () => {
  if (form.id) {
    await updateMenu(form.id, form)
    ElMessage.success('修改成功')
  } else {
    await createMenu(form)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

onMounted(getList)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <el-button type="primary" :icon="Plus" @click="handleAdd()">新增菜单</el-button>
      </div>

      <el-table
        :data="list"
        v-loading="loading"
        border
        stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="title" label="菜单名称" min-width="160" />
        <el-table-column prop="level" label="级数" width="80">
          <template #default="{ row }">{{ row.level === 0 ? '一级' : '二级' }}</template>
        </el-table-column>
        <el-table-column prop="name" label="前端名称" width="120" />
        <el-table-column prop="icon" label="图标" width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="隐藏" width="80">
          <template #default="{ row }">
            <el-tag :type="row.hidden === 1 ? 'info' : 'success'">
              {{ row.hidden === 1 ? '隐藏' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Plus" @click="handleAdd(row)">添加子菜单</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="上级菜单">
          <span>{{ form.parentId === 0 ? '顶级菜单' : '子菜单' }}</span>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="前端名称">
          <el-input v-model="form.name" placeholder="请输入前端路由名" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标名" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-radio-group v-model="form.hidden">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
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
.table-header {
  margin-bottom: 16px;
}
</style>
