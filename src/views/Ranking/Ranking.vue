<template>
  <div class="ranking-container container my-5">
    <Loading :cargando="loading" />
    <div v-if="!loading">
      <div v-for="(produccion, index) in producciones" :key="produccion.id" class="card mb-4">
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center p-2">
            <RouterLink :to="`/producciones/${produccion.id}`">
              <img :src="getPosterPath(produccion.id)" class="img-fluid rounded" :alt="produccion.titulo"
                @error="handleImageError" />
            </RouterLink>
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">
                {{ index + 1 }}. {{ produccion.titulo }}
              </h5>
              <p class="card-text"> </p>
              <p class="card-text sinopsis">
                {{ produccion.sinopsis }}
              </p>
              <p class="card-text">
                <strong class="datos">{{ produccion.titulo_original }} · {{
                  formatearDuracion(produccion.duracion) }} · {{ obtenerAño(produccion.fecha_estreno) }} · </strong>
                <strong>⭐ {{ produccion.puntuacion_critica }}</strong>
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
import Loading from '@/components/UI/Loading.vue'

const producciones = ref([])
const loading = ref(true)

const getPosterPath = (id) => {
  return `/assets/img/producciones/${id}.webp`
}

const handleImageError = (event) => {
  event.target.src = '/assets/img/default.png'
}

function formatearDuracion(minutos) {
  if (!minutos || isNaN(minutos)) return '';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}m`;
}

function obtenerAño(fecha) {
  if (!fecha) return '';
  const [a] = fecha.split('-');
  return a;
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
  border-radius: 10px;
  padding-top: 5.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.titulo {
  padding: 0.5rem;
  border-radius: 10px;
  background-color: var(--cuaternary-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: bold;
  text-align: center;
}

img {
  height: 170px;
}

@media (max-width: 425px) {
  .ranking-container {
    margin-bottom: 0rem !important;
    border-radius: 0px !important;
  }

  .card-body {
    display: flex;
    justify-content: space-around;
  }

  .card-title {
    font-size: large;
  }

  .sinopsis,
  .datos {
    display: none;
  }
}
</style>
