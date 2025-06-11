<template>
    <div class="contenedor">
        <Loading :cargando="cargando"></Loading>
        <div v-if="!cargando">
            <Filters></Filters>
            <div class="producciones">
                <div class="grid">
                    <ProduccionCard v-for="p in producciones" :key="p.id" :produccion="p" :tamano="200"/>
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
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    justify-items: center;
}

.contenedor {
    padding-top: 6rem;
    margin-left: 10rem;
    margin-right: 10rem;
    min-height: 92.2vh;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
}
</style>
