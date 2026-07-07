import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f6f7fb',
          surface: '#ffffff',
          primary: '#ff6a00',
          secondary: '#a855f7',
          info: '#38bdf8',
          magenta: '#ec4899',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0c0e14',
          surface: '#171b25',
          primary: '#ff7a1a',
          secondary: '#a855f7',
          info: '#38bdf8',
          magenta: '#ec4899',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
