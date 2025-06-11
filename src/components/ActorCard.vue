<template>
  <div class="persona-card">
    <RouterLink :to="`/personas/${persona.persona_id}`"><img
      :src="imagePath"
      :alt="persona.nombre"
      @error="setDefaultImage"
      ref="imgRef"
    /></RouterLink>
    <p>{{ persona.actor.nombre }}<br><strong>{{ persona.rol }}</strong></p>
    <p></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  persona: Object
});

const imgRef = ref(null);

const imagePath = `/assets/img/personas/${props.persona.persona_id}.webp`;

function setDefaultImage() {
  if (imgRef.value) {
    imgRef.value.src = '/assets/img/default.png';
  }
}
</script>

<style scoped>
.persona-card {
  width: 140px;
  text-align: center;
}
.persona-card img {
  width: 140px;
  border-radius: 8px;
  object-fit: cover;
}

@media (max-width: 425px) {
  .persona-card img {
    width: 100px;
  }
}
</style>
