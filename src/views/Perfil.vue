<template>
    <div class="perfil-layout">
        <div class="perfil-main">
            <Loading :cargando="cargando"></Loading>
            <div v-if="!cargando" class="perfil">
                <h2 class="text-center">{{ user.name }}</h2>
                <div class="perfil-top mb-4">
                    <div class="perfil-avatar-box">
                        <img :src="user.avatarUrl" alt="Avatar" class="perfil-avatar" />
                    </div>
                    <div class="perfil-user-info">
                        <p><strong>Email:</strong> {{ user.email }}</p>
                        <p><strong>Miembro desde:</strong> {{ user.joined }}</p>
                    </div>
                </div>
                <div class="perfil-favoritas-box mb-4">
                    <h3 class="seccionPerfil">Favoritas</h3>
                    <div class="favoritas-list">
                        <div v-if="user.favoriteMovies.length > 0" v-for="fav in user.favoriteMovies"
                            :key="fav.produccion_id" class="favorita-card">
                            <RouterLink :to="`/producciones/${fav.produccion_id}`">
                                <img :src="`/assets/img/producciones/${fav.produccion_id}.webp` || '/assets/img/default.png'"
                                    :alt="fav.title" />
                            </RouterLink>
                        </div>
                        <div v-else>
                            <p>¡Aún no tienes películas favoritas! Prueba a pulsar en la <font-awesome-icon
                                    :icon="['fas', 'star']" /> en alguna producción que te guste mucho.</p>
                        </div>
                    </div>
                </div>
                <div class="perfil-mid">
                    <div class="perfil-listas">
                        <div class="listas-header seccionPerfil">
                            <h3 class="m-0">Listas</h3>
                            <button class="add-list-btn" @click="abrirModal">
                                <font-awesome-icon :icon="'plus'" />
                            </button>
                        </div>
                        <div v-if="user.playlists && user.playlists.length > 0" class="listas-scroll">
                            <RouterLink v-for="lista in user.playlists" :key="lista.id"
                                :to="`/listas/${lista.nombre}/${lista.id}`" class="lista-card">
                                <div class="lista-card-img">
                                    <font-awesome-icon :icon="['fas', 'list']" size="2x" />
                                </div>
                                <div class="lista-card-nombre">{{ lista.nombre }}</div>
                            </RouterLink>
                        </div>
                        <div v-else>
                            <p>¡No tienes listas de reproducción aún! Prueba creando una.</p>
                        </div>
                    </div>
                </div>
                <div class="perfil-bottom">
                    <h3 class="seccionPerfil">Tus películas</h3>
                    <div class="tabs">
                        <button :class="{ active: tab === 'visualizadas' }" @click="tab = 'visualizadas'">Visualizadas
                            <font-awesome-icon :icon="'eye'" /></button>
                        <button :class="{ active: tab === 'quieroVer' }" @click="tab = 'quieroVer'">Quiero ver
                            <font-awesome-icon :icon="'stopwatch'" /></button>
                    </div>
                    <div :class="peliculasFiltradas.length > 0 ? 'peliculas-grid' : 'peliculas-empty'">
                        <div v-if="peliculasFiltradas.length > 0" v-for="pelicula in peliculasFiltradas"
                            :key="pelicula.id" class="pelicula-card">
                            <RouterLink :to="`/producciones/${pelicula.produccion_id}`">
                                <img :src="`/assets/img/producciones/${pelicula.produccion_id}.webp` || '/assets/img/default.png'"
                                    :alt="pelicula.title" />
                            </RouterLink>
                        </div>
                        <div v-else>
                            <p>No tienes películas en esta lista.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="dialogVisible" modal header="Crear nueva lista">
        <form @submit.prevent="crearLista" class="modal-form">
            <div class="modal-body">
                <div class="mb-3">
                    <label for="nombreLista" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombreLista" v-model="nuevaLista.nombre" required
                        maxlength="50">
                </div>
                <div class="mb-3">
                    <label for="descripcionLista" class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcionLista" v-model="nuevaLista.descripcion" rows="3"
                        maxlength="255"></textarea>
                </div>
            </div>
            <div class="modal-footer d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="dialogVisible = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear</button>
            </div>
        </form>
    </Dialog>
    <Toast group="br" position="bottom-right" />
</template>

<script setup>
import Loading from '@/components/UI/Loading.vue';
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast';

const user = ref({
    name: '',
    email: '',
    avatarUrl: '',
    joined: '',
    favoriteMovies: [],
    playlists: []
})

const visualizadas = ref([]);
const quieroVer = ref([]);
const cargando = ref(true);
const dialogVisible = ref(false);
const toast = useToast();

const tab = ref('visualizadas')

const peliculasFiltradas = computed(() =>
    tab.value === 'visualizadas' ? visualizadas.value : quieroVer.value
)

// Modal y formulario
const nuevaLista = ref({
    nombre: '',
    descripcion: ''
});
const modalRef = ref(null);

function abrirModal() {
    dialogVisible.value = true;
    nuevaLista.value.nombre = '';
    nuevaLista.value.descripcion = '';
}

async function crearLista() {
    if (!nuevaLista.value.nombre.trim()) return;
    try {
        const token = localStorage.getItem('token')
        const localUser = localStorage.getItem('user')
        if (!localUser) return []
        const userParse = JSON.parse(localUser)
        await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas',
            {
                nombre: nuevaLista.value.nombre,
                descripcion: nuevaLista.value.descripcion,
                usuario_id: userParse.id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        dialogVisible.value = false;
        const listasActualizadas = await fetchListasReproduccion();
        user.value.playlists = listasActualizadas.data || listasActualizadas
        toast.add({ severity: 'success', summary: 'Lista creada', detail: 'Lista creada correctamente', life: 3000, group: 'br' });
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Error al crear la lista', life: 3000, group: 'br' });
    }
}

onMounted(async () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        try {
            cargando.value = true;
            const userData = JSON.parse(storedUser)
            user.value = {
                name: userData.name || '',
                email: userData.email || '',
                avatarUrl: `https://ui-avatars.com/api/?name=${userData.name || ''}`,
                joined: userData.created_at ? formatearFecha(userData.created_at) : '',
                favoriteMovies: [],
                playlists: []
            }
            // Espera a que todas las promesas terminen
            const [favs, watched, toWatch, playlists] = await Promise.all([
                fetchProduccionesFavoritas(),
                fetchProduccionesVistas(),
                fetchProduccionesPorVer(),
                fetchListasReproduccion()
            ])
            user.value.favoriteMovies = favs.data || favs
            user.value.playlists = playlists.data || playlists
            visualizadas.value = (watched.data || watched).map(marca => ({
                id: marca.produccion_id,
                produccion_id: marca.produccion_id,
                title: marca.titulo || '',
            }))
            quieroVer.value = (toWatch.data || toWatch).map(marca => ({
                id: marca.produccion_id,
                produccion_id: marca.produccion_id,
                title: marca.titulo || '',
            }))
        } catch (e) {
            toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al cargar datos del usuario', life: 3000, group: 'br' });
        } finally {
            cargando.value = false;
        }
    }
})

function formatearFecha(fechaIso) {
    if (!fechaIso) return ''
    const [date] = fechaIso.split('T')
    const [a, m, d] = date.split('-')
    return `${d}/${m}/${a}`
}

async function fetchProduccionesFavoritas() {
    const localUser = localStorage.getItem('user')
    if (!localUser) return []
    const user = JSON.parse(localUser)
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/marcarProducciones?usuario_id[eq]=${user.id}&favorita[eq]=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data || []
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al obtener películas favoritas', life: 3000, group: 'br' });
        return []
    }
}

async function fetchProduccionesVistas() {
    const localUser = localStorage.getItem('user')
    if (!localUser) return []
    const user = JSON.parse(localUser)
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/marcarProducciones?usuario_id[eq]=${user.id}&marca[eq]=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data || []
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al obtener películas visualizadas', life: 3000, group: 'br' });
        return []
    }
}

async function fetchProduccionesPorVer() {
    const localUser = localStorage.getItem('user')
    if (!localUser) return []
    const user = JSON.parse(localUser)
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/marcarProducciones?usuario_id[eq]=${user.id}&marca[eq]=2`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data || []
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al obtener peliculas por ver', life: 3000, group: 'br' });
        return []
    }
}

async function fetchListasReproduccion() {
    const localUser = localStorage.getItem('user')
    if (!localUser) return []
    const user = JSON.parse(localUser)
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`https://movietrackapi.up.railway.app/api/v1/listasPersonalizadas?usuario_id[eq]=${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data || []
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al obtener listas personalizadas', life: 3000, group: 'br' });
        return []
    }
}
</script>

<style scoped>
.perfil-layout {
    min-height: 100vh;
    padding: 2rem 0;
    padding-top: 7rem;
}

.perfil-main {
    background: #e6e6e6;
    max-width: 900px;
    margin: 0 auto;
    border-radius: 16px;
    padding: 2rem 2.5rem;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.perfil-top {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
}

.seccionPerfil {
    background-color: var(--primary-color);
    padding: 0.5rem;
    border-radius: 10px;
}

.perfil-avatar-box {
    flex: 0 0 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.perfil-avatar {
    width: 140px;
    height: 140px;
    border-radius: 16px;
    background: #fff;
    object-fit: cover;
    border: 2px solid #888;
}

.perfil-favoritas-box {
    flex: 1;
}

.favoritas-list {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--terciary-color) transparent;
}

.favoritas-list::-webkit-scrollbar {
    height: 8px;
    background: transparent;
}

.favoritas-list::-webkit-scrollbar-thumb {
    background: var(--terciary-color);
    border-radius: 8px;
}

.favoritas-list::-webkit-scrollbar-track {
    background: transparent;
}

.favorita-card img {
    width: 120px;
    border-radius: 8px;
    object-fit: cover;
    background: #fff;
    border: 1px solid #bbb;
}

.perfil-mid {
    display: flex;
    gap: 2rem;
}

.perfil-listas {
    flex: 1;
}

.listas-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-list-btn {
    background: #ffe066;
    border: none;
    border-radius: 50%;
    cursor: pointer;
}

.add-list-btn:hover {
    background-color: var(--quintary-color);
}

.listas-scroll {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
}

.lista-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 90px;
    text-decoration: none;
    color: var(--secondary-color)
}

.lista-card:hover {
    text-decoration: none;
    color: black;
}

.lista-card-img {
    width: 70px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ddd;
    border-radius: 8px;
}

.lista-card-nombre {
    margin-top: 0.5rem;
    font-weight: bold;
    text-align: center;
    font-size: 1rem;
    word-break: break-word;
}

.modal-form {
    background: var(--secondary-color);
    border-radius: 10px;
}

.perfil-bottom {
    margin-top: 1.5rem;
}

.tabs {
    display: flex;
    gap: 0.5rem;
}

.tabs button {
    background: #ffe066;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    cursor: pointer;
    color: #333;
    transition: background 0.2s;
}

.tabs button.active {
    background: #fff;
    color: #222;
    border-bottom: 2px solid #ffe066;
}

.peliculas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 1rem;
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 0 0 12px 12px;
    height: 220px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--terciary-color) transparent;
}

.peliculas-grid::-webkit-scrollbar {
    height: 8px;
    background: transparent;
}

.peliculas-grid::-webkit-scrollbar-thumb {
    background: var(--terciary-color);
    border-radius: 8px;
}

.peliculas-grid::-webkit-scrollbar-track {
    background: transparent;
}

.peliculas-empty {
    gap: 1rem;
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 0 0 12px 12px;
    min-height: 220px;
    max-height: 260px;
    overflow-y: auto;
}

.pelicula-card img {
    width: 120px;
    object-fit: cover;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #bbb;
}

.form-control:focus {
    border: none;
    box-shadow: none;
}
</style>