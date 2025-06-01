<template>
  <div class="main-container">
    <Header></Header>
    <RouterView />
    <Footer></Footer>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import Header from './components/UI/Header.vue'
import Footer from './components/UI/Footer.vue'
import '@/assets/css/variables.css'
</script>
<style scoped>
.main-container {
  background-color: var(--primary-color);
  min-height: 100vh;
}
</style>