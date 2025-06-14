<template>
    <div class="contenedor">
        <h1 class="text-center">Panel de Administrador</h1>
        <div class="tabs">
            <button :class="{ active: tab === 'producciones' }" @click="tab = 'producciones'">Producciones</button>
            <button :class="{ active: tab === 'personas' }" @click="tab = 'personas'">Personas</button>
        </div>
        <section v-if="tab === 'producciones'" class="section">
            <div class="crear-persona">
                <h2 class="text-center">Crear Producción</h2>
                <form @submit.prevent="crearProduccion" class="mr-8 ml-8">
                    <input v-model="nuevaProduccion.titulo" placeholder="Título" required />
                    <input v-model="nuevaProduccion.titulo_original" placeholder="Título original" required />
                    <select v-model="nuevaProduccion.tipo" required>
                        <option disabled value="">Tipo</option>
                        <option value="pelicula">Película</option>
                        <option value="serie">Serie</option>
                    </select>
                    <select v-model="nuevaProduccion.genero_id" required>
                        <option disabled value="">Género</option>
                        <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                            {{ genero.nombre }}
                        </option>
                    </select>
                    <textarea v-model="nuevaProduccion.sinopsis" placeholder="Sinopsis" required></textarea>
                    <input v-model="nuevaProduccion.duracion" placeholder="Duración (minutos)" type="number" min="1"
                        required />
                    <input v-model="nuevaProduccion.fecha_estreno" placeholder="Fecha de estreno" type="date"
                        required />
                    <input type="file" @change="onFileChangeProduccion" accept="image/*" required />
                    <input v-model="nuevaProduccion.puntuacion_critica" placeholder="Puntuación crítica" type="number"
                        min="0" max="10" step="0.1" required />
                    <button type="submit">Crear Producción</button>
                </form>
            </div>
            <div class="asociar-actor">
                <h2 class="text-center mt-8">Asociar actor</h2>
                <form @submit.prevent="asociarActor" class="mr-8 ml-8">
                    <label>Buscar Producción</label>
                    <div class="dropdown-container">
                        <input v-model="busquedaProduccion" @input="buscarProducciones"
                            placeholder="Buscar producción..." class="input" autocomplete="off"
                            ref="produccionInputRef" />
                        <ul v-if="resultadosProduccion.length && mostrarDropdownProduccion" class="dropdown-list">
                            <li v-for="prod in resultadosProduccion" :key="prod.id" @click="seleccionarProduccion(prod)"
                                class="dropdown-item">
                                <img :src="prod.poster" alt="poster" style="width:30px;height:auto;margin-right:8px;" />
                                {{ prod.titulo }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="produccionSeleccionada" class="seleccionado">
                        <span>Producción seleccionada: <b>{{ produccionSeleccionada.titulo }}</b></span>
                        <button type="button" @click="produccionSeleccionada = null">Quitar</button>
                    </div>

                    <label class="mt-2">Buscar Persona</label>
                    <div class="dropdown-container">
                        <input v-model="busquedaPersona" @input="buscarPersonas" placeholder="Buscar persona..."
                            class="input" autocomplete="off" ref="personaInputRef" />
                        <ul v-if="resultadosPersona.length && mostrarDropdownPersona" class="dropdown-list">
                            <li v-for="persona in resultadosPersona" :key="persona.id"
                                @click="seleccionarPersona(persona)" class="dropdown-item">
                                <img :src="persona.imagen" alt="img" style="width:30px;height:auto;margin-right:8px;" />
                                {{ persona.nombre }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="personaSeleccionada" class="seleccionado">
                        <span>Persona seleccionada: <b>{{ personaSeleccionada.nombre }}</b></span>
                        <button type="button" @click="personaSeleccionada = null">Quitar</button>
                    </div>

                    <input v-model="rolActor" placeholder="Papel" required class="input" />

                    <button type="submit" class="mt-2"
                        :disabled="!produccionSeleccionada || !personaSeleccionada || !rolActor.trim()">
                        Asociar Actor
                    </button>
                </form>
            </div>
            <div class="asociar-director">
                <h2 class="text-center mt-8">Asociar director</h2>
                <form @submit.prevent="asociarDirector" class="mr-8 ml-8">
                    <label>Buscar Producción</label>
                    <div class="dropdown-container">
                        <input v-model="busquedaProduccionDirector" @input="buscarProduccionesDirector"
                            placeholder="Buscar producción..." class="input" autocomplete="off"
                            ref="produccionDirectorInputRef" />
                        <ul v-if="resultadosProduccionDirector.length && mostrarDropdownProduccionDirector" class="dropdown-list">
                            <li v-for="prod in resultadosProduccionDirector" :key="prod.id" @click="seleccionarProduccionDirector(prod)"
                                class="dropdown-item">
                                <img :src="prod.poster" alt="poster" style="width:30px;height:auto;margin-right:8px;" />
                                {{ prod.titulo }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="produccionDirectorSeleccionada" class="seleccionado">
                        <span>Producción seleccionada: <b>{{ produccionDirectorSeleccionada.titulo }}</b></span>
                        <button type="button" @click="produccionDirectorSeleccionada = null">Quitar</button>
                    </div>

                    <label class="mt-2">Buscar Persona</label>
                    <div class="dropdown-container">
                        <input v-model="busquedaPersonaDirector" @input="buscarPersonasDirector" placeholder="Buscar persona..."
                            class="input" autocomplete="off" ref="personaDirectorInputRef" />
                        <ul v-if="resultadosPersonaDirector.length && mostrarDropdownPersonaDirector" class="dropdown-list">
                            <li v-for="persona in resultadosPersonaDirector" :key="persona.id"
                                @click="seleccionarPersonaDirector(persona)" class="dropdown-item">
                                <img :src="persona.imagen" alt="img" style="width:30px;height:auto;margin-right:8px;" />
                                {{ persona.nombre }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="personaDirectorSeleccionada" class="seleccionado">
                        <span>Persona seleccionada: <b>{{ personaDirectorSeleccionada.nombre }}</b></span>
                        <button type="button" @click="personaDirectorSeleccionada = null">Quitar</button>
                    </div>

                    <button type="submit" class="mt-2"
                        :disabled="!produccionDirectorSeleccionada || !personaDirectorSeleccionada">
                        Asociar Director
                    </button>
                </form>
            </div>
        </section>
        <section v-else class="section">
            <h2 class="text-center">Crear Persona</h2>
            <form @submit.prevent="crearPersona" class="mr-8 ml-8">
                <input v-model="nuevaPersona.nombre" placeholder="Nombre" required />
                <input v-model="nuevaPersona.fecha_nacimiento" placeholder="Fecha de nacimiento" type="date" required />
                <textarea v-model="nuevaPersona.biografia" placeholder="Biografía" required></textarea>
                <input type="file" @change="onFileChangePersona" accept="image/*" required />
                <button type="submit">Crear Persona</button>
            </form>
        </section>
    </div>
    <Toast group="br" position="bottom-right" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();
const tab = ref('producciones');
const nuevaProduccion = ref({
    titulo: '',
    titulo_original: '',
    tipo: '',
    genero_id: '',
    sinopsis: '',
    duracion: '',
    fecha_estreno: '',
    puntuacion_critica: ''
});
const produccionFile = ref(null);
const personaFile = ref(null);
const generos = ref([]);
const busquedaProduccion = ref('');
const resultadosProduccion = ref([]);
const mostrarDropdownProduccion = ref(false);
const produccionSeleccionada = ref(null);

const busquedaPersona = ref('');
const resultadosPersona = ref([]);
const mostrarDropdownPersona = ref(false);
const personaSeleccionada = ref(null);

const rolActor = ref('');

// Estado y refs para asociar director
const busquedaProduccionDirector = ref('');
const resultadosProduccionDirector = ref([]);
const mostrarDropdownProduccionDirector = ref(false);
const produccionDirectorSeleccionada = ref(null);

const busquedaPersonaDirector = ref('');
const resultadosPersonaDirector = ref([]);
const mostrarDropdownPersonaDirector = ref(false);
const personaDirectorSeleccionada = ref(null);

let timeoutProduccion = null;
let timeoutPersona = null;

let timeoutProduccionDirector = null;
let timeoutPersonaDirector = null;

const produccionInputRef = ref(null);
const personaInputRef = ref(null);

const produccionDirectorInputRef = ref(null);
const personaDirectorInputRef = ref(null);

onMounted(async () => {
    try {
        const res = await axios.get('https://movietrackapi.up.railway.app/api/v1/generos');
        generos.value = res.data.data;
    } catch (e) {
        generos.value = [];
    }
});

const onFileChangeProduccion = (e) => {
    produccionFile.value = e.target.files[0];
};
const onFileChangePersona = (e) => {
    personaFile.value = e.target.files[0];
};

const crearProduccion = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }

    const formData = new FormData();
    formData.append('titulo', nuevaProduccion.value.titulo);
    formData.append('titulo_original', nuevaProduccion.value.titulo_original);
    formData.append('tipo', nuevaProduccion.value.tipo);
    formData.append('genero_id', nuevaProduccion.value.genero_id);
    formData.append('sinopsis', nuevaProduccion.value.sinopsis);
    formData.append('duracion', nuevaProduccion.value.duracion);
    formData.append('fecha_estreno', nuevaProduccion.value.fecha_estreno);
    formData.append('puntuacion_critica', nuevaProduccion.value.puntuacion_critica);
    formData.append('puntuacion_usuarios', 0);
    if (produccionFile.value) {
        formData.append('poster', produccionFile.value);
    }

    try {
        const response = await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/producciones',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        if (response && response.status === 201 && response.data) {
            toast.add({ severity: 'success', summary: 'Producción Creada', detail: 'Se ha creado la producción correctamente', life: 3000, group: 'br' });
            nuevaProduccion.value = {
                titulo: '',
                titulo_original: '',
                tipo: '',
                genero_id: '',
                sinopsis: '',
                duracion: '',
                fecha_estreno: '',
                puntuacion_critica: ''
            };
            produccionFile.value = null;
        } else {
            console.log(response.data)
            toast.add({ severity: 'warn', summary: 'Error', detail: 'No se ha creado la producción', life: 3000, group: 'br' });
        }
    } catch (e) {
        console.error('Error al crear producción:', e);
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se ha creado la producción', life: 3000, group: 'br' });
    }
};

const nuevaPersona = ref({
    nombre: '',
    fecha_nacimiento: '',
    biografia: ''
});

const crearPersona = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }
    const formData = new FormData();
    formData.append('nombre', nuevaPersona.value.nombre);
    formData.append('fecha_nacimiento', nuevaPersona.value.fecha_nacimiento);
    formData.append('biografia', nuevaPersona.value.biografia);
    if (personaFile.value) {
        formData.append('imagen', personaFile.value);
    }
    try {
        const response = await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/personas',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        if (response && response.status === 201 && response.data) {
            toast.add({ severity: 'success', summary: 'Persona Creada', detail: 'Se ha creado la persona correctamente', life: 3000, group: 'br' });
            nuevaPersona.value = {
                nombre: '',
                fecha_nacimiento: '',
                biografia: ''
            };
            personaFile.value = null;
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: 'No se ha creado la persona', life: 3000, group: 'br' });
        }
    } catch (e) {
        console.error('Error al crear persona:', e);
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se ha creado la persona', life: 3000, group: 'br' });
    }
};

const buscarProducciones = () => {
    clearTimeout(timeoutProduccion);
    if (busquedaProduccion.value.trim().length < 2) {
        resultadosProduccion.value = [];
        mostrarDropdownProduccion.value = false;
        return;
    }
    timeoutProduccion = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/producciones', {
                params: { 'titulo[like]': busquedaProduccion.value }
            });
            resultadosProduccion.value = data.data;
            mostrarDropdownProduccion.value = true;
        } catch {
            resultadosProduccion.value = [];
            mostrarDropdownProduccion.value = false;
        }
    }, 300);
};

const seleccionarProduccion = (prod) => {
    produccionSeleccionada.value = prod;
    mostrarDropdownProduccion.value = false;
    resultadosProduccion.value = [];
    busquedaProduccion.value = prod.titulo;
};

const buscarPersonas = () => {
    clearTimeout(timeoutPersona);
    if (busquedaPersona.value.trim().length < 2) {
        resultadosPersona.value = [];
        mostrarDropdownPersona.value = false;
        return;
    }
    timeoutPersona = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/personas', {
                params: { 'nombre[like]': busquedaPersona.value }
            });
            resultadosPersona.value = data.data;
            mostrarDropdownPersona.value = true;
        } catch {
            resultadosPersona.value = [];
            mostrarDropdownPersona.value = false;
        }
    }, 300);
};

const seleccionarPersona = (persona) => {
    personaSeleccionada.value = persona;
    mostrarDropdownPersona.value = false;
    resultadosPersona.value = [];
    busquedaPersona.value = persona.nombre;
};

const asociarActor = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }
    if (!produccionSeleccionada.value || !personaSeleccionada.value || !rolActor.value.trim()) return;
    try {
        const response = await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/actores',
            {
                produccion_id: produccionSeleccionada.value.id,
                persona_id: personaSeleccionada.value.id,
                rol: rolActor.value
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log(response);
        if (response && response.status === 201 && response.data) {
            toast.add({ severity: 'success', summary: 'Actor asociado', detail: 'El actor ha sido asociado correctamente.', life: 3000, group: 'br' });
            produccionSeleccionada.value = null;
            personaSeleccionada.value = null;
            busquedaProduccion.value = '';
            busquedaPersona.value = '';
            rolActor.value = '';
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo asociar el actor.', life: 3000, group: 'br' });
        }
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo asociar el actor.', life: 3000, group: 'br' });
    }
};

// Métodos para buscador de producciones (director)
const buscarProduccionesDirector = () => {
    clearTimeout(timeoutProduccionDirector);
    if (busquedaProduccionDirector.value.trim().length < 2) {
        resultadosProduccionDirector.value = [];
        mostrarDropdownProduccionDirector.value = false;
        return;
    }
    timeoutProduccionDirector = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/producciones', {
                params: { 'titulo[like]': busquedaProduccionDirector.value }
            });
            resultadosProduccionDirector.value = data.data;
            mostrarDropdownProduccionDirector.value = true;
        } catch {
            resultadosProduccionDirector.value = [];
            mostrarDropdownProduccionDirector.value = false;
        }
    }, 300);
};

const seleccionarProduccionDirector = (prod) => {
    produccionDirectorSeleccionada.value = prod;
    mostrarDropdownProduccionDirector.value = false;
    resultadosProduccionDirector.value = [];
    busquedaProduccionDirector.value = prod.titulo;
};

// Métodos para buscador de personas (director)
const buscarPersonasDirector = () => {
    clearTimeout(timeoutPersonaDirector);
    if (busquedaPersonaDirector.value.trim().length < 2) {
        resultadosPersonaDirector.value = [];
        mostrarDropdownPersonaDirector.value = false;
        return;
    }
    timeoutPersonaDirector = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/personas', {
                params: { 'nombre[like]': busquedaPersonaDirector.value }
            });
            resultadosPersonaDirector.value = data.data;
            mostrarDropdownPersonaDirector.value = true;
        } catch {
            resultadosPersonaDirector.value = [];
            mostrarDropdownPersonaDirector.value = false;
        }
    }, 300);
};

const seleccionarPersonaDirector = (persona) => {
    personaDirectorSeleccionada.value = persona;
    mostrarDropdownPersonaDirector.value = false;
    resultadosPersonaDirector.value = [];
    busquedaPersonaDirector.value = persona.nombre;
};

const asociarDirector = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }
    if (!produccionDirectorSeleccionada.value || !personaDirectorSeleccionada.value) return;
    try {
        const response = await axios.post(
            'https://movietrackapi.up.railway.app/api/v1/directores',
            {
                produccion_id: produccionDirectorSeleccionada.value.id,
                persona_id: personaDirectorSeleccionada.value.id
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (response && response.status === 201 && response.data) {
            toast.add({ severity: 'success', summary: 'Director asociado', detail: 'El director ha sido asociado correctamente.', life: 3000, group: 'br' });
            produccionDirectorSeleccionada.value = null;
            personaDirectorSeleccionada.value = null;
            busquedaProduccionDirector.value = '';
            busquedaPersonaDirector.value = '';
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo asociar el director.', life: 3000, group: 'br' });
        }
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo asociar el director.', life: 3000, group: 'br' });
    }
};

// Ocultar dropdowns al hacer click fuera
function handleClickOutside(event) {
    if (
        mostrarDropdownProduccion.value &&
        produccionInputRef.value &&
        !produccionInputRef.value.contains(event.target)
    ) {
        mostrarDropdownProduccion.value = false;
    }
    if (
        mostrarDropdownPersona.value &&
        personaInputRef.value &&
        !personaInputRef.value.contains(event.target)
    ) {
        mostrarDropdownPersona.value = false;
    }
    if (
        mostrarDropdownProduccionDirector.value &&
        produccionDirectorInputRef.value &&
        !produccionDirectorInputRef.value.contains(event.target)
    ) {
        mostrarDropdownProduccionDirector.value = false;
    }
    if (
        mostrarDropdownPersonaDirector.value &&
        personaDirectorInputRef.value &&
        !personaDirectorInputRef.value.contains(event.target)
    ) {
        mostrarDropdownPersonaDirector.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.contenedor {
    padding-top: 7rem;
    margin-left: 10rem;
    margin-right: 10rem;
    min-height: 91.05vh;
    background-color: var(--cuaternary-color);
    padding-bottom: 1rem;
    padding-right: 5rem;
    padding-left: 5rem;
}

.tabs {
    display: flex;
    gap: 0.5rem;
}

.tabs button {
    padding: 0.7rem 2rem;
    border: none;
    background: #eee;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    color: black;
}

.tabs button.active {
    background: var(--terciary-color);
    color: black;
}

.section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0 8px 8px 8px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
}

form input,
form button,
form select,
form textarea {
    display: block;
    margin-bottom: 1rem;
    width: 500px;
    padding: 0.5rem;
    background-color: var(--quintary-color);
    color: black;
    border: 1px solid var(--terciary-color);
}

form input:focus,
form button:focus,
form select:focus,
form textarea:focus {
    outline: none;
}

form select option:hover {
    border: none;
}

form button:hover {
    background-color: var(--primary-color);
}

.dropdown-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dropdown-list {
    position: absolute;
    top: 70%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 0 0 6px 6px;
    width: 100%;
    max-width: 500px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 30;
    margin-top: 0;
    padding-left: 0;
    list-style: none;
}

.dropdown-item {
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.dropdown-item:hover {
    background: var(--cuaternary-color);
}

.seleccionado {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.seleccionado button {
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.2rem 0.7rem;
    cursor: pointer;
}

.seleccionado button:hover {
    background: var(--primary-color);
}
</style>
