<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando"></Loading>
    <div v-if="!cargando && produccion" class="contenedor">
        <div class="detalles">
            <h2 class="titulo">{{ produccion.titulo }}</h2>
            <div class="detalles d-flex flex-column">
                <div class="resumenDetalles">
                    <p class="tituloOriginal h6 text-start">{{ produccion.titulo_original }} · {{
                        formatearDuracion(produccion.duracion) }} · {{ obtenerAño(produccion.fecha_estreno) }}</p>
                </div>
                <div class="infoDetalles">
                    <img :src="posterPath" alt="poster" class="poster" @error="setDefaultImage" ref="imgRef">
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
                                    <button class="nav-link" id="reparto-tab" data-bs-toggle="tab"
                                        data-bs-target="#reparto" type="button" role="tab" aria-controls="reparto"
                                        aria-selected="false">
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
                            <div class="tab-content pt-2" id="produccionTabContent">
                                <div class="tab-pane fade show active" id="info" role="tabpanel"
                                    aria-labelledby="info-tab">
                                    <p><strong>Género:</strong> {{ produccion.genero.nombre }}</p>
                                    <p><strong>Estreno:</strong> {{ formatearFecha(produccion.fecha_estreno) }}</p>
                                    <p class="sinopsis"><strong>Sinopsis:</strong> {{ produccion.sinopsis }}</p>
                                    <p><strong>Duración:</strong> {{ formatearDuracion(produccion.duracion) }}</p>
                                    <p><strong>Valoración:</strong> {{ produccion.puntuacion_critica }} </p>
                                </div>
                                <div class="tab-pane fade" id="reparto" role="tabpanel" aria-labelledby="reparto-tab">
                                    <div v-if="produccion.actores && produccion.actores.length" class="reparto-lista">
                                        <ActorCard v-for="actor in produccion.actores" :key="actor.persona_id"
                                            :persona="actor" />
                                    </div>
                                    <div v-else>
                                        <p>No hay información de reparto disponible.</p>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="direccion" role="tabpanel"
                                    aria-labelledby="direccion-tab">
                                    <div v-if="produccion.directores" class="reparto-lista">
                                        <DirectorCard v-for="director in produccion.directores" :key="director.id"
                                            :director="director" />
                                    </div>
                                    <div v-else>
                                        <p>No hay información del director disponible.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="acciones mt-4 d-flex justify-content-between">
                            <div class="botones d-flex">
                                <button class="btn me-2 btn-primary" @click="puntuarProduccion">Puntuar</button>
                                <button class="btn me-2 btn-primary" @click="abrirModalLista">Añadir a
                                    lista</button>
                            </div>
                            <div class="marcas">
                                <button :class="['btn', 'me-2', visualizada ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ marcaParam: visualizada ? 0 : 1 })"
                                    v-tooltip.top="'Visualizada'">
                                    <font-awesome-icon :icon="visualizada ? 'eye-slash' : 'eye'" />
                                </button>
                                <button :class="['btn', 'me-2', quieroVer ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ marcaParam: quieroVer ? 0 : 2 })"
                                    v-tooltip.top="'Quiero ver'">
                                    <font-awesome-icon :icon="quieroVer ? 'clock' : 'stopwatch'" />
                                </button>
                                <button :class="['btn', 'me-2', esFavorita ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ favorita: esFavorita ? 0 : 1 })"
                                    v-tooltip.top="'Favorita'">
                                    <font-awesome-icon :icon="esFavorita ? ['fas', 'star'] : ['far', 'star']" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast group="br" position="bottom-right" />
    <Dialog v-model:visible="dialogVisible" modal header="Añadir a lista">
        <form @submit.prevent="añadirALista">
            <div class="modal-body">
                <div v-if="listasPersonalizadas.length > 0">
                    <select id="selectLista" v-model="listaSeleccionada" class="form-select" required>
                        <option value="">Selecciona una lista</option>
                        <option v-for="lista in listasPersonalizadas" :key="lista.id" :value="lista.id">
                            {{ lista.nombre }}
                        </option>
                    </select>
                </div>
                <div v-else>
                    <p>No tienes listas de reproducción. Crea una desde tu perfil.</p>
                </div>
            </div>
            <div class="modal-footer mt-3 d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="dialogVisible = false">Cancelar</button>
                <button type="submit" class="btn btn-primary"
                    :disabled="!listaSeleccionada || !listasPersonalizadas.length">Añadir</button>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Loading from '@/components/UI/Loading.vue';
import ActorCard from '@/components/ActorCard.vue';
import DirectorCard from '@/components/DirectorCard.vue';
import { Modal } from 'bootstrap';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import ScrollPanel from 'primevue/scrollpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const route = useRoute();
const produccion = ref(null);
const cargando = ref(true);
const posterPath = ref('');
const user = ref(null);
const esFavorita = ref(false);
const visualizada = ref(false);
const quieroVer = ref(false);
const marca = ref(null);
const imgRef = ref(null);

const dialogVisible = ref(false);
const listasPersonalizadas = ref([]);
const modalListasRef = ref(null);
const listaSeleccionada = ref('');
const toast = useToast();


function abrirModalLista() {
    listaSeleccionada.value = '';
    dialogVisible.value = true;
}

async function añadirALista() {
    if (!listaSeleccionada.value) return;
    try {
        const token = localStorage.getItem('token');
        await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/produccionesListas',
            {
                lista_personalizada_id: listaSeleccionada.value,
                produccion_id: produccion.value.id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producción añadida a la lista correctamente.', life: 3000, group: 'br' });
        dialogVisible.value = false;
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Ya existe esta producción en la lista.', life: 3000, group: 'br' });
        console.error(error);
    }
}

const fetchProduccion = async () => {
    try {
        cargando.value = true;
        const produccionId = route.params.produccionId;
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/producciones/${produccionId}`);
        produccion.value = response.data.data;
        posterPath.value = `/assets/img/producciones/${produccion.value.id}.webp`;
    } catch (error) {
        console.error('Error fetching produccion:', error);
    } finally {
        cargando.value = false;
    }
};

async function fetchListasPersonalizadas() {
    if (!user.value) return;
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas?usuario_id[eq]=${user.value.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        listasPersonalizadas.value = response.data.data || [];
    } catch (error) {
        console.error('Error obteniendo listas personalizadas:', error);
        listasPersonalizadas.value = [];
    }
}

onMounted(async () => {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : null;
    await fetchProduccion();
    await comprobarMarca();
    await fetchListasPersonalizadas();
});

watch(
    () => route.params.produccionId,
    async () => {
        await fetchProduccion();
        await comprobarMarca();
        await fetchListasPersonalizadas();
    }
);

function formatearFecha(fecha) {
    if (!fecha) return '';
    const [a, m, d] = fecha.split('-');
    return `${d}/${m}/${a}`;
}

function obtenerAño(fecha) {
    if (!fecha) return '';
    const [a] = fecha.split('-');
    return a;
}

function formatearDuracion(minutos) {
    if (!minutos || isNaN(minutos)) return '';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
}

onMounted(async () => {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : null;
    await fetchProduccion();
    await comprobarMarca();
});

watch(
    () => route.params.produccionId,
    async () => {
        await fetchProduccion();
        await comprobarMarca();
    }
);

function setDefaultImage() {
    if (imgRef.value) {
        imgRef.value.src = '/assets/img/default.png';
    }
}

async function comprobarMarca() {
    cargando.value = true;
    esFavorita.value = false;
    marca.value = null;
    if (!user.value || !produccion.value) {
        cargando.value = false;
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/marcarProducciones', {
            params: {
                'usuario_id[eq]': user.value.id,
                'produccion_id[eq]': produccion.value.id
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (data.data && data.data.length > 0) {
            marca.value = data.data[0];
            if (marca.value.favorita === 1) {
                esFavorita.value = true;
            }
            if (marca.value.marca === 1) {
                quieroVer.value = false;
                visualizada.value = true;
            } else if (marca.value.marca === 2) {
                visualizada.value = false;
                quieroVer.value = true;
            } else {
                visualizada.value = false;
                quieroVer.value = false;
            }
        } else {
            const { data } = await axios.post(
                'https://movietrackapi.up.railway.app/api/v1/marcarProducciones',
                {
                    usuario_id: user.value.id,
                    produccion_id: produccion.value.id,
                    marca: 0,
                    favorita: 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await comprobarMarca();
        }
    } catch (error) {
    } finally {
        cargando.value = false;
    }
}

async function marcarProduccion({ marcaParam = undefined, favorita = undefined } = {}) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await axios.put(
            `https://movietrackapi.up.railway.app/api/v1/marcarProducciones/${marca.value.id}`,
            {
                ...(marcaParam !== undefined ? { marca: marcaParam } : {}),
                ...(favorita !== undefined ? { favorita } : {})
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        await comprobarMarca();
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Error al marcar producción', life: 3000, group: 'br' });
    }
}

function puntuarProduccion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
}

</script>

<style scoped>
.relleno {
    min-height: 12vh;
}

.titulo {
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

.resumenDetalles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 4rem;
    margin-right: 4rem;
}

.infoDetalles {
    display: flex;
    gap: 3rem;
    margin-left: 4rem;
    margin-right: 4rem;
}

.poster {
    width: 275px;
    border-radius: 10px;
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

.sinopsis {
    text-align: justify;
}

.reparto-lista {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

#produccionTabContent {
    border-top: 3px solid var(--secondary-color);
    border-bottom: 3px solid var(--secondary-color);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    height: 305px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--terciary-color) transparent;
}

#produccionTabContent::-webkit-scrollbar {
    height: 8px;
    background: transparent;
}

#produccionTabContent::-webkit-scrollbar-thumb {
    background: var(--terciary-color);
    border-radius: 8px;
}

#produccionTabContent::-webkit-scrollbar-track {
    background: transparent;
}

.btn-primary {
    background-color: var(--terciary-color);
    border: 1px solid var(--terciary-color);
    color: black;
}

.btn-primary:hover {
    background-color: var(--var-terciary-color);
    border: 1px solid var(--var-terciary-color);
}

.btn-secondary {
    background-color: var(--var-cuaternary-color);
    border: 1px solid var(--var-cuaternary-color);
    color: black;
}

.btn-secondary:hover {
    background-color: var(--var-quintary-color);
    border: 1px solid var(--var-quintary-color);
}

.form-select {
    background-color: var(--terciary-color);
}

.form-select:focus {
    border-color: none;
    box-shadow: none;
}

@media (max-width: 1270px) {
    .contenedor {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: 7rem;
        margin-right: 7rem;
        padding-bottom: 1rem;
    }

    .poster {
        width: 240px;
    }

    .infoDetalles {
        flex-direction: column;
        align-items: center;
    }

    .resumenDetalles {
        justify-content: center;
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

@media (max-width: 427px) {
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

    #produccionTab {
        font-size: smaller;
    }

    #produccionTabContent {
        font-size: smaller;
        height: 280px;
    }

    .reparto-lista {
        flex-wrap: nowrap;
    }

    .botones {
        gap: 5px;
    }

    .marcas {
        display: flex;
        gap: 5px;
    }

    .me-2 {
        margin-right: 0 !important;
    }
}

@media (max-width: 415px) {
    .titulo {
        margin-right: 0.2rem;
    }

    .tituloOriginal {
        text-align: center !important;
    }

    .infoDetalles {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }

    .botones {
        align-items: center;
    }

    .btn-primary {
        font-size: smaller !important;
    }

    .marcas {
        align-items: center;
    }
}
</style>
