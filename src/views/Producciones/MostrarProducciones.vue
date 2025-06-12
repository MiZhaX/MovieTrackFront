<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando"></Loading>
    <div v-if="!cargando" class="contenedor">
        <div>
            <Filters></Filters>
            <div class="producciones">
                <div class="gridPeliculas">
                    <ProduccionCard v-for="p in producciones" :key="p.id" :produccion="p" :tamano="200"
                        :detalles="false" />
                </div>
            </div>
            <Pagination :currentPage="currentPage" :lastPage="lastPage" @cambiar-pagina="fetchProducciones" />
        </div>
        <Toast group="br" position="bottom-right" />
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import ProduccionCard from '@/components/ProductionCard.vue';
import Pagination from '@/components/UI/Pagination.vue';
import Filters from '@/components/UI/Filters.vue';
import Loading from '@/components/UI/Loading.vue';
import '@/assets/css/variables.css';

const route = useRoute();
const producciones = ref([]);
const cargando = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);
const toast = useToast();

const fetchProducciones = async (page = 1) => {
    cargando.value = true;
    let tipo = route.path.includes('peliculas') ? 'pelicula' : 'serie';

    try {
        const response = await axios.get(
            `https://movietrackapi.up.railway.app/api/v1/producciones?tipo[eq]=${tipo}&page=${page}`
        );
        producciones.value = response.data.data;
        currentPage.value = response.data.meta.current_page;
        lastPage.value = response.data.meta.last_page;
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Error al obtener los datos de las producciones.', life: 3000, group: 'br' });
    } finally {
        cargando.value = false;
    }
};

onMounted(() => fetchProducciones());

watch(() => route.path, () => fetchProducciones(1));
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
