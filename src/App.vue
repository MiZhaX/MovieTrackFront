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
  position: relative;
  background: url('/assets/img/landing-hero.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 0;
  pointer-events: none;
}

.main-container > * {
  position: relative;
  z-index: 1;
}
</style>