<template>
  <div class="produccion-card">
    <RouterLink :to="`/producciones/${produccion.id}`"><img
      :src="posterPath"
      :alt="produccion.titulo"
      @error="setDefaultImage"
      ref="imgRef"
    /></RouterLink>
    <p>{{ produccion.titulo }} - {{ produccion.puntuacion_critica }}⭐</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  produccion: Object
});

const imgRef = ref(null);

const posterPath = `/assets/img/producciones/${props.produccion.id}.webp`;

function setDefaultImage() {
  if (imgRef.value) {
    imgRef.value.src = '/assets/img/default.png';
  }
}
</script>

<style scoped>
.produccion-card {
  width: 200px;
  text-align: center;
}
.produccion-card img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}
</style>
