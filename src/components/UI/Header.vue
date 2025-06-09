<template>
    <nav :class="{ fixed: true, reducido: scrolled }">
        <div class="cabecera">
            <RouterLink to="/" class="enlace linkLogo">
                <img src="../../assets/img/logo.png" alt="logoMovieTrack" class="logo">
                <h1 class="textoLogo">MovieTrack</h1>
            </RouterLink>

            <div class="navegador">
                <Buscador />

                <div v-if="!scrolled" class="botones">
                    <RouterLink to="/peliculas" class="enlace boton" :class="{ activa: isActive('/peliculas') }">Películas</RouterLink>
                    <RouterLink to="/series" class="enlace boton" :class="{ activa: isActive('/series') }">Series</RouterLink>
                    <RouterLink to="/ranking" class="enlace boton" :class="{ activa: isActive('/ranking') }">Ranking</RouterLink>
                </div>
            </div>

            <div v-if="!user">
                <RouterLink to="/login" class="enlace inicioSesion">Iniciar sesión</RouterLink>
            </div>
            <div v-else class="d-flex align-items-center gap-2">
                <RouterLink :to="`/perfil/${user.id}`" class="enlace inicioSesion">
                    Mi Perfil
                </RouterLink>
                <p class="enlace inicioSesion" @click="logout">
                    Cerrar sesión
                </p>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '../../assets/css/variables.css'
import Buscador from './Buscador.vue'

const route = useRoute();
const router = useRouter();

const scrollY = ref(0);
const scrolled = ref(false);

const user = ref(null);

const handleScroll = () => {
    scrollY.value = window.scrollY;
    scrolled.value = scrollY.value > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    const userData = localStorage.getItem('user');
    user.value = userData ? JSON.parse(userData) : null;
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(
    () => route.fullPath,
    () => {
        const userData = localStorage.getItem('user');
        user.value = userData ? JSON.parse(userData) : null;
    }
);

const isActive = (ruta) => {
    return route.path.startsWith(ruta);
};

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    user.value = null;
    router.push('/');
}
</script>

<style scoped>
.cabecera {
    background-color: var(--secondary-color);
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    min-height: 13vh;
    transition: all 0.3s ease;
    align-items: center;
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

/* AL HACER SCROLL */
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
</style>
