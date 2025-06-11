<template>
    <main>
        <div class="contenedor">
            <Loading :cargando="cargando"></Loading>
            <div v-if="!cargando && producciones" class="detalles">
                <div v-if="producciones.length > 0">
                    <h2 class="nombre-lista">
                        {{ nombreLista }}
                        <button v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id"
                            class="btnEditar" @click="modoEdicion = !modoEdicion">
                            <font-awesome-icon :icon="!modoEdicion ? 'pen' : 'pen-ruler'" />
                        </button>
                        <button v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id"
                            class="btnEditar" @click="abrirModalBorrarLista">
                            <font-awesome-icon :icon="['fas', 'trash-can']" />
                        </button>
                    </h2>
                    <p class="text-center">{{ descripcion }}</p>
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
                            v-if="lista.usuario_id && usuarioId.id && lista.usuario_id == usuarioId.id"
                            class="btnEditar" @click="abrirModalBorrarLista">
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
    </main>
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
.contenedor {
    margin-left: 10rem;
    margin-right: 10rem;
    background-color: var(--cuaternary-color);
    min-height: 89.1vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 7rem;
}

.nombre-lista {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
}

.grid-lista {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
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
</style>