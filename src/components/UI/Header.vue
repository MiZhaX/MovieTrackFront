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

            <RouterLink to="/about" class="enlace inicioSesion">Iniciar sesión</RouterLink>
        </div>
    </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import '../../assets/css/variables.css'
import Buscador from './Buscador.vue'

const route = useRoute();

const scrollY = ref(0);
const scrolled = ref(false);

const handleScroll = () => {
    scrollY.value = window.scrollY;
    scrolled.value = scrollY.value > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const isActive = (ruta) => {
    return route.path.startsWith(ruta);
};
</script>

<style scoped>
.cabecera {
    background-color: var(--secondary-color);
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    min-height: 13vh;
    transition: all 0.3s ease;
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
    border: 1px solid black;

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
    border: 1px solid var(--cuaternary-color);

    width: 100%;
    text-align: center;
}

.boton:hover {
    background-color: var(--cuaternary-color);
}

.inicioSesion {
    display: flex;
    align-items: center;

    font-size: large;
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
