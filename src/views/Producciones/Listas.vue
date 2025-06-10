<template>
  <main>
    <div class="contenedor">
      <div v-if="cargando" class="loading-lista">
        <span>Cargando...</span>
      </div>
      <div v-else>
        <div v-if="producciones.length > 0">
          <h2 class="nombre-lista">{{ nombreLista }}</h2>
          <div class="grid-lista">
            <ProductionCard
              v-for="p in producciones"
              :key="p.produccion_id"
              :produccion="{ id: p.produccion_id, titulo: p.titulo, puntuacion_critica: p.puntuacion_critica }"
              :tamano="150"
              :detalles="false"
            />
          </div>
        </div>
        <div v-else>
          <p>No hay producciones en esta lista.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductionCard from '@/components/ProductionCard.vue'

const route = useRoute()
const producciones = ref([])
const cargando = ref(true)
const nombreLista = ref('')

async function fetchProduccionesLista() {
  cargando.value = true
  try {
    const id = route.params.listaId
    const token = localStorage.getItem('token')
    console.log('Token:', token)
    const response = await axios.get(
      `https://movietrackapi.up.railway.app/api/v1/produccionesListas?lista_personalizada_id[eq]=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    producciones.value = response.data.data || []
    if (producciones.value.length > 0 && producciones.value[0].lista_nombre) {
      nombreLista.value = producciones.value[0].lista_nombre
    } else {
      nombreLista.value = 'Lista de reproducción'
    }
  } catch (error) {
    producciones.value = []
    nombreLista.value = 'Lista de reproducción'
  } finally {
    cargando.value = false
  }
}

onMounted(fetchProduccionesLista)
</script>

<style scoped>
.contenedor {
  margin-left: 10rem;
  margin-right: 10rem;
  background-color: var(--cuaternary-color);
  min-height: 89.1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}
.loading-lista {
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}
.nombre-lista {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}
.grid-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
</style>