<template>
  <main>
    <div class="relleno"></div>
    <div class="contenedor">
      <section class="hero">
        <div class="hero-content">
          <h1>Descubre, organiza y comparte tus películas y series favoritas</h1>
          <p>MovieTrack te ayuda a llevar el control de lo que ves, lo que quieres ver y tus listas personalizadas.</p>
          <router-link to="/login" class="btn-principal">Comienza ahora</router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.relleno {
  min-height: 12vh;
}

.contenedor {
  margin: 0 auto;
  background-color: var(--cuaternary-color);
  padding-bottom: 3rem;
  overflow: hidden;
}

.hero {
  position: relative;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/assets/img/landing-hero.jpg');
  background-size: cover;
  background-position: center;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  border-radius: 10px;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.btn-principal {
  margin-top: 1rem;
  padding: 0.7rem 2rem;
  border-radius: 5px;
  background: var(--secondary-color);
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-principal:hover {
  background: var(--primary-color);
}
</style>