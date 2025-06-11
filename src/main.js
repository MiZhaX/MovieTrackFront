import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import FontAwesomeIcon from './plugins/fontawesome'
import Aura from '@primeuix/themes/aura';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '../src/assets/main.css'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

// Imports Prime Vue
import Tooltip from 'primevue/tooltip';
app.directive('tooltip', Tooltip);

import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
app.use(ToastService);
app.component('Toast', Toast)

app.mount('#app')

import 'bootstrap/dist/js/bootstrap'