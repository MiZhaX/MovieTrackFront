<template>
    <footer class="footer">
        <nav class="footer-nav" aria-label="Navegación de pie de página">
            <RouterLink to="/" class="footer-link">Inicio</RouterLink>
            <RouterLink to="/peliculas" class="footer-link">Películas</RouterLink>
            <RouterLink to="/series" class="footer-link">Series</RouterLink>
            <RouterLink to="/ranking" class="footer-link">Ranking</RouterLink>
            <RouterLink v-if="user" :to="`/perfil`" class="footer-link">Mi Perfil</RouterLink>
            <RouterLink v-else :to="`/login`" class="footer-link">Mi Perfil</RouterLink>
        </nav>
        <p class="footer-copy">© {{ new Date().getFullYear() }} MovieTrack</p>
        <p class="footer-copy">Las imágenes de los pósters han sido obtenidas de <a href="https://www.themoviedb.org/" target="_blank">TMDb</a>. Todos los derechos pertenecen a sus respectivos propietarios. Este proyecto no tiene fines comerciales.</p>
    </footer>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
import '../../assets/css/variables.css'
const user = ref(null);

const userData = localStorage.getItem('user');
user.value = userData ? JSON.parse(userData) : null;
</script>

<style>
.footer {
    background-color: var(--quintary-color);
    padding: 2vh 0 1vh 0;
    text-align: center;
}

.footer-nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}

.footer-link {
    color: black;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}

.footer-link:hover {
    color: var(--terciary-color);
}

.footer-copy {
    font-size: 0.95rem;
    color: black;
    margin: 0;
}
</style>