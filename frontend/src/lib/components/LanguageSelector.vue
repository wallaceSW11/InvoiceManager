<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="text" icon>
        <img v-if="currentFlag" :src="currentFlag" :alt="currentLocaleName"
          style="width: 24px; height: 24px; border-radius: 4px;" />
        <v-icon v-else>mdi-earth</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="loc in locales" :key="loc.code" :active="locale === loc.code" @click="setLocale(loc.code)">
        <template v-slot:prepend>
          <img v-if="getFlagByCountryCode(loc.countryCode)" :src="getFlagByCountryCode(loc.countryCode)" :alt="loc.name"
            style="width: 24px; height: 24px; border-radius: 4px; margin-right: 12px;" />
          <v-icon v-else style="margin-right: 12px;">mdi-earth</v-icon>
        </template>
        <v-list-item-title>{{ loc.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@lib/composables/useLocale'
import type { LocaleOption } from '@lib/locales'
import currenciesData from '@lib/locales/currencies.json'

interface Props {
  availableLocales?: readonly LocaleOption[]
}

const props = defineProps<Props>()

const { locale, locales, setLocale } = useLocale(props.availableLocales)

const currentLocaleData = computed(() => {
  return locales.find((l: { code: string }) => l.code === locale.value) || locales[0]
})

const currentLocaleName = computed(() => currentLocaleData.value.name)

const currentFlag = computed(() => {
  return getFlagByCountryCode(currentLocaleData.value.countryCode)
})

function getFlagByCountryCode(countryCode: string): string | undefined {
  const currency = currenciesData.find((c: { countryCode: string }) => c.countryCode === countryCode)
  return currency ? currency.flag : undefined
}
</script>
