<template>
    <div class="container">
        <div class="login-register-container">
            <div class="form-toggle">
                <button :class="{ active: isLogin }" @click="isLogin = true">Iniciar Sesión</button>
                <button :class="{ active: !isLogin }" @click="isLogin = false">Registrarse</button>
            </div>

            <form @submit.prevent="isLogin ? login() : register()">
                <div v-if="!isLogin" class="form-group">
                    <label>Nombre</label>
                    <input type="text" v-model="form.nombre" required />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="form.email" required />
                </div>

                <div class="form-group password-group">
                    <label>Contraseña</label>
                    <div class="input-password-wrapper input-password-inside">
                        <input :type="mostrarPassword ? 'text' : 'password'" v-model="form.password" required />
                        <button type="button" class="btn-ver-inside" @click="mostrarPassword = !mostrarPassword"
                            tabindex="-1">
                            <font-awesome-icon :icon="mostrarPassword ? 'eye-slash' : 'eye'"></font-awesome-icon>
                        </button>
                    </div>
                </div>

                <div v-if="!isLogin" class="form-group password-group">
                    <label>Confirmar contraseña</label>
                    <div class="input-password-wrapper input-password-inside">
                        <input :type="mostrarPassword ? 'text' : 'password'" v-model="form.password_confirmation"
                            required />
                        <button type="button" class="btn-ver-inside" @click="mostrarPassword = !mostrarPassword"
                            tabindex="-1">
                            <font-awesome-icon :icon="mostrarPassword ? 'eye-slash' : 'eye'"></font-awesome-icon>
                        </button>
                    </div>
                </div>

                <button type="submit">{{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}</button>
            </form>
        </div>
        <Toast group="br" position="bottom-right" />
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import axios from 'axios'
import { icon } from '@fortawesome/fontawesome-svg-core';

const isLogin = ref(true)
const router = useRouter()
const toast = useToast();

const form = ref({
    nombre: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const mostrarPassword = ref(false)

async function login() {
    try {
        const res = await axios.post('https://movietrackapi.up.railway.app/api/login', {
            email: form.value.email,
            password: form.value.password
        }, { withCredentials: true })

        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión iniciada correctamente', life: 3000, group: 'br' });
        setTimeout(() => router.push('/'), 1500)
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al iniciar sesión', life: 3000, group: 'br' });
    }
}

async function register() {
    try {
        await axios.post('https://movietrackapi.up.railway.app/api/register', {
            name: form.value.nombre,
            email: form.value.email,
            password: form.value.password,
            password_confirmation: form.value.password_confirmation
        }, { withCredentials: true })

        toast.add({ severity: 'success', summary: 'Éxito', detail: '¡Registro exitoso! Ahora puedes iniciar sesión', life: 3000, group: 'br' });
        setTimeout(() => {
            isLogin.value = true
        }, 1800)
    } catch (e) {
        toast.add({ severity: 'warn', summary: 'Error', detail: e.response?.data?.message || 'Error al registrarse', life: 3000, group: 'br' });
    }
}

watch(isLogin, () => {
    form.value.nombre = ''
    form.value.email = ''
    form.value.password = ''
    form.value.password_confirmation = ''
    mostrarPassword.value = false
})
</script>

<style scoped>
.container {
    padding-top: 7rem;
}

.login-register-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #f4f4f4;
    border-radius: 12px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
}

.form-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.form-toggle button {
    flex: 1;
    padding: 10px;
    background: var(--secondary-color);
    border: none;
    cursor: pointer;
    color: var(--primary-color);
    font-weight: bold;
    transition: background 0.2s, color 0.2s;
    border-radius: 6px 6px 0 0;
}

.form-toggle .active {
    background: var(--terciary-color);
    color: #fff;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    color: black;
}

.input-password-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
}

.input-password-wrapper.input-password-inside {
    position: relative;
    padding: 0;
    align-items: stretch;
}

.input-password-wrapper.input-password-inside input {
    padding-right: 2.2em;
}

.btn-ver-inside {
    position: absolute;
    right: 0.4em;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--secondary-color);
    cursor: pointer;
    font-size: 1.1em;
    padding: 0 0.3em;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 2;
}

.btn-ver-inside:focus {
    outline: none;
}

.btn-ver {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.95em;
    padding: 0 0.5em;
    transition: color 0.2s;
}

.btn-ver:hover {
    color: var(--secondary-color);
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    background: var(--cuaternary-color);
    color: black;
    outline: none;
}

input:focus {
    outline: none;
    box-shadow: none;
    border-color: var(--primary-color);
}

button[type="submit"] {
    width: 100%;
    padding: 10px;
    background: var(--terciary-color);
    color: black;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    font-weight: bold;
    margin-top: 0.5rem;
    transition: background 0.2s;
}

button[type="submit"]:hover {
    background: var(--secondary-color);
    color: white;
}

@media (max-width: 1024px) {
    .container {
        font-size: smaller;
        margin-bottom: 1rem;
    }
}

@media (max-width: 768px) {
    .container {
        padding-top: 5rem;
    }
}

@media (max-width: 650px) {
    .container {
        padding-top: 7rem;
    }
}
</style>
