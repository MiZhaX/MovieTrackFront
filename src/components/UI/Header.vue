<template>
    <nav :class="{ fixed: true, reducido: scrolled }">
        <div class="cabecera">
            <RouterLink to="/" class="enlace linkLogo">
                <img src="../../assets/img/logo.png" alt="logoMovieTrack" class="logo">
                <h1 class="textoLogo">MovieTrack</h1>
            </RouterLink>

            <div class="navegador">
                <Buscador />

                <div v-if="!scrolled" class="botones d-none d-md-flex">
                    <RouterLink to="/peliculas" class="enlace boton" :class="{ activa: isActive('/peliculas') }">
                        Películas</RouterLink>
                    <RouterLink to="/series" class="enlace boton" :class="{ activa: isActive('/series') }">Series
                    </RouterLink>
                    <RouterLink to="/ranking" class="enlace boton" :class="{ activa: isActive('/ranking') }">Ranking
                    </RouterLink>
                </div>

                <button class="menu-toggle d-md-none" @click="toggleMenu">
                    <i :class="'pi pi-bars'"></i>
                </button>
            </div>

            <div v-if="!user" class="d-none d-md-flex">
                <RouterLink to="/login" class="enlace inicioSesion">Iniciar sesión</RouterLink>
            </div>
            <div v-else class="d-none d-md-flex d-flex align-items-center gap-2">
                <RouterLink :to="`/perfil/${user.id}`" class="enlace inicioSesion">
                    Mi Perfil
                </RouterLink>
                <p class="enlace inicioSesion" @click="logout">
                    Cerrar sesión
                </p>
            </div>

            <Menu :model="menuItems" :popup="true" ref="menu" />
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '../../assets/css/variables.css';
import Buscador from './Buscador.vue';
import Menu from 'primevue/menu';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const scrollY = ref(0);
const scrolled = ref(false);

const user = ref(null);

const menu = ref(null);
const menuOpen = ref(false);
const menuItems = ref([]);

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
    if (menuOpen.value) {
        menu.value.show(event);
    } else {
        menu.value.hide();
    }
};

const updateMenuItems = () => {
    menuItems.value = [
        { label: 'Películas', command: () => router.push('/peliculas') },
        { label: 'Series', command: () => router.push('/series') },
        { label: 'Ranking', command: () => router.push('/ranking') },
        { separator: true },
        user.value
            ? { label: 'Mi Perfil', command: () => router.push(`/perfil/${user.value.id}`) }
            : { label: 'Iniciar sesión', command: () => router.push('/login') },
        user.value
            ? { label: 'Cerrar sesión', command: logout }
            : null,
    ].filter(item => item && item.label);
};

updateMenuItems();

const handleScroll = () => {
    scrollY.value = window.scrollY;
    scrolled.value = scrollY.value > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    const userData = localStorage.getItem('user');
    user.value = userData ? JSON.parse(userData) : null;
    updateMenuItems();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(
    () => route.fullPath,
    () => {
        const userData = localStorage.getItem('user');
        user.value = userData ? JSON.parse(userData) : null;
        updateMenuItems();
    }
);

watch(user, updateMenuItems);

const isActive = (ruta) => {
    return route.path.startsWith(ruta);
};

async function logout() {
    const token = localStorage.getItem('token');
    try {
        if (token) {
            await axios.post(
                'https://movietrackapi.up.railway.app/api/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }
    } catch (e) {
    } finally {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        user.value = null;
        updateMenuItems();
        router.push('/');
    }
}
</script>

<style scoped>
.cabecera {
    background-color: var(--secondary-color);
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    min-height: 12vh;
    transition: all 0.3s ease;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    box-shadow: 0 4px 16px -4px rgba(255, 217, 102, 0.527);
}

.linkLogo {
    display: flex;
    align-items: center;
}

.enlace {
    text-decoration: none;
    color: black;
}

.logo {
    height: 90px;
    width: 90px;
    transition: all 0.3s ease;
}


.textoLogo {
    color: white;
    transition: opacity 0.3s ease;
    margin-bottom: 0;
}

.navegador {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 5px;

    width: 50%;
}

.buscador {
    background-color: var(--terciary-color);

    height: 40%;
}

.botones {
    display: flex;
    gap: 10px;
}

.boton {
    font-size: large;

    background-color: var(--terciary-color);
    padding: 5px;
    border-radius: 10px;
    width: 100%;
    text-align: center;
}

.boton:hover {
    background-color: var(--cuaternary-color);
}

.inicioSesion {
    display: flex;
    align-items: center;

    font-size: x-large;
    font-weight: bold;
    color: var(--terciary-color);
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    margin: 1rem;
    cursor: pointer;
}

.inicioSesion:hover {
    background-color: var(--terciary-color);
    color: black;
    border-radius: 5px;
}

.boton.activa {
    background-color: var(--cuaternary-color);
    cursor: default;
}

nav.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    transition: background-color 0.3s ease;
}

nav.reducido .cabecera {
    min-height: 6vh;
    justify-content: space-evenly;
}

nav.reducido .navegador {
    justify-content: center;
}

nav.reducido .logo {
    height: 60px;
    width: 60px;
}

nav.reducido .textoLogo {
    font-size: xx-large;
    transition: opacity 0.3s ease;
}

.textoLogo {
    display: inline-block;
}

nav.reducido .textoLogo {
    min-width: 0;
}

.d-none {
    display: none !important;
}

.d-md-flex {
    display: flex !important;
}

.d-md-none {
    display: none !important;
}

@media (max-width: 930px) {
    .d-md-flex {
        display: none !important;
    }

    .d-md-none {
        display: block !important;
    }

    .logo {
        height: 60px;
        width: 60px;
        transition: all 0.3s ease;
    }

    .textoLogo {
        color: white;
        font-size: xx-large;
        transition: opacity 0.3s ease;
    }

    .cabecera {
        justify-content: space-around;
    }

    .navegador {
        flex-direction: row;
    }
}

@media (max-width: 1300px) {
    .navegador {
        width: 40%;
    }

    .boton {
        font-size: 15px;
    }

    .inicioSesion {
        font-size: large;
    }
}

@media (max-width: 1300px) {
    .textoLogo {
        font-size: x-large;
    }
}

@media (max-width: 768px) {
    .cabecera {
        min-height: 10vh;
    }
}

@media (max-width: 650px) {
    .cabecera {
        flex-direction: column;
    }

    .navegador {
        flex-direction: row;
        width: 100%;
        justify-content: center;
    }
}

.menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--terciary-color);
}
</style>
