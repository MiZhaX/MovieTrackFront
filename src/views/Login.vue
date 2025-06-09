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

                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" v-model="form.password" required />
                </div>

                <div v-if="!isLogin" class="form-group">
                    <label>Confirmar contraseña</label>
                    <input type="password" v-model="form.password_confirmation" required />
                </div>

                <button type="submit">{{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}</button>
            </form>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div
                class="toast align-items-center text-white"
                :class="toastClass"
                role="alert"
                ref="toast"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toastMessage }}
                    </div>
                    <button
                        type="button"
                        class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Toast } from 'bootstrap'

const isLogin = ref(true)
const router = useRouter()

const form = ref({
    nombre: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const toast = ref(null)
const toastMessage = ref('')
const toastClass = ref('bg-danger')

async function showToast(message, success = false) {
    toastMessage.value = message
    toastClass.value = success ? 'bg-success' : 'bg-danger'
    await nextTick() 
    const toastInstance = Toast.getOrCreateInstance(toast.value)
    toastInstance.show()
}

async function login() {
    try {
        const res = await axios.post('https://movietrackapi.up.railway.app/api/login', {
            email: form.value.email,
            password: form.value.password
        }, { withCredentials: true })

        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)

        showToast('Sesión iniciada correctamente', true)
        setTimeout(() => router.push('/'), 1500)
    } catch (e) {
        showToast(e.response?.data?.message || 'Error al iniciar sesión')
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

        showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', true)
        setTimeout(() => {
            isLogin.value = true
        }, 1800)
    } catch (e) {
        showToast(e.response?.data?.message || 'Error al registrarse')
    }
}

watch(isLogin, () => {
    form.value.nombre = ''
    form.value.email = ''
    form.value.password = ''
    form.value.password_confirmation = ''
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
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
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

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    background: var(--cuaternary-color);
    color: black;
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
</style>
