<template>
    <div class="buscador-header" ref="buscadorRef">
        <input v-model="termino" type="text" placeholder="Busca tu película o serie favorita..." class="input" />
        <div v-if="mostrarDropdown && resultados.length" class="resultados">
            <RouterLink v-for="produccion in resultados" :key="produccion.id" :to="`/producciones/${produccion.id}`"
                class="resultado" @click="reset">
                <img :src="getPoster(produccion.id)" :alt="produccion.titulo" @error="ponerImagenPorDefecto" />
                <span>{{ produccion.titulo }}</span>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

const termino = ref('');
const resultados = ref([]);
const mostrarDropdown = ref(false);
const buscadorRef = ref(null);

const buscar = debounce(async () => {
    if (termino.value.trim().length < 2) {
        resultados.value = [];
        mostrarDropdown.value = false;
        return;
    }

    try {
        const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/producciones', {
            params: {
                'titulo[like]': termino.value
            }
        });

        resultados.value = data.data;
        mostrarDropdown.value = true;
    } catch (e) {
        resultados.value = [];
        mostrarDropdown.value = false;
    }
}, 300);

function handleClickOutside(event) {
    if (buscadorRef.value && !buscadorRef.value.contains(event.target)) {
        mostrarDropdown.value = false;
    }
}

const getPoster = (id) => `/assets/img/producciones/${id}.webp`;

const ponerImagenPorDefecto = (e) => {
    e.target.src = '/assets/img/default.webp';
};

const reset = () => {
    termino.value = '';
    resultados.value = [];
    mostrarDropdown.value = false;
};

watch(termino, buscar);

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.buscador-header {
    position: relative;
}

.input {
    width: 100%;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    border: 1px solid var(--terciary-color);
    background-color: var(--terciary-color);
    caret-color: var(--primary-color);
}

.input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.resultados {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 20;
    border-radius: 0 0 6px 6px;
    max-height: 250px;
    overflow-y: auto;
}

.resultado {
    display: flex;
    align-items: center;
    padding: 0.4rem;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
}

.resultado:hover {
    background-color: var(--cuaternary-color);
}

.resultado img {
    width: 40px;
    height: auto;
    border-radius: 4px;
}
</style>
