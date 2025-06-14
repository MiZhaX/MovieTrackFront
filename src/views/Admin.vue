<template>
    <div class="contenedor">
        <h1 class="admin-title">Panel de Administrador</h1>
        <div class="tabs">
            <button :class="{ active: tab === 'producciones' }" @click="tab = 'producciones'">Producciones</button>
            <button :class="{ active: tab === 'personas' }" @click="tab = 'personas'">Personas</button>
        </div>
        <section v-if="tab === 'producciones'" class="section">
            <div class="admin-cards">
                <div class="admin-card">
                    <h2 class="card-title">Crear Producción</h2>
                    <form @submit.prevent="crearProduccion">
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
                        <input v-model="nuevaProduccion.puntuacion_critica" placeholder="Puntuación crítica"
                            type="number" min="0" max="10" step="0.1" required />
                        <button type="submit">Crear Producción</button>
                    </form>
                </div>
                <div class="actor d-flex flex-column gap-6">
                    <div class="admin-card">
                        <h2 class="card-title">Asociar actor</h2>
                        <form @submit.prevent="asociarActor">
                            <div class="dropdown-container">
                                <label><strong>Buscar Producción</strong></label>
                                <input v-model="busquedaProduccion" @input="buscarProducciones"
                                    placeholder="Buscar producción..." class="input" autocomplete="off"
                                    ref="produccionInputRef" />
                                <ul v-if="resultadosProduccion.length && mostrarDropdownProduccion"
                                    class="dropdown-list">
                                    <li v-for="prod in resultadosProduccion" :key="prod.id"
                                        @click="seleccionarProduccion(prod)" class="dropdown-item">
                                        <img :src="prod.poster" alt="poster"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ prod.titulo }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="produccionSeleccionada" class="seleccionado">
                                <span>Producción seleccionada: <b>{{ produccionSeleccionada.titulo }}</b></span>
                                <button type="button" @click="produccionSeleccionada = null">Quitar</button>
                            </div>

                            <div class="dropdown-container">
                                <label class="mt-2"><strong>Buscar Persona</strong></label>
                                <input v-model="busquedaPersona" @input="buscarPersonas" placeholder="Buscar persona..."
                                    class="input" autocomplete="off" ref="personaInputRef" />
                                <ul v-if="resultadosPersona.length && mostrarDropdownPersona" class="dropdown-list">
                                    <li v-for="persona in resultadosPersona" :key="persona.id"
                                        @click="seleccionarPersona(persona)" class="dropdown-item">
                                        <img :src="persona.imagen" alt="img"
                                            style="width:30px;height:auto;margin-right:8px;" />
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
                    <div class="admin-card">
                        <h2 class="card-title">Desasociar actor</h2>
                        <form @submit.prevent="desasociarActor">
                            <div class="dropdown-container">
                                <label><strong>Buscar Producción</strong></label>
                                <input v-model="busquedaProduccionDesasociar" @input="buscarProduccionesDesasociar"
                                    placeholder="Buscar producción..." class="input" autocomplete="off"
                                    ref="produccionDesasociarInputRef" />
                                <ul v-if="resultadosProduccionDesasociar.length && mostrarDropdownProduccionDesasociar"
                                    class="dropdown-list">
                                    <li v-for="prod in resultadosProduccionDesasociar" :key="prod.id"
                                        @click="seleccionarProduccionDesasociar(prod)" class="dropdown-item">
                                        <img :src="prod.poster" alt="poster"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ prod.titulo }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="produccionDesasociarSeleccionada" class="seleccionado">
                                <span>Producción seleccionada: <b>{{ produccionDesasociarSeleccionada.titulo
                                        }}</b></span>
                                <button type="button" @click="produccionDesasociarSeleccionada = null">Quitar</button>
                            </div>
                            <div class="dropdown-container">
                                <label class="mt-2"><strong>Buscar Persona</strong></label>
                                <input v-model="busquedaPersonaDesasociar" @input="buscarPersonasDesasociar"
                                    placeholder="Buscar persona..." class="input" autocomplete="off"
                                    ref="personaDesasociarInputRef" />
                                <ul v-if="resultadosPersonaDesasociar.length && mostrarDropdownPersonaDesasociar"
                                    class="dropdown-list">
                                    <li v-for="persona in resultadosPersonaDesasociar" :key="persona.id"
                                        @click="seleccionarPersonaDesasociar(persona)" class="dropdown-item">
                                        <img :src="persona.imagen" alt="img"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ persona.nombre }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="personaDesasociarSeleccionada" class="seleccionado">
                                <span>Persona seleccionada: <b>{{ personaDesasociarSeleccionada.nombre }}</b></span>
                                <button type="button" @click="personaDesasociarSeleccionada = null">Quitar</button>
                            </div>
                            <button type="submit" class="mt-2"
                                :disabled="!produccionDesasociarSeleccionada || !personaDesasociarSeleccionada">
                                Desasociar Actor
                            </button>
                        </form>
                    </div>
                </div>
                <div class="director d-flex flex-column gap-6">
                    <div class="admin-card">
                        <h2 class="card-title">Asociar director</h2>
                        <form @submit.prevent="asociarDirector">
                            <div class="dropdown-container">
                                <label><strong>Buscar Producción</strong></label>
                                <input v-model="busquedaProduccionDirector" @input="buscarProduccionesDirector"
                                    placeholder="Buscar producción..." class="input" autocomplete="off"
                                    ref="produccionDirectorInputRef" />
                                <ul v-if="resultadosProduccionDirector.length && mostrarDropdownProduccionDirector"
                                    class="dropdown-list">
                                    <li v-for="prod in resultadosProduccionDirector" :key="prod.id"
                                        @click="seleccionarProduccionDirector(prod)" class="dropdown-item">
                                        <img :src="prod.poster" alt="poster"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ prod.titulo }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="produccionDirectorSeleccionada" class="seleccionado">
                                <span>Producción seleccionada: <b>{{ produccionDirectorSeleccionada.titulo }}</b></span>
                                <button type="button" @click="produccionDirectorSeleccionada = null">Quitar</button>
                            </div>
                            <div class="dropdown-container">
                                <label class="mt-2"><strong>Buscar Persona</strong></label>
                                <input v-model="busquedaPersonaDirector" @input="buscarPersonasDirector"
                                    placeholder="Buscar persona..." class="input" autocomplete="off"
                                    ref="personaDirectorInputRef" />
                                <ul v-if="resultadosPersonaDirector.length && mostrarDropdownPersonaDirector"
                                    class="dropdown-list">
                                    <li v-for="persona in resultadosPersonaDirector" :key="persona.id"
                                        @click="seleccionarPersonaDirector(persona)" class="dropdown-item">
                                        <img :src="persona.imagen" alt="img"
                                            style="width:30px;height:auto;margin-right:8px;" />
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
                    <div class="admin-card">
                        <h2 class="card-title">Desasociar director</h2>
                        <form @submit.prevent="desasociarDirector">
                            <div class="dropdown-container">
                                <label><strong>Buscar Producción</strong></label>
                                <input v-model="busquedaProduccionDesasociarDirector"
                                    @input="buscarProduccionesDesasociarDirector" placeholder="Buscar producción..."
                                    class="input" autocomplete="off" ref="produccionDesasociarDirectorInputRef" />
                                <ul v-if="resultadosProduccionDesasociarDirector.length && mostrarDropdownProduccionDesasociarDirector"
                                    class="dropdown-list">
                                    <li v-for="prod in resultadosProduccionDesasociarDirector" :key="prod.id"
                                        @click="seleccionarProduccionDesasociarDirector(prod)" class="dropdown-item">
                                        <img :src="prod.poster" alt="poster"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ prod.titulo }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="produccionDesasociarDirectorSeleccionada" class="seleccionado">
                                <span>Producción seleccionada: <b>{{ produccionDesasociarDirectorSeleccionada.titulo
                                }}</b></span>
                                <button type="button"
                                    @click="produccionDesasociarDirectorSeleccionada = null">Quitar</button>
                            </div>
                            <div class="dropdown-container">
                                <label class="mt-2"><strong>Buscar Persona</strong></label>
                                <input v-model="busquedaPersonaDesasociarDirector"
                                    @input="buscarPersonasDesasociarDirector" placeholder="Buscar persona..."
                                    class="input" autocomplete="off" ref="personaDesasociarDirectorInputRef" />
                                <ul v-if="resultadosPersonaDesasociarDirector.length && mostrarDropdownPersonaDesasociarDirector"
                                    class="dropdown-list">
                                    <li v-for="persona in resultadosPersonaDesasociarDirector" :key="persona.id"
                                        @click="seleccionarPersonaDesasociarDirector(persona)" class="dropdown-item">
                                        <img :src="persona.imagen" alt="img"
                                            style="width:30px;height:auto;margin-right:8px;" />
                                        {{ persona.nombre }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="personaDesasociarDirectorSeleccionada" class="seleccionado">
                                <span>Persona seleccionada: <b>{{ personaDesasociarDirectorSeleccionada.nombre
                                }}</b></span>
                                <button type="button"
                                    @click="personaDesasociarDirectorSeleccionada = null">Quitar</button>
                            </div>
                            <button type="submit" class="mt-2"
                                :disabled="!produccionDesasociarDirectorSeleccionada || !personaDesasociarDirectorSeleccionada">
                                Desasociar Director
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <section v-else class="section">
            <div class="admin-cards">
                <div class="admin-card">
                    <h2 class="card-title">Crear Persona</h2>
                    <form @submit.prevent="crearPersona">
                        <input v-model="nuevaPersona.nombre" placeholder="Nombre" required />
                        <input v-model="nuevaPersona.fecha_nacimiento" placeholder="Fecha de nacimiento" type="date"
                            required />
                        <textarea v-model="nuevaPersona.biografia" placeholder="Biografía" required></textarea>
                        <input type="file" @change="onFileChangePersona" accept="image/*" required />
                        <button type="submit">Crear Persona</button>
                    </form>
                </div>
            </div>
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

// Estado y refs para desasociar actor
const busquedaProduccionDesasociar = ref('');
const resultadosProduccionDesasociar = ref([]);
const mostrarDropdownProduccionDesasociar = ref(false);
const produccionDesasociarSeleccionada = ref(null);

const busquedaPersonaDesasociar = ref('');
const resultadosPersonaDesasociar = ref([]);
const mostrarDropdownPersonaDesasociar = ref(false);
const personaDesasociarSeleccionada = ref(null);

const produccionDesasociarInputRef = ref(null);
const personaDesasociarInputRef = ref(null);

// Estado y refs para desasociar director
const busquedaProduccionDesasociarDirector = ref('');
const resultadosProduccionDesasociarDirector = ref([]);
const mostrarDropdownProduccionDesasociarDirector = ref(false);
const produccionDesasociarDirectorSeleccionada = ref(null);

const busquedaPersonaDesasociarDirector = ref('');
const resultadosPersonaDesasociarDirector = ref([]);
const mostrarDropdownPersonaDesasociarDirector = ref(false);
const personaDesasociarDirectorSeleccionada = ref(null);

const produccionDesasociarDirectorInputRef = ref(null);
const personaDesasociarDirectorInputRef = ref(null);

// Timeouts independientes para cada buscador
let timeoutProduccion = null;
let timeoutPersona = null;
let timeoutProduccionDirector = null;
let timeoutPersonaDirector = null;
let timeoutProduccionDesasociar = null;
let timeoutPersonaDesasociar = null;
let timeoutProduccionDesasociarDirector = null;
let timeoutPersonaDesasociarDirector = null;

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

// Buscar y seleccionar para asociar actor
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

// Buscar y seleccionar para asociar director
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

// Buscar y seleccionar para desasociar actor
const buscarProduccionesDesasociar = () => {
    clearTimeout(timeoutProduccionDesasociar);
    if (busquedaProduccionDesasociar.value.trim().length < 2) {
        resultadosProduccionDesasociar.value = [];
        mostrarDropdownProduccionDesasociar.value = false;
        return;
    }
    timeoutProduccionDesasociar = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/producciones', {
                params: { 'titulo[like]': busquedaProduccionDesasociar.value }
            });
            resultadosProduccionDesasociar.value = data.data;
            mostrarDropdownProduccionDesasociar.value = true;
        } catch {
            resultadosProduccionDesasociar.value = [];
            mostrarDropdownProduccionDesasociar.value = false;
        }
    }, 300);
};

const seleccionarProduccionDesasociar = (prod) => {
    produccionDesasociarSeleccionada.value = prod;
    mostrarDropdownProduccionDesasociar.value = false;
    resultadosProduccionDesasociar.value = [];
    busquedaProduccionDesasociar.value = prod.titulo;
};

const buscarPersonasDesasociar = () => {
    clearTimeout(timeoutPersonaDesasociar);
    if (busquedaPersonaDesasociar.value.trim().length < 2) {
        resultadosPersonaDesasociar.value = [];
        mostrarDropdownPersonaDesasociar.value = false;
        return;
    }
    timeoutPersonaDesasociar = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/personas', {
                params: { 'nombre[like]': busquedaPersonaDesasociar.value }
            });
            resultadosPersonaDesasociar.value = data.data;
            mostrarDropdownPersonaDesasociar.value = true;
        } catch {
            resultadosPersonaDesasociar.value = [];
            mostrarDropdownPersonaDesasociar.value = false;
        }
    }, 300);
};

const seleccionarPersonaDesasociar = (persona) => {
    personaDesasociarSeleccionada.value = persona;
    mostrarDropdownPersonaDesasociar.value = false;
    resultadosPersonaDesasociar.value = [];
    busquedaPersonaDesasociar.value = persona.nombre;
};

// Buscar y seleccionar para desasociar director
const buscarProduccionesDesasociarDirector = () => {
    clearTimeout(timeoutProduccionDesasociarDirector);
    if (busquedaProduccionDesasociarDirector.value.trim().length < 2) {
        resultadosProduccionDesasociarDirector.value = [];
        mostrarDropdownProduccionDesasociarDirector.value = false;
        return;
    }
    timeoutProduccionDesasociarDirector = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/producciones', {
                params: { 'titulo[like]': busquedaProduccionDesasociarDirector.value }
            });
            resultadosProduccionDesasociarDirector.value = data.data;
            mostrarDropdownProduccionDesasociarDirector.value = true;
        } catch {
            resultadosProduccionDesasociarDirector.value = [];
            mostrarDropdownProduccionDesasociarDirector.value = false;
        }
    }, 300);
};

const seleccionarProduccionDesasociarDirector = (prod) => {
    produccionDesasociarDirectorSeleccionada.value = prod;
    mostrarDropdownProduccionDesasociarDirector.value = false;
    resultadosProduccionDesasociarDirector.value = [];
    busquedaProduccionDesasociarDirector.value = prod.titulo;
};

const buscarPersonasDesasociarDirector = () => {
    clearTimeout(timeoutPersonaDesasociarDirector);
    if (busquedaPersonaDesasociarDirector.value.trim().length < 2) {
        resultadosPersonaDesasociarDirector.value = [];
        mostrarDropdownPersonaDesasociarDirector.value = false;
        return;
    }
    timeoutPersonaDesasociarDirector = setTimeout(async () => {
        try {
            const { data } = await axios.get('https://movietrackapi.up.railway.app/api/v1/personas', {
                params: { 'nombre[like]': busquedaPersonaDesasociarDirector.value }
            });
            resultadosPersonaDesasociarDirector.value = data.data;
            mostrarDropdownPersonaDesasociarDirector.value = true;
        } catch {
            resultadosPersonaDesasociarDirector.value = [];
            mostrarDropdownPersonaDesasociarDirector.value = false;
        }
    }, 300);
};

const seleccionarPersonaDesasociarDirector = (persona) => {
    personaDesasociarDirectorSeleccionada.value = persona;
    mostrarDropdownPersonaDesasociarDirector.value = false;
    resultadosPersonaDesasociarDirector.value = [];
    busquedaPersonaDesasociarDirector.value = persona.nombre;
};

// Función para desasociar actor
const desasociarActor = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }
    if (!produccionDesasociarSeleccionada.value || !personaDesasociarSeleccionada.value) return;
    try {
        await axios.delete(`https://movietrackapi.up.railway.app/api/v1/actores/${personaDesasociarSeleccionada.value.id}/${produccionDesasociarSeleccionada.value.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.add({ severity: 'success', summary: 'Actor desasociado', detail: 'El actor ha sido desasociado correctamente.', life: 3000, group: 'br' });
        produccionDesasociarSeleccionada.value = null;
        personaDesasociarSeleccionada.value = null;
        busquedaProduccionDesasociar.value = '';
        busquedaPersonaDesasociar.value = '';
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response.data.error, life: 3000, group: 'br' });
    }
};

// Función para desasociar director
const desasociarDirector = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de usuario. Inicia sesión.');
        return;
    }
    if (!produccionDesasociarDirectorSeleccionada.value || !personaDesasociarDirectorSeleccionada.value) return;
    try {
        await axios.delete(`https://movietrackapi.up.railway.app/api/v1/directores/${personaDesasociarDirectorSeleccionada.value.id}/${produccionDesasociarDirectorSeleccionada.value.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.add({ severity: 'success', summary: 'Director desasociado', detail: 'El director ha sido desasociado correctamente.', life: 3000, group: 'br' });
        produccionDesasociarDirectorSeleccionada.value = null;
        personaDesasociarDirectorSeleccionada.value = null;
        busquedaProduccionDesasociarDirector.value = '';
        busquedaPersonaDesasociarDirector.value = '';
    } catch (e) {
        console.error('Error al desasociar director:', e);
        toast.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo desasociar el director.', life: 3000, group: 'br' });
    }
}

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
    if (
        mostrarDropdownProduccionDesasociar.value &&
        produccionDesasociarInputRef.value &&
        !produccionDesasociarInputRef.value.contains(event.target)
    ) {
        mostrarDropdownProduccionDesasociar.value = false;
    }
    if (
        mostrarDropdownPersonaDesasociar.value &&
        personaDesasociarInputRef.value &&
        !personaDesasociarInputRef.value.contains(event.target)
    ) {
        mostrarDropdownPersonaDesasociar.value = false;
    }
    if (
        mostrarDropdownProduccionDesasociarDirector.value &&
        produccionDesasociarDirectorInputRef.value &&
        !produccionDesasociarDirectorInputRef.value.contains(event.target)
    ) {
        mostrarDropdownProduccionDesasociarDirector.value = false;
    }
    if (
        mostrarDropdownPersonaDesasociarDirector.value &&
        personaDesasociarDirectorInputRef.value &&
        !personaDesasociarDirectorInputRef.value.contains(event.target)
    ) {
        mostrarDropdownPersonaDesasociarDirector.value = false;
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
    padding-top: 8rem;
    min-height: 91.05vh;
    background-color: var(--cuaternary-color);
    padding-bottom: 2rem;
    padding-right: 2vw;
    padding-left: 2vw;
}

.admin-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tabs {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
}

.tabs button {
    padding: 0.7rem 2.5rem;
    border: none;
    background: var(--quintary-color);
    border-radius: 12px 12px 0 0;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.1rem;
    color: white;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.tabs button.active {
    background: var(--terciary-color);
    color: black;
    border-bottom: 2px solid var(--primary-color);
}

.section {
    margin-bottom: 2rem;
    padding: 0;
    border: none;
    background: transparent;
}

.admin-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.admin-card {
    background: white;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10), 0 1.5px 6px rgba(162, 196, 201, 0.10);
    padding: 2rem 2.5rem 1.5rem 2.5rem;
    min-width: 340px;
    max-width: 420px;
    flex: 1 1 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid var(--terciary-color);
}

.card-title {
    color: var(--secondary-color);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    text-align: center;
    letter-spacing: 0.5px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
    width: 100%;
}

form input,
form button,
form select,
form textarea {
    margin-bottom: 0.7rem;
    width: 100%;
    padding: 0.6rem 0.9rem;
    background-color: var(--cuaternary-color);
    color: #222;
    border: 1.5px solid var(--terciary-color);
    border-radius: 7px;
    font-size: 1rem;
    transition: border 0.2s;
}

form input:focus,
form select:focus,
form textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

form button {
    background: var(--secondary-color);
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.5rem;
}

form button:hover {
    background-color: var(--primary-color);
    color: black;
}

.dropdown-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.dropdown-list {
    position: absolute;
    top: 85%;
    left: 0;
    background: white;
    border: 1px solid var(--terciary-color);
    border-radius: 0 0 6px 6px;
    width: 100%;
    max-width: 100%;
    max-height: 150px;
    overflow-y: auto;
    z-index: 30;
    margin-top: 0;
    padding-left: 0;
    list-style: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dropdown-item {
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.15s;
}

.dropdown-item:hover {
    background: var(--var-cuaternary-color);
}

.seleccionado {
    margin-bottom: 0.7rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--var-cuaternary-color);
    border-radius: 6px;
    padding: 0.4rem 0.7rem;
}

.seleccionado button {
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.2rem 0.7rem;
    cursor: pointer;
    transition: background 0.2s;
}

.seleccionado button:hover {
    background: var(--primary-color);
    color: black;
}

@media (max-width: 1200px) {
    .admin-cards {
        flex-direction: column;
        align-items: center;
    }

    .admin-card {
        max-width: 95vw;
        min-width: 0;
        width: 100%;
    }

    .contenedor {
        padding-left: 1vw;
        padding-right: 1vw;
    }
}

@media (max-width: 600px) {
    .admin-card {
        padding: 1.2rem 0.5rem 1rem 0.5rem;
    }

    .admin-title {
        font-size: 1.5rem;
    }
}
</style>
