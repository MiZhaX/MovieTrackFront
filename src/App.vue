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
  background: url('/assets/img/fondo3.jpeg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>