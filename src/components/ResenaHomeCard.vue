<template>
  <div class="reseña-home-card p-3 d-flex flex-column align-items-center justify-content-between">
    <div class="d-flex align-items-center mb-2 justify-content-center gap-4">
      <img :src="`https://ui-avatars.com/api/?name=${resena.usuario?.name || ''}`" alt="usuario" class="perfil-avatar" />
      <span class="fw-bold">{{ resena.usuario?.name || 'Usuario' }}</span>
    </div>
    <div class="mb-2 text-center">
      <span v-for="n in resena.puntuacion" :key="n" class="estrella" :class="{ activa: resena.puntuacion >= n }">
        <font-awesome-icon :icon="'star'" />
      </span>
    </div>
    <div class="descripcion">
      <p class="mb-2 text-center">{{ resena.descripcion || '' }}</p>
    </div>
    <div class="produccion-info text-center">
      <router-link :to="`/producciones/${resena.produccion_id}`">
        <img :src="`/assets/img/producciones/${resena.produccion_id}.webp`" :alt="resena.produccion?.titulo" class="poster-produccion" @error="setDefaultImage" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ resena: Object });
const imgRef = ref(null);
function setDefaultImage(e) {
  e.target.src = '/assets/img/default.png';
}
</script>

<style scoped>
.reseña-home-card {
  background: var(--cuaternary-color);
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}
.perfil-avatar {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: #fff;
  object-fit: cover;
  border: 2px solid #888;
}
.poster-produccion {
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #888;
  background: #fff;
}
.descripcion {
  max-height: 120px;
  overflow-y: auto;
}
.estrella {
  color: #f39c12;
}

.descripcion {
  scrollbar-width: thin;
  scrollbar-color: var(--quintary-color) transparent;
  background: none;
}

@media (max-width: 321px) {
  .reseña-home-card {
    max-width: 200px;
  }
}

@media (max-width: 427px) {
  .reseña-home-card {
    max-width: 300px;
    margin-right: 1.5rem;
    margin-left: 1.5rem;
  }

  .descripcion p {
    font-size: smaller;
  }
}
</style>
