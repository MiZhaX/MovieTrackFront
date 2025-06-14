<template>
  <div class="produccion-card" :style="{ width: props.tamano + 'px' }">
    <div class="poster-wrapper">
      <RouterLink :to="`/producciones/${produccion.id}`">
        <img :src="posterPath" :alt="produccion.titulo" @error="setDefaultImage" ref="imgRef" />
        <span v-if="fecha" class="fecha-estreno">{{ formatearFecha(produccion.fecha_estreno) }}</span>
        <span v-if="nota" class="nota-estrella">
          <span class="estrella">&#9733;</span>
          <span class="nota-texto">{{ produccion.puntuacion_critica }}</span>
        </span>
      </RouterLink>
    </div>
    <p class="titulo m-0">{{ produccion.titulo }} <span v-if="detalles">- {{ produccion.puntuacion_critica }}⭐</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  produccion: Object,
  tamano: Number,
  detalles: {
    type: Boolean,
    default: true
  },
  fecha: {
    type: Boolean,
    default: false
  },
  nota: {
    type: Boolean,
    default: false
  }
});

const imgRef = ref(null);

const posterPath = props.produccion.poster;

function setDefaultImage() {
  if (imgRef.value) {
    imgRef.value.src = '/assets/img/default.png';
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}
</script>

<style scoped>
.produccion-card {
  text-align: center;
}

.poster-wrapper {
  position: relative;
  width: 100%;
}

.produccion-card img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.fecha-estreno {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--terciary-color);
  color: black;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: medium;
  font-weight: 500;
  z-index: 2;
}

.nota-estrella {
  position: absolute;
  top: -15px;
  right: 3px;
  display: flex;
  align-items: center;
  z-index: 3;
  background: transparent;
}

.nota-estrella .estrella {
  font-size: 4.5em; 
  color: #FFD700;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15))
          drop-shadow(0 0 8px rgba(0,0,0,0.35));
}

.nota-estrella .nota-texto {
  position: absolute;
  left: 20px;
  bottom: 38px;
  text-align: center;
  font-size: 0.9em;
  font-weight: bold;
  color: #222;
  z-index: 2;
  pointer-events: none;
}

.titulo {
  color: black;
  font-weight: 500;
}

@media (max-width: 1660px) {
  .produccion-card {
    width: 190px !important;
  }

  .titulo {
    margin-bottom: 1rem !important;
  }
}

@media (max-width: 1450px) {
  .produccion-card {
    width: 160px !important;
  }
}

@media (max-width: 1024px) {
  .titulo {
    font-size: 15px;
    margin-bottom: 1rem !important;

  }
}

@media (max-width: 768px) {
  .produccion-card {
    width: 160px !important;
  }
}

@media (max-width: 480px) {
  .produccion-card {
    width: 130px !important;
  }

  .titulo {
    font-size: 13px;
  }

  .fecha-estreno {
    font-size: smaller;
  }
}

@media (max-width: 415px) {
  .produccion-card {
    width: 110px !important;
  }

  .titulo {
    font-size: 13px;
  }
}
</style>
