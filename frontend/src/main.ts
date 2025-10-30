import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './presentation/router'
import vuetify from './presentation/plugins/vuetify'
import i18n from './presentation/i18n'
import { registerSW } from 'virtual:pwa-register'
import { setupLib } from "@lib";

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // Pinia MUST come before setupLib
setupLib(app) // Registers components and global plugins
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')

// Register service worker
registerSW({ immediate: true })

