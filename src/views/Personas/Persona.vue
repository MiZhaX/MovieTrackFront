<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando"></Loading>
    <div v-if="!cargando && persona" class="contenedor">
        <div class="detalles">
            <h2 class="nombre">{{ persona.nombre }}</h2>
            <div class="infoDetalles">
                <img :src="posterPath" alt="poster" class="poster" @error="handleImageError">
                <div class="info d-flex justify-content-between flex-column w-100">
                    <div class="tabla">
                        <ul class="nav nav-tabs" id="personaTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="info-tab" data-bs-toggle="tab"
                                    data-bs-target="#info" type="button" role="tab" aria-controls="info"
                                    aria-selected="true">
                                    Información
                                </button>
                            </li>
                            <li v-if="persona.actuaciones && persona.actuaciones.length > 0" class="nav-item"
                                role="presentation">
                                <button class="nav-link" id="actuacion-tab" data-bs-toggle="tab"
                                    data-bs-target="#actuacion" type="button" role="tab" aria-controls="reparto"
                                    aria-selected="false">
                                    Actuación
                                </button>
                            </li>
                            <li v-if="persona.direcciones && persona.direcciones.length > 0" class="nav-item"
                                role="presentation">
                                <button class="nav-link" id="direccion-tab" data-bs-toggle="tab"
                                    data-bs-target="#direccion" type="button" role="tab" aria-controls="direccion"
                                    aria-selected="false">
                                    Dirección
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content pt-2" id="personaTabContent">
                            <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                <p><strong>Nombre:</strong> {{ persona.nombre }}</p>
                                <p><strong>Fecha de nacimiento:</strong> {{ formatearFecha(persona.fecha_nacimiento) }}
                                </p>
                                <p class="biografia"><strong>Biografía:</strong> {{ persona.biografia }}</p>
                            </div>
                            <div v-if="persona.actuaciones && persona.actuaciones.length > 0" class="tab-pane fade"
                                id="actuacion" role="tabpanel" aria-labelledby="actuacion-tab">
                                <div class="lista">
                                    <div v-for="actuacion in persona.actuaciones" :key="actuacion.produccion.id"
                                        class="d-flex flex-column align-items-center">
                                        <ProductionCard :produccion="actuacion.produccion" :tamano="145"
                                            :detalles="false" />
                                        <p class="text-center m-0">{{ actuacion.rol }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="persona.direcciones && persona.direcciones.length > 0" class="tab-pane fade"
                                id="direccion" role="tabpanel" aria-labelledby="direccion-tab">
                                <div class="lista">
                                    <ProductionCard v-for="produccion in persona.direcciones" :key="produccion.id"
                                        :produccion="produccion" :tamano="145" :detalles="false" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Toast group="br" position="bottom-right" />
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';
import Loading from '@/components/UI/Loading.vue';
import ProductionCard from '@/components/ProductionCard.vue';

const persona = ref(null);
const cargando = ref(true);
const posterPath = ref('');
const route = useRoute();
const toast = useToast();

const handleImageError = (event) => {
    event.target.src = '/assets/img/default.png'
}

const fetchPersona = async () => {
    try {
        cargando.value = true;

        const personaId = route.params.personaId;
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/personas/${personaId}`);
        persona.value = response.data.data;
        posterPath.value = `/assets/img/personas/${persona.value.id}.webp`;
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Error al obtener los datos de la persona', life: 3000, group: 'br' });
    } finally {
        cargando.value = false;
    }
};

function formatearFecha(fecha) {
    if (!fecha) return '';
    const [a, m, d] = fecha.split('-');
    return `${d}/${m}/${a}`;
}

onMounted(async () => {
    fetchPersona();
})
</script>
<style scoped>
.relleno {
    min-height: 12vh;
}

.nombre {
    text-align: center;
    margin-top: 1rem;
}

.contenedor {
    margin: 0 auto;
    margin-left: 10rem;
    margin-right: 10rem;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
    border-radius: 10px;
    padding-bottom: 3rem;
}

.infoDetalles {
    display: flex;
    gap: 3rem;
    margin-left: 4rem;
    margin-right: 4rem;
    align-items: stretch;
    min-height: 400px;
}

.poster {
    width: 295px;
    max-width: 275px;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
    display: block;
}

.nav-tabs {
    gap: 2px;
}

.nav-link.active {
    background-color: var(--terciary-color);
    border: 3px solid var(--terciary-color);
}

.nav-link:hover {
    border: 3px solid var(--terciary-color);
}

.nav-link {
    color: black;
    border: 3px solid var(--secondary-color);
    background: var(--primary-color);
}

.info {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
}

#personaTabContent {
    border-top: 3px solid var(--secondary-color);
    border-bottom: 3px solid var(--secondary-color);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    height: 367px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--terciary-color) transparent;
}

#personaTabContent::-webkit-scrollbar {
    height: 8px;
    background: transparent;
}

#personaTabContent::-webkit-scrollbar-thumb {
    background: var(--terciary-color);
    border-radius: 8px;
}

#personaTabContent::-webkit-scrollbar-track {
    background: transparent;
}

.lista {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1rem;
    align-items: flex-start;
}

.tabla {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
}

@media (max-width: 1270px) {
    .contenedor {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: 7rem;
        margin-right: 7rem;
        padding-bottom: 2rem;
    }

    .poster {
        width: 240px;
    }

    .infoDetalles {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 768px) {
    .contenedor {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        margin-left: 4rem;
        margin-right: 4rem;
    }
}

@media (max-width: 425px) {
    .contenedor {
        margin-top: 0rem;
        margin-bottom: 0rem;
        margin-left: 0;
        margin-right: 0;
        padding-bottom: 1rem;
        border-radius: 0px;
    }

    .poster {
        width: 210px;
    }

    .infoDetalles {
        flex-direction: column;
        align-items: center;
        margin-left: 2rem;
        margin-right: 2rem;
    }

    #personaTab {
        font-size: smaller;
    }

    #personaTabContent {
        font-size: smaller;
        height: 280px;
    }
}

@media (max-width: 415px) {
    .titulo {
        margin-right: 0.2rem;
    }

    .infoDetalles {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }
}
</style>