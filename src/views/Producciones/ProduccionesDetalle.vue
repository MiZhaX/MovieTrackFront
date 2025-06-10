<template>
    <div class="contenedor">
        <Loading :cargando="cargando"></Loading>
        <div v-if="!cargando && produccion" class="detalles">
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
                            <button class="btn me-2 btn-primary" @click="puntuarProduccion">Puntuar</button>
                            <div class="marcas">
                                <button :class="['btn', 'me-2', visualizada ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ marcaParam: visualizada ? 0 : 1 })" title="Visualizada">
                                    <font-awesome-icon :icon="visualizada ? 'eye-slash' : 'eye'" />
                                </button>
                                <button :class="['btn', 'me-2', quieroVer ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ marcaParam: quieroVer ? 0 : 2 })" title="Quiero ver">
                                    <font-awesome-icon :icon="quieroVer ? 'clock' : 'stopwatch'" />
                                </button>
                                <button :class="['btn', 'me-2', esFavorita ? 'btn-secondary' : 'btn-primary']"
                                    @click="marcarProduccion({ favorita: esFavorita ? 0 : 1 })" title="Favorita">
                                    <font-awesome-icon :icon="esFavorita ? ['fas', 'star'] : ['far', 'star']" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Loading from '@/components/UI/Loading.vue';
import ActorCard from '@/components/ActorCard.vue';
import DirectorCard from '@/components/DirectorCard.vue';

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

const fetchProduccion = async () => {
    try {
        cargando.value = true;

        const produccionId = route.params.produccionId;
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/producciones/${produccionId}`);
        produccion.value = response.data.data;
        console.log(produccion.value)
        posterPath.value = `/assets/img/producciones/${produccion.value.id}.webp`;
    } catch (error) {
        console.error('Error fetching produccion:', error);
    } finally {
        cargando.value = false;
    }
};

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
        console.log(marca.value)
    } catch (error) {
        console.error('Error comprobando marca:', error);
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
        // Actualiza el estado local tras marcar
        await comprobarMarca();
    } catch (error) {
        alert('Error al marcar la producción.');
        console.error(error);
    }
}

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
    padding-bottom: 4rem;
}

.resumenDetalles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 4rem;
    margin-right: 4rem;
    margin-top: 1.5rem;
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
    gap: 1.5rem;
    margin-top: 1rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--terciary-color) transparent;
}

.reparto-lista::-webkit-scrollbar {
    height: 8px;
    background: transparent;
}

.reparto-lista::-webkit-scrollbar-thumb {
    background: var(--terciary-color);
    border-radius: 8px;
}

.reparto-lista::-webkit-scrollbar-track {
    background: transparent;
}

#produccionTabContent {
    background: var(--primary-color);
    border: 3px solid var(--secondary-color);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    height: 310px;
}

.btn-primary {
    background-color: var(--terciary-color);
    border: 1px solid var(--terciary-color);
    color: black;
}

.btn-primary:hover {
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
}

.btn-secondary {
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
    color: black;
}

.btn-secondary:hover {
    background-color: var(--terciary-color);
    border: 1px solid var(--terciary-color);
}
</style>
