<template>
    <div class="paginacion">
        <button :disabled="currentPage === 1" @click="irAPagina(1)">
            &lt;&lt;
        </button>
        <button v-if="currentPage > 1" @click="irAPagina(currentPage - 1)">
            {{ currentPage - 1 }}
        </button>
        <button class="activa">
            {{ currentPage }}
        </button>
        <button v-if="currentPage < lastPage" @click="irAPagina(currentPage + 1)">
            {{ currentPage + 1 }}
        </button>
        <button :disabled="currentPage === lastPage" @click="irAPagina(lastPage)">
            &gt;&gt;
        </button>
    </div>
</template>
<script setup>
import { defineEmits } from 'vue';
import '@/assets/css/variables.css';

const props = defineProps({
  currentPage: Number,
  lastPage: Number
});

const emit = defineEmits(['cambiar-pagina']);

function irAPagina(pagina) {
    if (pagina >= 1 && pagina <= props.lastPage && pagina !== props.currentPage) {
        emit('cambiar-pagina', pagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
</script>
<style scoped>
.paginacion {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
}
.paginacion button {
    padding: 0.5rem 1rem;
    border: none;
    background: var(--terciary-color);
    cursor: pointer;
    border-radius: 4px;
}
.paginacion button.activa {
    background: var(--primary-color);
    color: black;
    font-weight: bold;
}
.paginacion button:disabled {
    opacity: 0.5;
    cursor: auto;
}
</style>