import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
  defaults: {
    VTextField: {
      variant: 'underlined',
    },
    VTextarea: {
      variant: 'underlined',
    },
    VSelect: {
      variant: 'underlined',
    },
    VAutocomplete: {
      variant: 'underlined',
    },
    VCombobox: {
      variant: 'underlined',
    },
    VFileInput: {
      variant: 'underlined',
    },
    VBtn: {
      class: 'text-none',
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#172A6F',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      dark: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
})
