<template>
  <div class="produccion-card" :style="{ width: props.tamano + 'px' }">
    <RouterLink :to="`/producciones/${produccion.id}`"><img :src="posterPath" :alt="produccion.titulo"
        @error="setDefaultImage" ref="imgRef" /></RouterLink>
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
  }
});

const imgRef = ref(null);

const posterPath = `/assets/img/producciones/${props.produccion.id}.webp`;

function setDefaultImage() {
  if (imgRef.value) {
    imgRef.value.src = '/assets/img/default.png';
  }
}
</script>

<style scoped>
.produccion-card {
  text-align: center;
}

.produccion-card img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.titulo {
  color: black;
  font-weight: 500;
}

@media (max-width: 1450px) {
  .produccion-card {
    width: 160px !important;
  }

  .titulo {
    margin-bottom: 1rem !important;
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
