<template>
  <div class="produccion-card" :style="{ width: props.tamano + 'px' }">
    <div class="poster-wrapper">
      <RouterLink :to="`/producciones/${produccion.id}`">
        <img :src="posterPath" :alt="produccion.titulo"
          @error="setDefaultImage" ref="imgRef" />
        <span v-if="fecha" class="fecha-estreno">{{ formatearFecha(produccion.fecha_estreno) }}</span>
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
  }
});

const imgRef = ref(null);

const posterPath = `/assets/img/producciones/${props.produccion.id}.webp`;

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
