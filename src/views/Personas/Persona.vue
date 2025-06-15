<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando"></Loading>
    <div v-if="!cargando && persona" class="contenedor">
        <div class="detalles">
            <h2 class="nombre">
                <template v-if="editando">
                    <input v-model="formEdicion.nombre" class="form-control text-center" />
                </template>
                <template v-else>
                    {{ persona.nombre }}
                </template>
            </h2>
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
                                <p>
                                    <strong>Nombre:</strong>
                                    <template v-if="editando">
                                        <input v-model="formEdicion.nombre" class="form-control" />
                                    </template>
                                    <template v-else>
                                        {{ persona.nombre }}
                                    </template>
                                </p>
                                <p>
                                    <strong>Fecha de nacimiento:</strong>
                                    <template v-if="editando">
                                        <input v-model="formEdicion.fecha_nacimiento" type="date" class="form-control" />
                                    </template>
                                    <template v-else>
                                        {{ formatearFecha(persona.fecha_nacimiento) }}
                                    </template>
                                </p>
                                <p class="biografia">
                                    <strong>Biografía:</strong>
                                    <template v-if="editando">
                                        <textarea v-model="formEdicion.biografia" class="form-control" rows="3"></textarea>
                                    </template>
                                    <template v-else>
                                        {{ persona.biografia }}
                                    </template>
                                </p>
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
                    <div class="acciones mt-4 d-flex justify-content-start">
                        <div class="botones d-flex">
                            <button v-if="esAdmin && !editando" class="btn me-2 btn-primary" @click="activarEdicion">Editar
                            </button>
                            <button v-if="esAdmin && editando" class="btn me-2 btn-primary" @click="enviarEdicion">Enviar
                            </button>
                            <button v-if="esAdmin && editando" class="btn btn-secondary" @click="cancelarEdicion">Cancelar
                            </button>
                            <button v-if="esAdmin" class="btn btn-danger ms-2" @click="eliminarPersona">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Toast group="br" position="bottom-right" />
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';
import Loading from '@/components/UI/Loading.vue';
import ProductionCard from '@/components/ProductionCard.vue';

const persona = ref(null);
const cargando = ref(true);
const posterPath = ref('');
const route = useRoute();
const router = useRouter();
const toast = useToast();

const user = ref(null);
const editando = ref(false);
const formEdicion = reactive({
    nombre: '',
    fecha_nacimiento: '',
    biografia: ''
});
const datosOriginales = ref({});
const esAdmin = computed(() => {
    const storedUser = localStorage.getItem('user');
    const u = storedUser ? JSON.parse(storedUser) : null;
    return u && (u.email === 'mbonelortiz@gmail.com' || u.correo === 'mbonelortiz@gmail.com');
});

const handleImageError = (event) => {
    event.target.src = '/assets/img/default.png'
}

const fetchPersona = async () => {
    try {
        cargando.value = true;

        const personaId = route.params.personaId;
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/personas/${personaId}`);
        persona.value = response.data.data;
        posterPath.value = persona.value.imagen;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            router.push('/');
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: 'Error al obtener los datos de la persona', life: 3000, group: 'br' });
        }
    } finally {
        cargando.value = false;
    }
};

function formatearFecha(fecha) {
    if (!fecha) return '';
    const [a, m, d] = fecha.split('-');
    return `${d}/${m}/${a}`;
}

function activarEdicion() {
    if (!persona.value) return;
    editando.value = true;
    formEdicion.nombre = persona.value.nombre;
    formEdicion.fecha_nacimiento = persona.value.fecha_nacimiento;
    formEdicion.biografia = persona.value.biografia;
    datosOriginales.value = {
        nombre: formEdicion.nombre,
        fecha_nacimiento: formEdicion.fecha_nacimiento,
        biografia: formEdicion.biografia
    };
}

function cancelarEdicion() {
    editando.value = false;
}

async function enviarEdicion() {
    const cambios = {};
    if (formEdicion.nombre !== datosOriginales.value.nombre) cambios.nombre = formEdicion.nombre;
    if (formEdicion.fecha_nacimiento !== datosOriginales.value.fecha_nacimiento) cambios.fecha_nacimiento = formEdicion.fecha_nacimiento;
    if (formEdicion.biografia !== datosOriginales.value.biografia) cambios.biografia = formEdicion.biografia;

    if (Object.keys(cambios).length === 0) {
        editando.value = false;
        return;
    }

    try {
        const token = localStorage.getItem('token');
        await axios.patch(
            `https://movietrackapi.up.railway.app/api/v1/personas/${persona.value.id}`,
            cambios,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.add({ severity: 'success', summary: 'Persona actualizada', detail: 'Los datos han sido actualizados.', life: 3000, group: 'br' });
        await fetchPersona();
        editando.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la persona.', life: 3000, group: 'br' });
    }
}

async function eliminarPersona() {
    if (!persona.value) return;
    try {
        const token = localStorage.getItem('token');
        await axios.delete(
            `https://movietrackapi.up.railway.app/api/v1/personas/${persona.value.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.add({ severity: 'success', summary: 'Persona eliminada', detail: 'La persona ha sido eliminada.', life: 3000, group: 'br' });
        router.push('/');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la persona.', life: 3000, group: 'br' });
    }
}

onMounted(async () => {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : null;
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

.form-control:focus {
    outline: none;
    box-shadow: none;
    border: 1px solid var(--terciary-color);
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