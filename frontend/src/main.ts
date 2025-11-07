import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './presentation/router'
import vuetify from './presentation/plugins/vuetify'
import i18n from './presentation/i18n'
import { registerSW } from 'virtual:pwa-register'
import { setupLib } from "@wallacesw11/base-lib"
import "@wallacesw11/base-lib/style.css"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify) // Vuetify must be registered BEFORE BaseLib
app.use(i18n)
setupLib(app) // Register BaseLib components and plugins
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})

registerSW({ immediate: true })

