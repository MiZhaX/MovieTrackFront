<template>
  <div class="director-card">
    <div class="imagen">
      <RouterLink :to="`/personas/${director.director.id}`">
        <img :src="imagePath" :alt="director.director.nombre" @error="setDefaultImage" ref="imgRef" />
      </RouterLink>
      <p>{{ director.director.nombre }}</p>
    </div>
    <p class="biografia">{{ director.director.biografia }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  director: Object
});

const imgRef = ref(null);
const imagePath = `/assets/img/personas/${props.director.director.id}.webp`;

function setDefaultImage() {
  if (imgRef.value) {
    imgRef.value.src = '/assets/img/default.png';
  }
}
</script>

<style scoped>
.director-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.imagen {
  text-align: center;
}

.imagen img {
  width: 140px;
  border-radius: 8px;
  object-fit: cover;
}

.biografia {
  text-align: justify;
}
</style>
