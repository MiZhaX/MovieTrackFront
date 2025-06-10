<template>
  <div class="ranking-container container my-5">
    <h2 class="text-center mb-4">RANKING TOP 10</h2>

    <div v-if="loading" class="text-center">Cargando...</div>
    <div v-else>
      <div v-for="(produccion, index) in producciones" :key="produccion.id" class="card mb-4">
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center p-2">
            <RouterLink :to="`/producciones/${produccion.id}`">
              <img
                :src="getPosterPath(produccion.id)"
                class="img-fluid rounded"
                :alt="produccion.titulo"
                @error="handleImageError"
              />
            </RouterLink>
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">
                {{ index + 1 }}. {{ produccion.titulo }}
              </h5>
              <p class="card-text">
                {{ produccion.sinopsis}}
              </p>
              <p class="card-text">
                ⭐ {{ produccion.puntuacion_critica }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const producciones = ref([])
const loading = ref(true)

const getPosterPath = (id) => {
  return `/assets/img/producciones/${id}.webp`
}

const handleImageError = (event) => {
  event.target.src = '/assets/img/default.png'
}

onMounted(async () => {
  try {
    const res = await axios.get('https://movietrackapi.up.railway.app/api/v1/ranking-critica')
    producciones.value = res.data.data
  } catch (error) {
    console.error('Error al obtener el ranking:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ranking-container {
  background-color: var(--cuaternary-color);
  border-radius: 10px;
  padding: 2rem;
  padding-top: 4rem;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: bold;
}

img {
  height: 170px;
}
</style>
