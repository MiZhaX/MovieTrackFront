<template>
    <div v-if="cargando" class="cargando">
        <img src="../../assets/img/cargando.gif" alt="Cargando...">
    </div>
</template>
<script setup>
const props = defineProps({
    cargando: Boolean
});
</script>
<style scoped>
.cargando {
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (max-width: 526px) {
    .cargando {
        margin-top: 7rem;
    }
}
</style>