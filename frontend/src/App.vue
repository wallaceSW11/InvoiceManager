<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-home" :title="t('nav.home')" to="/" />
        <v-list-item prepend-icon="mdi-credit-card" :title="t('nav.cards')" to="/cards" />
        <v-list-item prepend-icon="mdi-account-group" :title="t('nav.participants')" to="/participants" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ t('app.name') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="toggleLanguage">
        <v-icon>{{ currentLocale === 'pt-BR' ? 'mdi-flag-variant' : 'mdi-flag-variant-outline' }}</v-icon>
      </v-btn>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const drawer = ref(false)
const theme = useTheme()
const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function toggleLanguage() {
  locale.value = locale.value === 'pt-BR' ? 'en-US' : 'pt-BR'
  localStorage.setItem('invoicemanager:locale', locale.value)
}

const savedLocale = localStorage.getItem('invoicemanager:locale')
if (savedLocale && (savedLocale === 'pt-BR' || savedLocale === 'en-US')) {
  locale.value = savedLocale
}
</script>
