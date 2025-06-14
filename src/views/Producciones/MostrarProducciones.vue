<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando" />
    <div v-if="!cargando" class="contenedor">
        <div>
            <Filters
                :generoSeleccionado="generoSeleccionado"
                :valoracionSeleccionada="valoracionSeleccionada"
                @filtrar-genero="filtrarPorGenero"
                @filtrar-valoracion="filtrarPorValoracion"
            />

            <div class="producciones">
                <div v-if="producciones.length" class="gridPeliculas">
                    <ProduccionCard v-for="p in producciones" :key="p.id" :produccion="p" :tamano="200"
                        :detalles="false" :nota="false" />
                </div>
                <div v-else class="text-center">
                    <p class="h1">No se han encontrado producciones</p>
                </div>
            </div>

            <Pagination v-if="lastPage > 1" :currentPage="currentPage" :lastPage="lastPage" @cambiar-pagina="fetchProducciones" />
        </div>

        <Toast group="br" position="bottom-right" />
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import ProduccionCard from '@/components/ProductionCard.vue';
import Pagination from '@/components/UI/Pagination.vue';
import Filters from '@/components/UI/Filters.vue';
import Loading from '@/components/UI/Loading.vue';

const route = useRoute();
const toast = useToast();

const producciones = ref([]);
const cargando = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);
const generoSeleccionado = ref('');
const valoracionSeleccionada = ref(''); // Nuevo estado para la valoración

const fetchProducciones = async (page = 1) => {
    cargando.value = true;
    const tipo = route.path.includes('peliculas') ? 'pelicula' : 'serie';

    let url = `https://movietrackapi.up.railway.app/api/v1/producciones?tipo[eq]=${tipo}&page=${page}`;
    if (generoSeleccionado.value) {
        url += `&genero_id[eq]=${generoSeleccionado.value}`;
    }
    // Agregar filtro de valoración si está seleccionado
    if (valoracionSeleccionada.value !== '' && valoracionSeleccionada.value !== null) {
        url += `&puntuacion_critica[gt]=${valoracionSeleccionada.value}`;
    }

    try {
        const response = await axios.get(url);
        producciones.value = response.data.data;
        currentPage.value = response.data.meta.current_page;
        lastPage.value = response.data.meta.last_page;
    } catch (error) {
        toast.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Error al obtener las producciones.',
            life: 3000,
            group: 'br'
        });
    } finally {
        cargando.value = false;
    }
};

watch(() => route.path, () => {
    generoSeleccionado.value = '';
    valoracionSeleccionada.value = ''; // Resetear valoración al cambiar de ruta
    fetchProducciones(1);
});

const filtrarPorGenero = (id) => {
    generoSeleccionado.value = id || '';
    fetchProducciones(1);
};

// Nuevo método para manejar el filtro de valoración
const filtrarPorValoracion = (valor) => {
    valoracionSeleccionada.value = valor || '';
    fetchProducciones(1);
};

onMounted(() => fetchProducciones());
</script>
<style scoped>
.gridPeliculas {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    justify-items: center;
}

.contenedor {
    padding-top: 7rem;
    margin-left: 10rem;
    margin-right: 10rem;
    min-height: 92.2vh;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
}

@media (min-width: 1661px) {
    .gridPeliculas {
        grid-template-columns: repeat(5, minmax(200px, 1fr));
    }

    .contenedor {
        margin-left: 16rem;
        margin-right: 16rem;
    }
}

@media (max-width: 1440px) {
    .gridPeliculas {
        grid-template-columns: repeat(5, minmax(190px, 1fr));
        gap: 0px;
    }

    .contenedor {
        padding-top: 6rem;
        margin-left: 12rem;
        margin-right: 12rem;
    }
}

@media (max-width: 1440px) {
    .gridPeliculas {
        grid-template-columns: repeat(5, minmax(200px, 1fr));
    }
}

@media (max-width: 1380px) {
    .gridPeliculas {
        grid-template-columns: repeat(5, minmax(160px, 1fr));
    }
}

@media (max-width: 1200px) {
    .contenedor {
        padding-top: 6.2rem;
        margin-left: 6rem;
        margin-right: 6rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(5, minmax(160px, 1fr));
    }
}

@media (max-width: 1024px) {
    .contenedor {
        padding-top: 6rem;
        margin-left: 4.5rem;
        margin-right: 4.5rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(35 minmax(200px, 1fr));
    }
}

@media (max-width: 768px) {
    .contenedor {
        padding-top: 5rem;
        margin-left: 5rem;
        margin-right: 5rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(3, minmax(200px, 1fr));
    }
}

@media (max-width: 768px) {
    .contenedor {
        padding-top: 5rem;
        margin-left: 3rem;
        margin-right: 3rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(3, minmax(200px, 1fr));
    }
}

@media (max-width: 675px) {
    .contenedor {
        padding-top: 7rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(2, minmax(200px, 1fr));
    }
}

@media (max-width: 480px) {
    .contenedor {
        margin-left: 0rem;
        margin-right: 0rem;
        padding-top: 6rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(3, minmax(130px, 1fr));
    }
}

@media (max-width: 415px) {
    .contenedor {
        padding-top: 6rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(3, minmax(110px, 1fr));
    }
}

@media (max-width: 320px) {
    .contenedor {
        padding-top: 6rem;
    }

    .gridPeliculas {
        grid-template-columns: repeat(2, minmax(115px, 1fr));
    }
}
</style>