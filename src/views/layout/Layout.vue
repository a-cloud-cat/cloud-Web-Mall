<script setup>
import Sidebar from './components/Sidebar.vue'
import AppMain from './components/AppMain.vue'
</script>

<template>
  <el-container class="app-wrapper">
    <Sidebar />
    <AppMain />
  </el-container>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
}
</style>
