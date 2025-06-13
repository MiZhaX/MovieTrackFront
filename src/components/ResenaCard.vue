<template>
  <div class="reseña-card p-3">
    <div class="d-flex align-items-center mb-2 justify-content-center gap-4">
      <img :src="`https://ui-avatars.com/api/?name=${resena.usuario?.name || ''}`" alt="usuario"
        class="perfil-avatar" />
      <span class="fw-bold">{{ resena.usuario?.name || 'Usuario' }}</span>
    </div>
    <div class="mb-2 text-center">
      <span v-for="n in resena.puntuacion" :key="n" class="estrella" :class="{ activa: resena.puntuacion >= n }">
        <font-awesome-icon :icon="'star'" />
      </span>
    </div>
    <div class="descripcion">
      <p class="mb-0 text-center">{{ resena.descripcion || '' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ resena: Object });
</script>
<style scoped>
.reseña-card {
  background: var(--cuaternary-color);
  border-radius: 10px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.perfil-avatar {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  background: #fff;
  object-fit: cover;
  border: 2px solid #888;
}

.descripcion {
  max-height: 120px;
  overflow-y: auto;
}

.estrella {
  color: #f39c12;
}

@media (max-width: 321px) {
  .reseña-card {
    max-width: 200px;
  }
}

@media (max-width: 427px) {
  .reseña-card {
    max-width: 300px;
  }

  .descripcion p {
    font-size: smaller;
  }
}
</style>