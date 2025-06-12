<template>
  <main>
    <div class="relleno"></div>
    <div class="contenedor">
      <section class="hero">
        <div class="hero-content">
          <h2 class="h1 mr-4 ml-4">Descubre, organiza y comparte tus películas y series favoritas</h2>
          <p class="h5 mr-4 ml-4"><strong>MovieTrack</strong> te ayuda a llevar el control de lo que ves, lo que sueñas ver y
            quién te inspira en la pantalla.</p>
          <router-link to="/login" class="btn-principal">Comienza ahora</router-link>
        </div>
      </section>
      <div class="info-landing">
        <section class="estrenos">
          <h2 class="titulo">Últimos Estrenos</h2>
          <div v-if="estrenos && estrenos.length === 0">No hay estrenos disponibles.</div>
          <div v-else class="gridPeliculas">
            <ProduccionCard v-for="p in estrenos" :key="p.id" :produccion="p" :tamano="200" :detalles="false"
              :fecha="true" />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProduccionCard from '@/components/ProductionCard.vue'

const estrenos = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/estrenos')
    estrenos.value = data?.data || []
  } catch (e) {
    error.value = 'No se pudieron cargar los estrenos.'
  }
})
</script>

<style scoped>
.relleno {
  min-height: 12vh;
}

.contenedor {
  margin: 0 auto;
  background-color: var(--cuaternary-color);
  overflow: hidden;
}

.hero {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/assets/img/landing-hero.jpg');
  background-size: cover;
  background-position: center;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.btn-principal {
  margin-top: 1rem;
  padding: 0.7rem 2rem;
  border-radius: 5px;
  background: var(--secondary-color);
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-principal:hover {
  background: var(--primary-color);
}

.info-landing {
  margin-right: 6rem;
  margin-left: 6rem;
}

.titulo {
  text-align: center;
  margin-top: 2rem;
}

.gridPeliculas {
  display: grid;
  grid-template-columns: repeat(6, minmax(200px, 1fr));
  gap: 16px;
  justify-items: center;
  margin-top: 1rem;
}

@media (max-width: 1375px) {
  .info-landing {
    margin-right: 3rem;
    margin-left: 3rem;
  }
}

@media (max-width: 1024px) {
  .info-landing {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}

@media (max-width: 768px) {
  .gridPeliculas {
    grid-template-columns: repeat(3, minmax(160px, 1fr));
  }
}

@media (max-width: 425px) {
  .info-landing {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

  .gridPeliculas {
    gap: 10px;
    grid-template-columns: repeat(3, minmax(130px, 1fr));
  }
}

@media (max-width: 425px) {
  .gridPeliculas {
    grid-template-columns: repeat(3, minmax(110px, 1fr));
  }
}

@media (max-width: 320px) {
  .gridPeliculas {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
}
</style>