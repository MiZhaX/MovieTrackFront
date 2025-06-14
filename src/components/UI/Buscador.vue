<template>
    <div class="buscador-header" ref="buscadorRef">
        <input v-model="termino" type="text" placeholder="Busca tu película o serie favorita..." class="input" aria-label="Buscador de producciones"/>
        <div v-if="mostrarDropdown" class="resultados"
            :class="{ 'd-flex': !resultados.length, 'justify-content-center': !resultados.length }">
            <template v-if="resultados.length">
                <RouterLink v-for="produccion in resultados" :key="produccion.id" :to="`/producciones/${produccion.id}`"
                    class="resultado" @click="reset">
                    <img :src="produccion.poster" :alt="produccion.titulo" @error="ponerImagenPorDefecto" />
                    <span>{{ produccion.titulo }}</span>
                </RouterLink>
            </template>
            <template v-else>
                <button class="btn-recomendar" @click="abrirDialogRecomendar">
                    ¿No encuentras lo que buscas? Recomienda una película
                </button>
            </template>
        </div>
        <Dialog v-model:visible="dialogRecomendarVisible" modal header="Recomendar película">
            <form @submit.prevent="enviarRecomendacion">
                <label for="nombrePelicula" class="form-label">Nombre de la película:</label>
                <input id="nombrePelicula" v-model="nombrePelicula" class="input" required maxlength="100" />
                <div class="modal-footer mt-3 d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-secondary"
                        @click="dialogRecomendarVisible = false">Cancelar</button>
                    <button type="submit" class="btn btn-primary" :disabled="!nombrePelicula.trim()">Enviar</button>
                </div>
            </form>
        </Dialog>
        <Toast group="br" position="bottom-right" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';

const termino = ref('');
const resultados = ref([]);
const mostrarDropdown = ref(false);
const buscadorRef = ref(null);
const toast = useToast();

const dialogRecomendarVisible = ref(false);
const nombrePelicula = ref('');
const mensajeRecomendacion = ref('');

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
        mostrarDropdown.value = true;
    }
}, 300);

function handleClickOutside(event) {
    if (buscadorRef.value && !buscadorRef.value.contains(event.target)) {
        mostrarDropdown.value = false;
    }
}

const ponerImagenPorDefecto = (e) => {
    e.target.src = '/assets/img/default.png';
};

const reset = () => {
    termino.value = '';
    resultados.value = [];
    mostrarDropdown.value = false;
};

function abrirDialogRecomendar() {
    dialogRecomendarVisible.value = true;
    nombrePelicula.value = '';
    mensajeRecomendacion.value = '';
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
        dialogRecomendarVisible.value = false;
    } catch (e) {
        mensajeRecomendacion.value = '';
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo enviar la recomendación. Inténtalo más tarde.', life: 3000, group: 'br' });
    }
}

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
    color: black;
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

.btn-recomendar {
    padding: 0.7rem 1rem;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin: 0.5rem 0;
    font-size: 1rem;
    transition: background 0.2s;
}

.btn-recomendar:hover {
    background: var(--primary-color);
}

.mensaje-recomendacion {
    margin-top: 1rem;
    color: var(--primary-color);
    text-align: center;
}

@media (max-width: 1160px) {
    .btn-recomendar {
        font-size: 0.8rem;
    }
}

@media (max-width: 930px) {
    .input {
        font-size: smaller;
        width: 350px;
    }

    .btn-recomendar {
        padding: 0.5rem;
    }
}

@media (max-width: 768px) {
    .input {
        font-size: smaller;
        width: 320px;
    }

    .btn-recomendar {
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }
}

@media (max-width: 425px) {
    .input {
        font-size: smaller;
        width: 270px;
    }
}

@media (max-width: 320px) {
    .input {
        font-size: smaller;
        width: 250px;
    }
}
</style>