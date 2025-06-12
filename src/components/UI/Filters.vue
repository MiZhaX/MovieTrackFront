<template>
    <div class="botonesFiltros">
        <select href="" class="orderby boton">
            <option value="defecto">≡ Filtrar</option>
            <option value="defecto">WIP</option>
            <!-- <option value="defecto">Valoración (Crítica)</option>
            <option value="defecto">Valoración (Usuarios)</option> -->
        </select>
    </div>
</template>
<script></script>
<style scoped>
.botonesFiltros {
    display: flex;
    gap: 1rem;
    margin: 1rem;
    width: 15%;
}

.boton {
    font-size: large;

    background-color: var(--terciary-color);
    padding: 5px;
    border-radius: 10px;
    border: 1px solid var(--cuaternary-color);

    /* width: 100%; */
    text-align: center;
    outline: none;
    color: black;
}

.boton option {
    background-color: white;
}

.orderby option:checked {
    background-color: var(--cuaternary-color);
}
</style>