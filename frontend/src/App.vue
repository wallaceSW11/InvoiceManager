<template>
  <v-app>
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      :permanent="isMdAndUp"
      :rail="isMdAndUp"
      :expand-on-hover="isMdAndUp"
      :temporary="!isMdAndUp"
      elevation="1"
    >
      <v-list nav density="comfortable">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="lg"
          color="primary"
          @click="handleNavClick"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" density="comfortable">
      <v-app-bar-nav-icon 
        v-if="!isMdAndUp" 
        @click="drawer = !drawer"
        class="text-white"
      />
      <v-toolbar-title>
        <div class="d-flex align-center">
          <img
          :src="logoUrl"
          alt="App logo"
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
      <LanguageSelector :available-locales="myCustomLocales" />
      <ThemeToggle />
    </v-app-bar>

    <v-main style="overflow: hidden;">
      <v-container fluid style="height: 100%; overflow: hidden;">
        <router-view />
      </v-container>
    </v-main>

    <ImportInvoiceDialog v-model="showImportDialog" @imported="handleInvoiceImported" />
    
    <!-- Required global components from @lib -->
    <FloatingNotify ref="floatingNotifyRef" />
    <LoadingOverlay ref="loadingOverlayRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { navigateTo } from '@/presentation/router'
import ImportInvoiceDialog from '@/presentation/components/ImportInvoiceDialog.vue'
import { 
  useNotifyStore, 
  useLoadingStore, 
  useConfirmStore,
  ThemeToggle,
  FloatingNotify,
  LoadingOverlay,
  ConfirmDialog,
  LanguageSelector,
  useThemeSync,
  useThemeStore
} from "@wallacesw11/base-lib"
import logoUrl from '@/assets/logo.png?url'
import { availableLocales as myCustomLocales } from '@/presentation/i18n'

const LOCALE_STORAGE_KEY = 'invoicemanager:locale'

const { t, locale } = useI18n()
const router = useRouter()
const themeStore = useThemeStore()
const { mdAndUp } = useDisplay()
const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

useThemeSync()

const isMdAndUp = computed(() => mdAndUp.value)
const drawer = ref(mdAndUp.value)
const showImportDialog = ref(false)
const floatingNotifyRef = ref()
const loadingOverlayRef = ref()
const confirmDialogRef = ref()

function handleNavClick() {
  if (!isMdAndUp.value) {
    drawer.value = false
  }
}

const navItems = computed(() => [
  { icon: 'mdi-home', title: t('nav.home'), to: '/' },
  { icon: 'mdi-credit-card', title: t('nav.cards'), to: '/cards' },
  { icon: 'mdi-account-group', title: t('nav.participants'), to: '/participants' },
  { icon: 'mdi-file-document-multiple', title: t('nav.invoices'), to: '/invoices' },
  { icon: 'mdi-download', title: t('nav.export'), to: '/export' },
  { icon: 'mdi-upload', title: t('nav.import'), to: '/import' },
])

async function handleInvoiceImported(invoiceId: string) {
  showImportDialog.value = false
  await navigateTo(router, `/invoice/${invoiceId}`)
}

function registerGlobalComponentRefs() {
  const notifyStore = useNotifyStore()
  const loadingStore = useLoadingStore()
  const confirmStore = useConfirmStore()

  notifyStore.setNotifyRef(floatingNotifyRef.value)
  loadingStore.setLoadingRef(loadingOverlayRef.value)
  confirmStore.setConfirmRef(confirmDialogRef.value)
}

onMounted(async () => {
  await themeStore.loadTheme()
  registerGlobalComponentRefs()
})

if (storageAvailable) {
  const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (savedLocale === 'pt-BR' || savedLocale === 'en-US') {
    locale.value = savedLocale
  }
}
</script>

