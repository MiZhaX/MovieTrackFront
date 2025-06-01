<template>
    <div class="contenedor">
        <Loading :cargando="cargando"></Loading>
        <div v-if="!cargando && produccion" class="detalles">
            <h2 class="titulo">{{ produccion.titulo }}</h2>
            <div class="infoDetalles">
                <img :src="posterPath" alt="poster" class="poster">
                <div class="info d-flex justify-content-between flex-column w-100">
                    <div class="tabla">
                        <ul class="nav nav-tabs" id="produccionTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="info-tab" data-bs-toggle="tab"
                                    data-bs-target="#info" type="button" role="tab" aria-controls="info"
                                    aria-selected="true">
                                    Información
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="reparto-tab" data-bs-toggle="tab" data-bs-target="#reparto"
                                    type="button" role="tab" aria-controls="reparto" aria-selected="false">
                                    Reparto
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="direccion-tab" data-bs-toggle="tab"
                                    data-bs-target="#direccion" type="button" role="tab" aria-controls="direccion"
                                    aria-selected="false">
                                    Dirección
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content mt-3" id="produccionTabContent">
                            <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                <p><strong>Género:</strong> {{ produccion.genero.nombre }}</p>
                                <p><strong>Año:</strong> {{ produccion.fecha_estreno }}</p>
                                <p><strong>Sinopsis:</strong> {{ produccion.sinopsis }}</p>
                                <p><strong>Duración:</strong> {{ produccion.duracion }}</p>
                                <p><strong>Valoración:</strong> {{ produccion.puntuacion_critica }} (Crítica) /// {{ produccion.puntuacion_usuarios }} (Usuarios)</p>
                            </div>
                            <div class="tab-pane fade" id="reparto" role="tabpanel" aria-labelledby="reparto-tab">
                                <p></p>
                            </div>
                            <div class="tab-pane fade" id="direccion" role="tabpanel" aria-labelledby="direccion-tab">
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="acciones mt-4">
                        <button class="btn me-2 btn-primary" @click="puntuarProduccion">Puntuar</button>
                        <button class="btn me-2 btn-primary" @click="marcarVisualizada">Visualizada</button>
                        <button class="btn me-2 btn-primary" @click="marcarQuieroVer">Quiero ver</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Loading from '@/components/UI/Loading.vue';

const route = useRoute();
const produccion = ref(null);
const cargando = ref(true);
const posterPath = ref('');

const fetchProduccion = async () => {
    try {
        cargando.value = true;

        const produccionId = route.params.produccionId;
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/producciones/${produccionId}`);
        produccion.value = response.data.data;
        console.log(produccion.value)
        posterPath.value = `/assets/img/producciones/${produccion.value.id}.webp`;
    } catch (error) {
        console.error('Error fetching produccion:', error);
    } finally {
        cargando.value = false;
    }
};

onMounted(fetchProduccion);
</script>
<style scoped>
.titulo {
    text-align: center;
    margin-top: 1rem;
}

.contenedor {
    padding-top: 6rem;
    margin-left: 10rem;
    margin-right: 10rem;
    min-height: 92.2vh;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
}

.infoDetalles {
    display: flex;
    gap: 3rem;
    margin: 1rem;
    margin-left: 4rem;
    margin-right: 4rem;
    margin-top: 1.5rem;
}

.poster {
    width: 250px;
    border-radius: 10px;
}

.nav-tabs {
    border-bottom: 2px solid var(--primary-color);
    gap: 2px;
}

.nav-link.active {
    background-color: var(--terciary-color);
    border-color: var(--terciary-color);
}

.nav-link {
    color: black;
    background: var(--primary-color);
}
</style>