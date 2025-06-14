<template>
  <main>
    <div class="relleno"></div>
    <div class="contenedor">
      <section class="hero">
        <div class="hero-content">
          <h2 class="h1 mr-4 ml-4">
            Descubre, organiza y comparte tus películas y series favoritas
          </h2>
          <p class="h5 mr-4 ml-4">
            <strong>MovieTrack</strong> te ayuda a llevar el control de lo que
            ves, lo que sueñas ver y quién te inspira en la pantalla.
          </p>
          <button class="btn-principal" @click="irAComenzar">
            Comienza ahora
          </button>
        </div>
      </section>
      <div class="info-landing">
        <section class="estrenos">
          <h2 class="titulo">Novedades en taquilla</h2>
          <div v-if="estrenos && estrenos.length === 0">
            No hay estrenos disponibles.
          </div>
          <div v-else class="gridPeliculas">
            <ProduccionCard v-for="p in estrenos" :key="p.id" :produccion="p" :tamano="200" :detalles="false"
              :fecha="true" />
          </div>
        </section>
        <section class="reseñas-home mt-5">
          <h2 class="titulo">Opiniones de la comunidad</h2>
          <Carousel v-if="resenasAleatorias.length > 0" :value="resenasAleatorias" :numVisible="1" :numScroll="1"
            :showNavigators="resenasAleatorias.length > 1" :showIndicators="resenasAleatorias.length > 1"
            :touchable="resenasAleatorias.length > 1" :draggable="resenasAleatorias.length > 1"
            class="carousel-reseñas">
            <template #item="slotProps">
              <ResenaHomeCard :resena="slotProps.data" />
            </template>
          </Carousel>
          <div v-else class="text-center">No hay reseñas disponibles.</div>
        </section>
        <section class="recomendar-home mt-5 mb-5">
          <h2 class="titulo">¿No encuentras una película o serie?</h2>
          <form class="form-recomendar d-flex flex-column align-items-center" @submit.prevent="enviarRecomendacion">
            <p class="text-center">¿Tienes una película o serie que no encuentras aquí? ¡Recomiéndanosla y la
              agregaremos a
              MovieTrack!</p>
            <div class="inputRecomendar d-flex gap-4">
              <input id="nombrePelicula" v-model="nombrePelicula" class="input" required maxlength="100"
                placeholder="Nombre de la película o serie..." aria-label="Recomendar producción" />
              <button type="submit" class="btn btn-primary" :disabled="!nombrePelicula.trim()">Recomendar</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ProduccionCard from "@/components/ProductionCard.vue";
import Carousel from "primevue/carousel";
import ResenaHomeCard from "@/components/ResenaHomeCard.vue";
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const estrenos = ref([]);
const error = ref(null);
const user = ref(null);
const resenasAleatorias = ref([]);
const nombrePelicula = ref('');
const toast = useToast();

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  user.value = storedUser ? JSON.parse(storedUser) : null;
  try {
    const { data } = await axios.get(
      "https://movietrackapi.up.railway.app/api/v1/estrenos"
    );
    estrenos.value = data?.data || [];
  } catch (e) {
    error.value = "No se pudieron cargar los estrenos.";
  }

  try {
    const { data } = await axios.get(
      "https://movietrackapi.up.railway.app/api/v1/resenasAleatorias"
    );
    resenasAleatorias.value = data?.data || [];
  } catch (e) {
    resenasAleatorias.value = [];
  }
});

function irAComenzar() {
  if (user.value && user.value.id) {
    router.push(`/perfil`);
  } else {
    router.push("/login");
  }
}

async function enviarRecomendacion() {
  const user = localStorage.getItem('user');
  try {
    await axios.post('https://movietrackapi.up.railway.app/api/v1/recomendarPelicula', {
      nombre_pelicula: nombrePelicula.value,
      nombre_usuario: user.name,
      correo_usuario: user.email
    });
    toast.add({ severity: 'success', summary: 'Recomendación Realizada', detail: '¡Gracias por tu recomendación!', life: 3000, group: 'br' });
    nombrePelicula.value = '';
  } catch (e) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo enviar la recomendación. Inténtalo más tarde.', life: 3000, group: 'br' });
  }
}
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
  background-image: url("/assets/img/landing-hero.jpg");
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
  border: none;
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

.form-recomendar input.input {
  width: 500px;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--terciary-color);
  background-color: var(--terciary-color);
  caret-color: var(--primary-color);
  color: black;
}

.form-recomendar input.input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-recomendar button.btn {
  min-width: 120px;
}

@media (max-width: 1375px) {
  .info-landing {
    margin-right: 3rem;
    margin-left: 3rem;
  }

  .gridPeliculas {
    grid-template-columns: repeat(6, minmax(160px, 1fr));
  }
}

@media (max-width: 1320px) {
  .info-landing {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}

@media (max-width: 1280px) {
  .gridPeliculas {
    gap: 5px;
  }
}

@media (max-width: 1100px) {
  .gridPeliculas {
    grid-template-columns: repeat(3, minmax(160px, 1fr));
  }
}

@media (max-width: 700px) {
  .form-recomendar input.input {
    width: 300px;
  }
}

@media (max-width: 480px) {
  .info-landing {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

  .gridPeliculas {
    gap: 10px;
    grid-template-columns: repeat(3, minmax(130px, 1fr));
  }

  .form-recomendar input.input {
    width: 200px;
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