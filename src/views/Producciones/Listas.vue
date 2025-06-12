<template>
    <div class="relleno"></div>
    <Loading :cargando="cargando"></Loading>
    <div v-if="!cargando && producciones" class="contenedor">
        <div class="detalles">
            <div v-if="producciones.length > 0">
                <h2 class="nombre-lista mb-2">
                    <input v-if="modoEdicion" v-model="nombreListaEdit" :disabled="!modoEdicion"
                        class="input-editar-nombre mr-3" maxlength="50" />
                    <span v-else class="mr-3">{{ nombreLista }}</span>
                    <button v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id"
                        class="btnEditar" @click="toggleEdicion">
                        <font-awesome-icon :icon="!modoEdicion ? 'pen' : 'pen-ruler'" />
                    </button>
                    <button v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id"
                        class="btnEditar" @click="abrirModalBorrarLista">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                    </button>
                </h2>
                <p class="text-center descripcion">
                    <textarea v-if="modoEdicion" v-model="descripcionEdit" :disabled="!modoEdicion" placeholder="Agrega una descripción..."
                        class="input-editar-desc" maxlength="255" rows="2" />
                    <span v-else>{{ descripcion }}</span>
                </p>
                <div class="grid-lista">
                    <div v-for="p in producciones" :key="p.produccion_id" class="produccion-lista-wrapper">
                        <div class="eliminar-wrapper">
                            <button v-if="modoEdicion" class="btn-eliminar-x" @click="eliminarProduccionLista(p.id)"
                                title="Eliminar de la lista">
                                <font-awesome-icon :icon="'xmark'" />
                            </button>
                            <ProductionCard
                                :produccion="{ id: p.produccion_id, titulo: p.titulo, puntuacion_critica: p.puntuacion_critica }"
                                :tamano="150" :detalles="false" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h2 class="nombre-lista">{{ nombreLista }} <button
                        v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id" class="btnEditar"
                        @click="abrirModalBorrarLista">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                    </button></h2>
                <p class="text-center">No hay producciones en esta lista.</p>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="dialogBorrarVisible" modal header="Eliminar lista" :style="{ width: '400px' }">
        <div>
            <p>¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.</p>
        </div>
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="dialogBorrarVisible = false">No</button>
            <button type="button" class="btn btn-primary" @click="borrarListaConfirmada">Sí, eliminar</button>
        </template>
    </Dialog>
    <Toast group="br" position="bottom-right" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductionCard from '@/components/ProductionCard.vue'
import Loading from '@/components/UI/Loading.vue'
import { Modal } from 'bootstrap'
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';

const route = useRoute()
const router = useRouter()
const producciones = ref([])
const cargando = ref(true)
const nombreLista = ref('')
const descripcion = ref('')
const modoEdicion = ref(false)
const lista = ref([])
const usuarioId = ref([])
const modalBorrarListaRef = ref(null)
const toast = useToast();
const dialogBorrarVisible = ref(false);
const nombreListaEdit = ref('');
const descripcionEdit = ref('');
let nombreListaOriginal = '';
let descripcionOriginal = '';

function setEditValues() {
    nombreListaEdit.value = nombreLista.value;
    descripcionEdit.value = descripcion.value;
    nombreListaOriginal = nombreLista.value;
    descripcionOriginal = descripcion.value;
}

async function toggleEdicion() {
    if (!modoEdicion.value) {
        setEditValues();
        modoEdicion.value = true;
    } else {
        const id = route.params.listaId;
        const cambios = {};
        if (nombreListaEdit.value !== nombreListaOriginal) {
            cambios.nombre = nombreListaEdit.value;
        } else if (descripcionEdit.value !== descripcionOriginal) {
            cambios.nombre = nombreListaEdit.value;
        }
        if (descripcionEdit.value !== descripcionOriginal) {
            cambios.descripcion = descripcionEdit.value;
        }
        if (Object.keys(cambios).length > 0) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    `https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas/${id}`,
                    cambios,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                nombreLista.value = nombreListaEdit.value;
                descripcion.value = descripcionEdit.value;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000, group: 'br' });
            } catch (error) {
                toast.add({ severity: 'warn', summary: 'Atención', detail: 'No se pudo actualizar la lista.', life: 3000, group: 'br' });
            }
        }
        modoEdicion.value = false;
    }
}

async function fetchProduccionesLista() {
    cargando.value = true
    try {
        const id = route.params.listaId
        const token = localStorage.getItem('token')
        const response = await axios.get(
            `https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        lista.value = response.data.data
        producciones.value = response.data.data.produccionesListas || []
        nombreLista.value = route.params.listaNombre
        if (producciones.value.length > 0 && producciones.value[0].lista_personalizada) {
            descripcion.value = producciones.value[0].lista_personalizada.descripcion
        }
        // Inicializa los valores editables
        setEditValues();
    } catch (error) {
        producciones.value = []
        nombreLista.value = 'Lista de reproducción'
        descripcion.value = ''
    } finally {
        cargando.value = false
    }
}

async function eliminarProduccionLista(produccionListaId) {
    try {
        const token = localStorage.getItem('token')
        await axios.delete(
            `https://movietrackapi.up.railway.app/api/v1/produccionesListas/${produccionListaId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        producciones.value = producciones.value.filter(p => p.id !== produccionListaId)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producción eliminada de la lista correctamente.', life: 3000, group: 'br' });
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'No se pudo eliminar la producción de la lista.', life: 3000, group: 'br' });
    }
}

function abrirModalBorrarLista() {
    dialogBorrarVisible.value = true;
}

async function borrarListaConfirmada() {
    try {
        const id = route.params.listaId
        const token = localStorage.getItem('token')
        await axios.delete(
            `https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        dialogBorrarVisible.value = false; // Cierra el Dialog
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lista eliminada correctamente', life: 3000, group: 'br' });
        router.push(`/perfil/${usuarioId.value.id}`)
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'No se pudo eliminar la lista.', life: 3000, group: 'br' });
    }
}

onMounted(() => {
    fetchProduccionesLista()
    usuarioId.value = JSON.parse(localStorage.getItem('user')) || {}
})
</script>
<style scoped>
.relleno {
    min-height: 12vh;
}

.contenedor {
    margin: 0 auto;
    margin-left: 10rem;
    margin-right: 10rem;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
    border-radius: 10px;
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
}

.nombre-lista {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
}

.grid-lista {
    margin-left: 1rem;
    margin-right: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    justify-content: center;
}

.produccion-lista-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.eliminar-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn-eliminar-x {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 2;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    font-size: 1.3rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
}

.btn-eliminar-x:hover {
    background: #c0392b;
    opacity: 1;
}

.btnEditar {
    background-color: transparent;
    border: none;
    color: var(--secondary-color);
}

.btnEditar:hover {
    color: var(--terciary-color);
}

.modal-content {
    background-color: var(--primary-color);
}

.input-editar-nombre {
    background-color: var(--cuaternary-color);
    border: none;
    border-bottom: 3px solid var(--terciary-color);
    text-align: center;
    color: black;
    font-weight: bold;
}

.input-editar-nombre:focus {
    outline: none;
}

.input-editar-desc {
    height: 35px;
    width: 100%; 
    background-color: var(--cuaternary-color);
    border: none;
    border-bottom: 3px solid var(--terciary-color);
    text-align: center;
    color: black;
}

.input-editar-desc:focus {
    outline: none;
}

.descripcion {
    margin-right: 2rem;
    margin-left: 2rem;
}

@media (min-width: 1450px) {
    .grid-lista {
        grid-template-columns: repeat(5, minmax(200px, 1fr));
    }
}

@media (max-width: 1270px) {
    .contenedor {
        margin-top: 2rem;
        margin-bottom: 1rem;
        margin-left: 7rem;
        margin-right: 7rem;
    }
}

@media (max-width: 768px) {
    .grid-lista {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    .contenedor {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        margin-left: 4.5rem;
        margin-right: 4.5rem;
    }

    .grid-lista {
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .relleno {
        display: none;
    }

    .nombre-lista {
        margin-left: 2rem;
        margin-right: 2rem;
    }

    .input-editar-nombre {
        max-width: 100%;
        margin-right: 0 !important;
        margin-bottom: 0.5rem;
    }

    .nombre-lista {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    .grid-lista {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .contenedor {
        border-radius: 0;
        margin-top: 10vh;
        margin-bottom: 0;
        margin-left: 0rem;
        margin-right: 0rem;
        min-height: 81.1vh;
        padding-top: 2rem;
    }

    .grid-lista {
        gap: 1rem;
    }
}
</style>