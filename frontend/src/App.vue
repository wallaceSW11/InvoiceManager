<template>
  <v-app>
    <v-navigation-drawer app rail expand-on-hover elevation="1">
      <v-list nav density="comfortable">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="lg"
          color="primary"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" density="comfortable">
      <v-toolbar-title>
        <div class="d-flex">
          <img
          :src="logoUrl"
          alt="InvoiceManager logo"
          width="32"
          height="32"
          cover
          rounded="lg"
          class="mr-2"
        />
        <span class="font-weight-medium">{{ t('app.title') }}</span>
        </div>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        variant="text"
        class="text-none text-white mr-2"
        prepend-icon="mdi-file-upload"
        @click="showImportDialog = true"
      >
        {{ t('invoice.import.title') }}
      </v-btn>
      <v-btn icon color="white" @click="toggleLanguage" class="mr-1">
        <v-icon>{{ currentLocale === 'pt-BR' ? 'mdi-flag-variant' : 'mdi-flag-variant-outline' }}</v-icon>
      </v-btn>
      <v-btn icon color="white" @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <ImportInvoiceDialog v-model="showImportDialog" @imported="handleInvoiceImported" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ImportInvoiceDialog from '@/presentation/components/ImportInvoiceDialog.vue'
import logoUrl from '@/assets/logo.png?url'

const LOCALE_STORAGE_KEY = 'invoicemanager:locale'
const THEME_STORAGE_KEY = 'invoicemanager:theme'

const theme = useTheme()
const { t, locale } = useI18n()
const router = useRouter()
const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const showImportDialog = ref(false)

const currentLocale = computed(() => locale.value)
const isDark = computed(() => theme.global.current.value.dark)
const navItems = computed(() => [
  { icon: 'mdi-home', title: t('nav.home'), to: '/' },
  { icon: 'mdi-credit-card', title: t('nav.cards'), to: '/cards' },
  { icon: 'mdi-account-group', title: t('nav.participants'), to: '/participants' },
  { icon: 'mdi-file-document-multiple', title: t('nav.invoices'), to: '/invoices' },
])

function toggleTheme() {
  const nextTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.change(nextTheme);
  if (storageAvailable) {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }
}

function toggleLanguage() {
  const nextLocale = locale.value === 'pt-BR' ? 'en-US' : 'pt-BR'
  locale.value = nextLocale
  if (storageAvailable) {
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
  }
}

async function handleInvoiceImported(invoiceId: string) {
  showImportDialog.value = false
  await router.push(`/invoice/${invoiceId}`)
}

if (storageAvailable) {
  const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (savedLocale === 'pt-BR' || savedLocale === 'en-US') {
    locale.value = savedLocale
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.change(savedTheme);
  }
}
</script>
