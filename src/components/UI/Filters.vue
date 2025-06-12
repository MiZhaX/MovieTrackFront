<template>
    <div>
        <button class="boton boton-filtros-movil" @click="togglePanel">
            Filtros
        </button>

        <OverlayPanel ref="panel" :dismissable="true">
            <div class="botonesFiltrosColumn">
                <select class="generos boton" @change="onGeneroChange" v-model="generoSeleccionadoLocal">
                    <option value="">Género</option>
                    <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                        {{ genero.nombre }}
                    </option>
                </select>
                <select class="valoracion boton" @change="onValoracionChange" v-model="valoracionSeleccionadaLocal">
                    <option value="">Valoración Mínima</option>
                    <option v-for="n in 11" :key="n - 1" :value="n - 1">
                        {{ n - 1 }}
                    </option>
                </select>
                <button class="boton boton-reset" @click="resetFiltros">
                    Restablecer filtros
                </button>
            </div>
        </OverlayPanel>

        <Toast group="br" position="bottom-right" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import OverlayPanel from 'primevue/overlaypanel';
import axios from 'axios';

const emit = defineEmits(['filtrar-genero', 'filtrar-valoracion']);
const props = defineProps({
    generoSeleccionado: {
        type: [String, Number],
        default: ''
    },
    valoracionSeleccionada: {
        type: [String, Number],
        default: ''
    }
});

const generos = ref([]);
const toast = useToast();
const generoSeleccionadoLocal = ref(props.generoSeleccionado);
const valoracionSeleccionadaLocal = ref(props.valoracionSeleccionada);

const panel = ref(null);

const onGeneroChange = (event) => {
    const generoId = event.target.value;
    emit('filtrar-genero', generoId);
};

const onValoracionChange = (event) => {
    const valoracion = event.target.value;
    emit('filtrar-valoracion', valoracion);
};

const fetchGeneros = async () => {
    try {
        const response = await axios.get(
            `https://movietrackapi.up.railway.app/api/v1/generos`
        );
        generos.value = response.data.data;
    } catch (error) {
        toast.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Error al obtener los géneros.',
            life: 3000,
            group: 'br'
        });
    }
};

watch(() => props.generoSeleccionado, (nuevo) => {
    generoSeleccionadoLocal.value = nuevo;
});
watch(() => props.valoracionSeleccionada, (nuevo) => {
    valoracionSeleccionadaLocal.value = nuevo;
});

onMounted(() => {
    fetchGeneros();
});

const togglePanel = (event) => {
    panel.value.toggle(event);
};

const resetFiltros = () => {
    generoSeleccionadoLocal.value = '';
    valoracionSeleccionadaLocal.value = '';
    emit('filtrar-genero', '');
    emit('filtrar-valoracion', '');
};
</script>

<style scoped>
.botonesFiltrosColumn {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 180px;
    padding: 0.5rem 0;
}

.boton {
    font-size: large;
    background-color: var(--terciary-color);
    padding: 5px;
    border-radius: 10px;
    border: 1px solid var(--cuaternary-color);
    text-align: center;
    outline: none;
    color: black;
}

.boton option {
    background-color: white;
}

.boton-filtros-movil {
    width: 20%;
    margin: 1rem 1.5rem;
}

.boton-reset {
    background-color: var(--terciary-color);
    color: black;
}

@media (max-width: 768px) {
    .boton {
        font-size: medium;
    }
}

@media (max-width: 425px) {
    .boton-filtros-movil {
        width: 40%;
    }
}
</style>