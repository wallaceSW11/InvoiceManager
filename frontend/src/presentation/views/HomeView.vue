<template>
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">{{ t('home.title') }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card @click="router.push('/cards')" style="cursor: pointer">
          <v-card-title>{{ t('home.stats.cards') }}</v-card-title>
          <v-card-text class="text-h4">{{ cardStore.cardCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card @click="router.push('/participants')" style="cursor: pointer">
          <v-card-title>{{ t('home.stats.participants') }}</v-card-title>
          <v-card-text class="text-h4">{{ participantStore.participantCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card @click="router.push('/invoices')" style="cursor: pointer">
          <v-card-title>{{ t('home.stats.invoices') }}</v-card-title>
          <v-card-text class="text-h4">{{ invoiceStore.invoiceCount }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/presentation/stores/cardStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'

const { t } = useI18n()
const router = useRouter()
const cardStore = useCardStore()
const participantStore = useParticipantStore()
const invoiceStore = useInvoiceStore()

onMounted(async () => {
  await Promise.all([
    cardStore.fetchCards(),
    participantStore.fetchParticipants(),
    invoiceStore.fetchInvoices()
  ])
})
</script>
